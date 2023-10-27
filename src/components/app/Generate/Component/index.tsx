import { useEffect, useState, useRef } from "react";
import sdk from "@stackblitz/sdk";
import type { VM } from "@stackblitz/sdk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

import InputBar from "../components/InputBar";
import makeComponent from "../commands/component";
import ApiKeyInputBar from "../components/ApiKeyInputBar";
import SettingElement from "../components/SettingElement";
import { DEFAULT_SYSTEM_PROMPT, BASE_PROJECT, ENGINE_TYPE } from "./constants";

const Components = () => {
  const [input, setInput] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [engineType, setEngineType] = useState<string>(ENGINE_TYPE[0].value);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [systemPrompt, setSystemPrompt] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [processing, setProcessing] = useState(false);
  const [vm, setVM] = useState<VM | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeVMConnection = async () => {
      const vm = await sdk.embedGithubProject("embed", BASE_PROJECT, {
        clickToLoad: false,
        height: "100%",
        view: "default",
        openFile: "src/components/index.tsx",
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
    if (apiKey == "") {
      toast.error("Need to input OpenAI Api Key");
      setApiKeyError(true);
      return;
    }
    if (input == "") {
      toast.error("Need to input prompts");
      return;
    }

    setApiKeyError(false);
    setProcessing(true);
    const result = await makeComponent(engineType, systemPrompt, input, apiKey);
    if (result.success)
      vm.applyFsDiff({ create: { "src/components/index.tsx": result.data }, destroy: [] });
    setProcessing(false);
  };

  return (
    <>
      <ToastContainer />
      <section
        className="designer-window hstack flex-grow-1 position-relative"
        style={{
          opacity: 1,
          pointerEvents: "auto",
          height: "100%",
        }}
      >
        <div
          className={`d-flex justify-content-center align-items-center position-absolute z-1 text-bg-dark w-100 h-100 opacity-50 ${
            processing ? "visible" : "invisible"
          }`}
        >
          <ClipLoader color={"#123abc"} loading={true} size={100} />
        </div>
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
        >
          <ul
            className="dropdown-menu px-3 pb-1 pt-2"
            style={{
              width: "600px",
              transform: "translateX(-50%)",
            }}
            aria-labelledby="dropdownMenuClickable"
          >
            <SettingElement title="Engine Type">
              <select
                className="form-select"
                onChange={e => {
                  setEngineType(e.target.value);
                }}
              >
                <option value={ENGINE_TYPE[0].value}>{ENGINE_TYPE[0].name}</option>
                <option value={ENGINE_TYPE[1].value} selected>
                  {ENGINE_TYPE[1].name}
                </option>
              </select>
            </SettingElement>
            <SettingElement title="System Prompt">
              <textarea
                className="form-control"
                style={{
                  height: "200px",
                }}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
              ></textarea>
            </SettingElement>
            <SettingElement title="API KEY">
              <ApiKeyInputBar error={apiKeyError} value={apiKey} setValue={setApiKey} />
            </SettingElement>
          </ul>
        </InputBar>
      </form>
    </>
  );
};

export default Components;
