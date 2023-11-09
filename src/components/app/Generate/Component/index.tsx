import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import ClipLoader from "react-spinners/ClipLoader";
import ImageUploading, { type ImageListType } from "react-images-uploading";
import { WebContainer } from "@webcontainer/api";

import { useSession } from "../../../auth/useSession";
import InputBar from "../components/InputBar";
import makeComponent, { type PromptType } from "../commands/component";
import ApiKeyInputBar from "../components/ApiKeyInputBar";
import SettingElement from "../components/SettingElement";
import IFrame from "../components/IFrame";
import { SYSTEM_PROMPT, PROMPT_TYPE, ENGINE_TYPE, STAGE } from "./constants";
import { files } from "./files";
import { componentWebContainer } from "../../../../atoms";

const Components = () => {
  const { getSession } = useSession();

  const componentsList = [0, 1, 2];
  const [stage, setStage] = useState<STAGE>(STAGE.First);
  const [input, setInput] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [engineType, setEngineType] = useState<string>(ENGINE_TYPE[0].value);
  const [promptType, setPromptType] = useState<PromptType>("Chat");
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPT.Chat[STAGE.First]);
  const [processing, setProcessing] = useState(false);
  const [isWebContainerLoaded, setIsWebContainerLoaded] = useState<boolean>(false);
  const [srcURL, setSrcURL] = useState("");
  const [webcontainer, setWebcontainer] = useState<WebContainer | undefined>(undefined);
  const [selectedComponent, setSelectedComponent] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isCodeDisplay, setIsCodeDisplay] = useState<boolean>(false);
  const [images, setImages] = useState([]);

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
      setIsWebContainerLoaded(true);
    });
  };

  const handleInit = async () => {
    setProcessing(true);
    initWebcontainer();
    setStage(STAGE.First);
    setSystemPrompt(SYSTEM_PROMPT[promptType][STAGE.Second]);
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

  const handleImageChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  useEffect(() => {
    const bootWebContainer = async () => {
      if (componentWebContainer.get()) {
        setWebcontainer(componentWebContainer.get());
        return;
      }
      // Call only once
      const webcontainerInstance = await WebContainer.boot();
      componentWebContainer.set(webcontainerInstance || undefined);
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

  useEffect(() => {
    setSystemPrompt(SYSTEM_PROMPT[promptType][`${stage == STAGE.First ? STAGE.First : STAGE.Second}`]);
  }, [promptType]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    getSession()
      .then(tokens => {
        // all good
      })
      .catch(err => {
        window.location.replace("/login");
      });

    if (apiKey == "") {
      toast.error("Need to input OpenAI Api Key");
      setApiKeyError(true);
      return;
    }
    if (promptType == PROMPT_TYPE.Chat && input == "") {
      toast.error("Need to input prompts");
      return;
    }
    if (promptType == PROMPT_TYPE.Image && !images.length && stage != STAGE.First) {
      toast.error("Need to add image");
      return;
    }
    if (!isWebContainerLoaded) {
      toast.error("Webcontainer is loading, wait a sec");
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
      promptType,
      image: images[0]?.dataURL,
    });
    if (result) {
      if (promptType == PROMPT_TYPE.Image) {
        setPromptType("Chat");
        setStage(STAGE.Last);
      }
      setSrcURL(" " + srcURL);
      updateSelectedFile();
      if (stage == STAGE.Second) setSelectedComponent(0);
      setStage(prev => {
        if (prev == STAGE.First) return STAGE.Second;
        if (prev == STAGE.Second) return STAGE.Last;
        return STAGE.Last;
      });
      setSystemPrompt(SYSTEM_PROMPT[promptType][STAGE.Second]);
      setInput("");
    } else {
      toast.error("The sever had an error while processing your request.");
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
      {isWebContainerLoaded ? (
        <IFrame src={`${srcURL}/${selectedComponent}`} classNames="w-100 h-100" />
      ) : (
        <div className="w-100 h-100"></div>
      )}

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
            <SettingElement title="Prompt Type">
              <select
                className="form-select"
                onChange={e => {
                  if (e.target.value == "Image" || e.target.value == "Chat")
                    setPromptType(e.target.value);
                }}
                defaultValue={PROMPT_TYPE.Chat}
                value={promptType}
              >
                <option value="Chat">Chat</option>
                <option value="Image">Image</option>
              </select>
            </SettingElement>
            {promptType === PROMPT_TYPE.Image && (
              <SettingElement title="Image">
                <ImageUploading value={images} onChange={handleImageChange}>
                  {({ imageList, onImageUpload }) => (
                    <div className="d-flex flex-row gap-3">
                      <button
                        className="btn btn-secondary h-50"
                        onClick={e => {
                          e.preventDefault();
                          onImageUpload();
                        }}
                      >
                        Upload image
                      </button>
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image.dataURL} alt="" width="250" />
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </SettingElement>
            )}

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
