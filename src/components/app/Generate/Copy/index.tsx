import { executeCopy, StoresType } from "../commands";
import { copyCSS, copyHTML, generatedProjectsIds } from "../../../../atoms";
import { initFrame } from "../../utils/frame";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import { saveProject } from "../../../../client_utils";
import { PROJECT_TYPE, DOCUMENT_TYPE } from "../../../../client";
import InputBar from "../components/InputBar";

const Copy = () => {
  // Auth
  const { getSession } = useSession();
  // Flow
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
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
        if (body) body.innerHTML = copyHTML.get();
        if (head) head.innerHTML = `<style>${copyCSS.get()}</style>`;
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
      if (!inputValue || !iframeSection) return;
      controller = new AbortController();
      setProcessing(true);
      isProcessing = true;
      await executeCopy(
        initFrame(iframeSection),
        controller.signal,
        `?width=${1440}&url=${inputValue}`,
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
                name: `${inputValue}`,
                description: `${inputValue}`,
                public: true,
                url: "",
                img_url: "",
                tags: ["copy"],
              },
              [
                {
                  type: DOCUMENT_TYPE.HTML,
                  text: copyHTML.get(),
                },
              ],
              [],
              []
            );
            generatedProjectsIds.set({ ...generatedProjectsIds.get(), Copy: res.id });
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
      <InputBar
        input={input}
        setInput={setInput}
        inputRef={inputRef}
        buttonRef={buttonRef}
        processing={processing}
        placeholder="https://"
      />
    </>
  );
};

export default Copy;
