import { executeRemix } from "../commands";
import { inputPrompt, remixHTML, remixCSS, generatedProjectsIds } from "../../../../atoms";
import { initFrame } from "../../utils/frame";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import { saveProject } from "../../../../client_utils";
import { PROJECT_TYPE, DOCUMENT_TYPE } from "../../../../client";

const Remix = () => {
  // Auth
  const { getSession } = useSession();
  // Flow
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [inputURL, setInputURL] = useState("");
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const inputURLRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Generate
  useEffect(() => {
    if (!buttonRef.current) return;
    const iframeSection = sectionRef.current;
    const iframe = iframeSection && initFrame(iframeSection);
    if (iframe)
      iframe.onload = () => {
        const head = iframe.contentWindow?.document.head;
        const body = iframe.contentWindow?.document.body;
        if (body) body.innerHTML = remixHTML.get();
        if (head) head.innerHTML = `<style>${remixCSS.get()}</style>`;
      };
    var isProcessing = false;
    var controller: AbortController | undefined = undefined;
    async function initGenerate() {
      if (controller && isProcessing) {
        controller.abort();
        setProcessing(false);
        isProcessing = false;
        return;
      }
      const tokens = await getSession();
      if (!tokens) throw new Error("Relogin please.");
      const inputValue = inputRef.current?.value;
      const inputURL = inputURLRef.current?.value;
      if (!inputValue || !inputURL || !iframeSection) return;
      controller = new AbortController();
      setProcessing(true);
      isProcessing = true;
      await executeRemix(
        initFrame(iframeSection),
        controller.signal,
        `?width=${1440}&url=${inputURL}&prompt=${inputValue}`,
        async (ok: boolean) => {
          setProcessing(false);
          isProcessing = false;
          if (ok) {
            const tokens = await getSession();
            if (!tokens) throw Error("No session");
            const res = await saveProject(
              tokens.id_token,
              PROJECT_TYPE.HTML_CSS,
              {
                name: `${inputValue} + ${inputURL}`,
                description: `${inputValue} + ${inputURL}`,
                public: true,
                url: "",
                img_url: "",
                tags: ["remix"],
              },
              [
                {
                  type: DOCUMENT_TYPE.HTML,
                  text: remixHTML.get(),
                },
              ],
              [],
              []
            );
            generatedProjectsIds.set({ ...generatedProjectsIds.get(), Remix: res.id });
          }
        }
      );
    }
    buttonRef.current.addEventListener("click", initGenerate);
    document.addEventListener("keydown", async e => {
      if (e.key === "Enter" && !processing) await initGenerate();
    });
    return () => {
      buttonRef.current?.removeEventListener("click", () => {});
      document.removeEventListener("keydown", () => {});
    };
  }, []);
  return (
    <>
      <section className="designer-window hstack flex-grow-1">
        <section
          ref={sectionRef}
          id="iframe-section-copy"
          style={{ height: "100%", width: "100%" }}
        ></section>
      </section>
      <div className="hstack gap-2 designer-form">
        <input
          ref={inputRef}
          className="form-control"
          style={{ height: "100%" }}
          type="text"
          placeholder={"Describe your design"}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={processing}
        />
        <input
          ref={inputURLRef}
          className="form-control"
          style={{ height: "100%" }}
          type="text"
          placeholder={"https://"}
          value={inputURL}
          onChange={e => setInputURL(e.target.value)}
          disabled={processing}
        />
        <button
          ref={buttonRef}
          className="btn btn-primary"
          style={{ height: "100%", width: "200px" }}
          type="button"
        >
          {processing ? "Stop" : "Remix"}
        </button>
      </div>
    </>
  );
};

export default Remix;
