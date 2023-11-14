import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import ClipLoader from "react-spinners/ClipLoader";
import { type ImageListType } from "react-images-uploading";
import { WebContainer } from "@webcontainer/api";
import JSZip from "jszip";

import { useSession } from "../../../auth/useSession";
import InputBar from "../components/InputBar";
import makeComponent, { type PromptType } from "../commands/component";
import IFrame from "../components/IFrame";
import FrameSelect from "../components/FrameSelect";
import CodingBuddy from "./CodingBuddy";
import ComponentSettings from "./ComponentSettings";
import { componentWebContainer } from "../../../../atoms";
import { files } from "./files";
import {
  SYSTEM_PROMPT,
  PROMPT_TYPE,
  ENGINE_TYPE,
  STAGE,
  FRAMES,
  PACKAGE_LOCK_FILE_PATH,
  NODE_MODULES_FILE_PATH,
} from "./constants";

const Components = () => {
  const { getSession } = useSession();

  const componentsList = [0, 1, 2];
  const [stage, setStage] = useState<STAGE>(STAGE.Init);
  const [input, setInput] = useState<string>("");
  const [engineType, setEngineType] = useState<string>(ENGINE_TYPE[0].value);
  const [promptType, setPromptType] = useState<PromptType>("Chat");
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPT.Chat[STAGE.Init]);
  const [processing, setProcessing] = useState(false);
  const [isWebContainerLoaded, setIsWebContainerLoaded] = useState<boolean>(false);
  const [srcURL, setSrcURL] = useState("");
  const [webcontainer, setWebcontainer] = useState<WebContainer | undefined>(undefined);
  const [selectedComponent, setSelectedComponent] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isCodeDisplay, setIsCodeDisplay] = useState<boolean>(false);
  const [images, setImages] = useState([]);
  const [isCoddingBuddyShow, setIsCoddingBuddyShow] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [frameType, setFrameType] = useState<FRAMES>(FRAMES.Desktop);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const addPackgeFile = async () => {
    if (!webcontainer) return;
    try {
      const response = await fetch(PACKAGE_LOCK_FILE_PATH);
      const content = await response.json();
      await webcontainer.fs.writeFile("package-lock.json", JSON.stringify(content));

      const nodeModule = await fetch(NODE_MODULES_FILE_PATH);
      const zipBlob = await nodeModule.blob();
      await unzipFile(zipBlob);
    } catch (error) {
      console.error(error);
    }
  };

  const unzipFile = async (zipBlob: Blob) => {
    if (!webcontainer) return;

    try {
      const zip = await JSZip.loadAsync(zipBlob);
      console.log(zip.files);
      const result = {};
      await Promise.all(
        Object.keys(zip.files).map(async (fileName: string) => {
          const file = zip.files[fileName];
          const content = await file.async("string");
          console.log(fileName);
          if (fileName !== "node_modules/@esbuild/win32-x64/esbuild.exe") {
            const parts = fileName.split("/");
            let current = result;

            // Build the nested structure
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];

              if (i === parts.length - 1) {
                // Last part, this is a file
                current[part] = {
                  file: {
                    contents: content,
                  },
                };
              } else {
                // Not the last part, this is a directory
                current[part] = current[part] || {};
                current[part].directory = current[part].directory || {};
                current = current[part].directory;
              }
            }
          }
        })
      );
      console.log(result);
      await webcontainer.mount(result);
      // const esbuild = await zip.files["node_modules/@esbuild/win32-x64/esbuild.exe"].async("string");
      // await webcontainer.fs.writeFile("node_modules/@esbuild/win32-x64/esbuild.exe", esbuild);
    } catch (error) {
      console.error(error);
    }
  };

  const initWebcontainer = async () => {
    if (!webcontainer) return;

    await webcontainer.mount(files);
    updateSelectedFile();
    await addPackgeFile();
    console.log("module added");
    const installProcess = await webcontainer.spawn("npm", ["install"]);
    console.log("npm install");

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    const installExitCode = await installProcess.exit;
    console.log("npm run dev");
    // `npm run dev`;
    const result = await webcontainer.spawn("npm", ["run", "dev"]);
    result.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    webcontainer.on("server-ready", (port, url) => {
      console.log("server ready");

      setSrcURL(url);
      setIsWebContainerLoaded(true);
    });
  };

  const handleInit = async () => {
    setProcessing(true);
    initWebcontainer();
    setStage(STAGE.Init);
    setPromptType("Chat");
    setSystemPrompt("");
    setInput("");
    setProcessing(false);
    const tokens = await getSession();
    if (tokens) setIsSubscribed(tokens.is_subscribed);
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

  const handleImageChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  useEffect(() => {
    // Everything around if statement
    if (settingsRef && settingsRef.current) {
      settingsRef.current.addEventListener("hide.bs.dropdown", e => {
        setIsCoddingBuddyShow(true);
      });
      settingsRef.current.addEventListener("show.bs.dropdown", e => {
        setIsCoddingBuddyShow(false);
      });
    }
  }, [settingsRef]);

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
    const checkSubscribe = async () => {
      const tokens = await getSession();
      if (tokens) setIsSubscribed(tokens.is_subscribed);
    };
    bootWebContainer();
    checkSubscribe();
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

  useEffect(() => {
    setSystemPrompt(SYSTEM_PROMPT[promptType][`${stage == STAGE.First ? STAGE.First : STAGE.Second}`]);
  }, [stage]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    getSession()
      .then(tokens => {})
      .catch(err => {
        window.location.replace("/login");
      });

    if (stage == STAGE.Init) {
      setStage(STAGE.First);
      setPromptType("Chat");
    }

    if (promptType == PROMPT_TYPE.Chat && input == "") {
      toast.error("Need to input prompts");
      return;
    }
    if (promptType == PROMPT_TYPE.Image && !images.length && stage == STAGE.First) {
      toast.error("Need to add image");
      return;
    }
    if (!isWebContainerLoaded) {
      toast.error("Webcontainer is loading, wait a sec");
      return;
    }
    if (!webcontainer) return;
    if (handleSubscribe()) return;

    setProcessing(true);
    const result = await makeComponent({
      webcontainer,
      engineType,
      systemPrompt: stage == STAGE.Init ? SYSTEM_PROMPT["Chat"][STAGE.First] : systemPrompt,
      input,
      stage: stage == STAGE.Init ? STAGE.First : stage,
      selectedComponent,
      promptType: stage == STAGE.Init ? "Chat" : promptType,
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

  //This is temporary solution
  const handleSubscribe = () => {
    if (isSubscribed) return false;
    const count = localStorage.getItem("ui-design-subscribe");
    if (Number(count) > 0) {
      let c = Number(count);
      c = c - 1;
      localStorage.setItem("ui-design-subscribe", `${c}`);
      return false;
    } else {
      //This is just temporary
      window.open("https://damidina.com/dami.html", "_blank");

      return true;
    }
  };

  const codeView = (
    <>
      <div className="w-100 h-100 overflow-hidden">
        <CodeMirror
          value={selectedFile}
          height="770px"
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
      </div>
    </>
  );

  const canvasView = (
    <>
      {isWebContainerLoaded ? (
        <IFrame src={`${srcURL}/${selectedComponent}`} classNames="h-100" frameType={frameType} />
      ) : (
        <div className="w-100 h-100"></div>
      )}

      <div
        className="m-2 py-3 h-100"
        style={{
          width: "250px",
        }}
      >
        {stage === STAGE.Second ? (
          componentsList.map(item => (
            <IFrame
              key={item}
              src={`${srcURL}/${item}`}
              onClick={() => setSelectedComponent(item)}
              isButton
              classNames={`${item == selectedComponent && "border border-3 border-primary"} mb-2`}
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </>
  );

  return (
    <>
      <ToastContainer />
      <div className="d-flex flex-row justify-content-between align-items-center py-3 ">
        <div className="text-light fw-semibold">New Component Visual Chat</div>
        <FrameSelect setFrameType={setFrameType} frameType={frameType} />
        <div className="d-flex flex-row gap-3 justify-content-center align-items-center">
          <button
            className="btn btn-primary bg-info px-3"
            onClick={() => setIsCodeDisplay(prev => !prev)}
          >
            {`${isCodeDisplay ? "View Canvas" : "View Code"}`}
          </button>
          <button className="btn btn-primary px-3 rounded bg-success" onClick={handleInit}>
            New +
          </button>
        </div>
      </div>
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
      <form onSubmit={handleSubmit} className="z-2">
        {isCoddingBuddyShow && (
          <CodingBuddy
            setPromptType={setPromptType}
            setInput={setInput}
            promptType={promptType}
            stage={stage}
            setStage={setStage}
            handleImageChange={handleImageChange}
            images={images}
            processing={processing}
          />
        )}
        <InputBar
          input={input}
          setInput={setInput}
          processing={processing}
          placeholder={`${stage == STAGE.First ? "Create Component" : "Input to update your component"}`}
          inputRef={inputRef}
          buttonRef={buttonRef}
          settingsRef={settingsRef}
          handleImageMode={() => {
            setPromptType("Image"), setStage(STAGE.First);
          }}
        >
          <ComponentSettings
            setSystemPrompt={setSystemPrompt}
            systemPrompt={systemPrompt}
            isSubscribed={isSubscribed}
            engineType={engineType}
            setEngineType={setEngineType}
            isImageMode={promptType == PROMPT_TYPE.Image}
          />
        </InputBar>
      </form>
    </>
  );
};

export default Components;
