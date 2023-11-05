import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import ClipLoader from "react-spinners/ClipLoader";
import InputBar from "../components/InputBar";
import makeComponent from "../commands/component";
import ApiKeyInputBar from "../components/ApiKeyInputBar";
import SettingElement from "../components/SettingElement";
import IFrame from "../components/IFrame";
import { SYSTEM_PROMPT, BASE_PROJECT, ENGINE_TYPE, STAGE } from "./constants";
import { WebContainer } from "@webcontainer/api";
import { files } from "./files";

const Components = () => {
  const componentsList = [0, 1, 2];
  const [stage, setStage] = useState<STAGE>(STAGE.First);
  const [input, setInput] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [engineType, setEngineType] = useState<string>(ENGINE_TYPE[0].value);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPT[STAGE.First]);
  const [processing, setProcessing] = useState(true);
  const [srcURL, setSrcURL] = useState("");
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isCodeDisplay, setIsCodeDisplay] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const initWebcontainer = async () => {
    if (!webcontainer) return;
    await webcontainer.mount(files);

    updateSelectedFile();

    const installProcess = await webcontainer.spawn("npm", ["install"]);
    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      throw new Error("Unable to run npm install");
    }
    // `npm run dev`
    await webcontainer.spawn("npm", ["run", "dev"]);
    webcontainer.on("server-ready", (port, url) => {
      setSrcURL(url);
      setProcessing(false);
    });
  };

  const handleInit = async () => {
    setProcessing(true);
    initWebcontainer();
    setStage(STAGE.First);
    setSystemPrompt(SYSTEM_PROMPT[STAGE.Second]);
    setInput("");
  };

  const handleChangeCode = async (value: string) => {
    if (!webcontainer) return;
    await webcontainer.fs.writeFile(`/src/component${selectedComponent}.tsx`, value);
    setSelectedFile(value);
  };

  const updateSelectedFile = async () => {
    if (!webcontainer) return;
    const file = await webcontainer.fs.readFile(`src/component${selectedComponent}.tsx`, "utf-8");
    setSelectedFile(file);
  };
  //Useeffect

  useEffect(() => {
    const bootWebContainer = async () => {
      // Call only once
      if (webcontainer) return;
      const webcontainerInstance = await WebContainer.boot();
      setWebcontainer(webcontainerInstance);
    };
    bootWebContainer();
    return () => {};
  }, []);

  useEffect(() => {
    initWebcontainer();
  }, [webcontainer]);

  useEffect(() => {
    updateSelectedFile();
  }, [selectedComponent]);

  const handleSubmit = async (e: any) => {
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
    if (!webcontainer) return;

    setApiKeyError(false);
    setProcessing(true);
    const result = await makeComponent({
      webcontainer,
      engineType,
      systemPrompt,
      input,
      apiKey,
      stage,
      selectedComponent,
    });
    if (result) {
      setSrcURL(" " + srcURL);
      updateSelectedFile();
      if (stage == STAGE.Second) setSelectedComponent(0);
      setStage(prev => {
        if (prev == STAGE.First) return STAGE.Second;
        if (prev == STAGE.Second) return STAGE.Last;
        return STAGE.Last;
      });
      setSystemPrompt(SYSTEM_PROMPT[STAGE.Second]);
      setInput("");
    }
    setProcessing(false);
  };

  const codeView = (
    <>
      <div className="w-100 h-100 overflow-hidden">
        <CodeMirror
          value={selectedFile}
          height="850px"
          theme={okaidia}
          extensions={[javascript({ jsx: true })]}
          onChange={value => handleChangeCode(value)}
        />
      </div>
      <div
        className="d-flex flex-column m-2 py-3 justify-content-between align-items-center h-100"
        style={{
          width: "250px",
        }}
      >
        <IFrame src={`${srcURL}/${selectedComponent}`} isButton />
        <div className="d-flex flex-row gap-3 justify-content-center align-items-center w-100">
          <button className="btn btn-primary" onClick={() => setIsCodeDisplay(prev => !prev)}>
            Canvas
          </button>
          <button className="btn btn-primary" onClick={handleInit}>
            New +
          </button>
        </div>
      </div>
    </>
  );

  const canvasView = (
    <>
      <IFrame src={`${srcURL}/${selectedComponent}`} classNames="w-100 h-100" />
      <div
        className="d-flex flex-column m-2 py-3 justify-content-between align-items-center h-100"
        style={{
          width: "250px",
        }}
      >
        {stage === STAGE.Second ? (
          <div>
            {componentsList.map(item => (
              <IFrame
                key={item}
                src={`${srcURL}/${item}`}
                onClick={() => setSelectedComponent(item)}
                isButton
                classNames={`${item == selectedComponent && "border border-3 border-primary mb-2"} mb-2`}
              />
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div className="d-flex flex-row gap-3 justify-content-center align-items-center w-100">
          <button className="btn btn-primary" onClick={() => setIsCodeDisplay(prev => !prev)}>
            Code
          </button>
          <button className="btn btn-primary" onClick={handleInit}>
            New +
          </button>
        </div>
      </div>
    </>
  );

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
        {processing ? (
          <div
            className={`d-flex justify-content-center align-items-center position-absolute z-1 text-bg-dark w-100 h-100 opacity-50`}
          >
            <ClipLoader color={"#123abc"} loading={true} size={100} />
          </div>
        ) : isCodeDisplay ? (
          codeView
        ) : (
          canvasView
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <InputBar
          input={input}
          setInput={setInput}
          processing={processing}
          placeholder={`${stage == STAGE.First ? "Create Component" : "Input to update your component"}`}
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
                defaultValue={ENGINE_TYPE[1].value}
              >
                <option value={ENGINE_TYPE[0].value}>{ENGINE_TYPE[0].name}</option>
                <option value={ENGINE_TYPE[1].value}>{ENGINE_TYPE[1].name}</option>
              </select>
            </SettingElement>
            <SettingElement title="System Prompt">
              <textarea
                className="form-control"
                style={{
                  height: "200px",
                }}
                value={systemPrompt}
                disabled
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
