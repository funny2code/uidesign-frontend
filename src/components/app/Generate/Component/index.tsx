import { useEffect, useState, useRef } from "react";
import sdk from "@stackblitz/sdk";
import InputBar from "../components/InputBar";
import makeComponent from "../commands/component";
import type { VM } from "@stackblitz/sdk";

const Components = () => {
  const project = "emanation-ai/vite-ts-react-shadcn-tw/tree/component-base"; //example

  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [vm, setVM] = useState<VM | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeVMConnection = async () => {
      const vm = await sdk.embedGithubProject("embed", project, {
        clickToLoad: false,
        height: "100%",
        view: "default",
        openFile: "tailwind.config.js",
      });
      vm.editor.setView("default");
      setVM(vm);
    };
    initializeVMConnection().catch(e => {
      console.log("VM error", e);
    });
    return () => {};
  }, []);

  const handleSubmit = async (e: any) => {
    if (!vm) return;
    e.preventDefault();
    setProcessing(true);
    const result = await makeComponent(input);
    if (result.success)
      vm.applyFsDiff({ create: { "src/components/index.tsx": result.data }, destroy: [] });
    setProcessing(false);
  };

  return (
    <>
      <section
        className="designer-window hstack flex-grow-1"
        style={{
          opacity: 1,
          pointerEvents: "auto",
          height: "100%",
        }}
      >
        <div
          id="embed"
          style={{
            width: "100%",
          }}
        ></div>
      </section>
      <form onSubmit={handleSubmit}>
        <InputBar
          input={input}
          setInput={setInput}
          processing={processing}
          placeholder="Create Component"
          inputRef={inputRef}
          buttonRef={buttonRef}
        ></InputBar>
      </form>
    </>
  );
};

export default Components;
