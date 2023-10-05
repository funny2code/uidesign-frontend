import { createCSS, createHTML } from "../../../../atoms";
import { executeOld } from "../commands/old";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import { initFrame } from "../../utils/frame";

const Create = () => {
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
        if (body) body.innerHTML = createHTML.get();
        if (head) head.innerHTML = `<style>${createCSS.get()}</style>`;
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
      await executeOld(
        initFrame(iframeSection),
        controller.signal,
        `?prompt=${inputValue}`,
        tokens.id_token,
        async (ok: boolean) => {
          setProcessing(false);
          isProcessing = false;
          if (ok) {
            const tokens = await getSession();
            if (!tokens) throw Error("No session");
          }
        }
      );
    }
    buttonRef.current.addEventListener("click", e => {
      e.preventDefault();
      initGenerate();
    });
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
          id="iframe-section-create"
          style={{ height: "100%", width: "100%" }}
        ></section>
      </section>
      <div className="hstack gap-2 designer-form">
        <input
          ref={inputRef}
          className="form-control"
          style={{ height: "100%" }}
          type="text"
          placeholder={"Describe your design (old)"}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={processing}
        />
        <button
          ref={buttonRef}
          className="btn btn-primary"
          style={{ height: "100%", width: "200px" }}
          type="button"
        >
          {processing ? "Stop" : "Create Design"}
        </button>
      </div>
    </>
  );
};

export default Create;
