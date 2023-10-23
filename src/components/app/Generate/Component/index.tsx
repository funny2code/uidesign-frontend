import { useEffect, useState, useRef } from "react";
import sdk from "@stackblitz/sdk";
import InputBar from "../components/InputBar";

const Components = () => {
  const project = "emanation-ai/vite-ts-react-shadcn-tw/tree/dev-auth"; //example

  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);

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
    };
    initializeVMConnection().catch(e => {
      console.log("VM error", e);
    });
    return () => {};
  }, []);

  const handleSubmit = () => {
    //to do
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
          placeholder="Create design"
          inputRef={inputRef}
          buttonRef={buttonRef}
        ></InputBar>
      </form>
    </>
  );
};

export default Components;
