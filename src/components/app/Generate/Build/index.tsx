import { useSession } from "../../../auth/useSession";
import { OPTIONS, PROMPT_OPTIONS } from "./constants";
import { useState, useRef, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import OptionElement from "../components/Option";
import { executeBuild } from "../commands/build";
import { vmFilesState } from "../../../../atoms";
import type { IValue } from "../Create/types";
import InputBar from "../components/InputBar";
import type { VM } from "@stackblitz/sdk";
import sdk from "@stackblitz/sdk";
import { toTitleCase, getOptions } from "./utils";

// todo: handle file save
const DEFAULT_AUTOSAVE_TIME = 30000;
const Build = ({ height }: { height: number }) => {
  const [showProjectTypes, setShowProjectTypes] = useState<boolean>(true);
  // Auth
  const { getSession } = useSession();
  // Flow
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<IValue[]>([]);
  const [projectType, setProjectType] = useState<IValue>(OPTIONS[0]);
  const [promptType, setPromptType] = useState<IValue>(PROMPT_OPTIONS[0]);
  const [vm, setVM] = useState<VM | undefined>(undefined);
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [controller, setController] = useState<AbortController | undefined>(undefined);
  async function initGenerate() {
    if (controller && processing) {
      controller.abort();
      setProcessing(false);
      return;
    }
    const iframeSection = sectionRef.current;
    if (!iframeSection || !vm) return;
    const tokens = await getSession();
    if (!tokens) throw new Error("Relogin please.");
    const control = new AbortController();
    setController(control);
    setProcessing(true);
    const type = projectType.value.replace("tree/", "").replace("dev-", "").replace("emanation-ai/", "");
    const queryParams = `?prompt=${input}&project_type=${type}&prompt_type=${promptType.value}`;
    await executeBuild(vm, control.signal, queryParams, tokens.id_token, async (ok: boolean) => {
      setProcessing(false);
    });
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await initGenerate();
  };
  useEffect(() => {
    if (!buttonRef.current) return;
    if (!iframeRef.current || !sectionRef.current) return;
    let virtualMachine: VM | undefined = undefined;
    const getFiles = async () => {
      if (!virtualMachine) return;
      const files = await virtualMachine.getFsSnapshot();
      vmFilesState.set(files || undefined);
    };
    const initializeVMConnection = async () => {
      if (!iframeRef?.current) return;
      const vm = await sdk.embedGithubProject("embed", `${projectType.value}`, {
        clickToLoad: false,
        height: height,
        view: "default",
        openFile: "tailwind.config.js",
      });
      setVM(vm);
      vm.editor.setView("default");
      virtualMachine = vm;
    };
    initializeVMConnection().catch(e => {
      console.log("VM error", e);
    });
    // const interval = setInterval(getFiles, DEFAULT_AUTOSAVE_TIME);
    return () => {
      // window.clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const updateFrame = async () => {
      const vm = await sdk.embedGithubProject("embed", `${projectType.value}`, {
        clickToLoad: false,
        height: height,
        view: "default",
        openFile: "tailwind.config.js",
      });
      setVM(vm);
    };
    updateFrame();
    getOptions(projectType.value).then(data => {
      setOptions(prev => {
        const newData = data.map(item => ({
          name: toTitleCase(item.key.replace("_", " ")),
          value: item.key,
        }));
        return [
          {
            name: "Colors",
            value: "colors",
          },
          ...newData,
        ];
      });
    });
  }, [projectType]);

  return (
    <>
      <section
        ref={sectionRef}
        className="designer-window hstack flex-grow-1"
        style={{
          // marginTop: "0",
          // marginBottom: "40px",
          opacity: showProjectTypes ? "0" : "1",
          pointerEvents: showProjectTypes ? "none" : "auto",
          height: showProjectTypes ? 0 : "100%",
        }}
      >
        <div
          ref={iframeRef}
          id="embed"
          style={{
            width: "100%",
          }}
        ></div>
      </section>
      {showProjectTypes ? (
        <div className="container text-center" style={{ height: "85vh", overflow: "auto" }}>
          <h4 className="py-2 mb-3">Jump-start your project with these ready-to-use templates</h4>
          <div className="row text-start" style={{ height: "100%" }}>
            {OPTIONS.map((item, index) => (
              <div className="col-4 mb-4" key={`card-${index}`}>
                <ProjectCard
                  name={item.name}
                  setSelected={() => {
                    setShowProjectTypes(false);
                    setProjectType(item);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <InputBar
              input={input}
              setInput={setInput}
              processing={processing}
              placeholder="Create design"
              inputRef={inputRef}
              buttonRef={buttonRef}
              promptType={promptType}
              promptOptions={options}
              setPromptType={setPromptType}
            >
              <ul
                className="dropdown-menu mb-3 p-1 pb-2"
                style={{
                  width: "200px",
                  transform: "translateX(-50%)",
                }}
                aria-labelledby="dropdownMenuClickable"
              >
                <OptionElement
                  title={"Project Type"}
                  values={OPTIONS}
                  selected={projectType}
                  setSelected={setProjectType}
                  horizontal={false}
                />
              </ul>
            </InputBar>
          </form>
        </>
      )}
    </>
  );
};

export default Build;
