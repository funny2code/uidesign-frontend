import { SPACING_VALUES, FONT_NAMES, FONT_SIZES, COLORS, CSS_CONFIG, BORDER_RADIUS } from "./constants";
import { createHead, createBody } from "../../../../atoms";
import { parseConfigParams } from "../../utils/params";
import { useSession } from "../../../auth/useSession";
import { useState, useRef, useEffect } from "react";
import { initFrame } from "../../utils/frame";
import InputBar from "../components/InputBar";
import { executeCreate2 } from "../commands";
import type { IValue } from "./types";
import OptionElement from "../components/Option";

const Create2 = () => {
  // Auth
  const { getSession } = useSession();
  // Flow
  const [processing, setProcessing] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<IValue | undefined>(undefined);
  const [selectedFontSize, setSelectedFontSize] = useState<IValue | undefined>(undefined);
  const [selectedFontFamily, setSelectedFontFamily] = useState<IValue | undefined>(undefined);
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<IValue | undefined>(undefined);
  const [selectedSpacing, setSelectedSpacing] = useState<IValue | undefined>(undefined);
  const [selectedCSS, setSelectedCSS] = useState<IValue>(CSS_CONFIG[0]);
  const [input, setInput] = useState("");
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [controller, setController] = useState<AbortController | undefined>(undefined);
  async function initGenerate() {
    if (controller && processing) {
      controller.abort();
      setProcessing(false);
      return;
    }
    const iframeSection = sectionRef.current;
    if (!iframeSection) return;
    const tokens = await getSession();
    if (!tokens) throw new Error("Relogin please.");
    const control = new AbortController();
    setController(control);
    setProcessing(true);
    const queryParams = parseConfigParams(input, {
      font_size: selectedFontSize?.value || "",
      font_family: selectedFontFamily?.value || "",
      spacing_values: selectedSpacing?.value || "",
      border_radius: selectedBorderRadius?.value || "",
      background_color: selectedBackgroundColor?.name || "",
      style: selectedCSS.value || "",
    });
    console.log(queryParams);
    await executeCreate2(
      initFrame(iframeSection),
      control.signal,
      queryParams,
      tokens.id_token,
      async (ok: boolean) => {
        setProcessing(false);
      }
    );
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await initGenerate();
  };
  // Generate
  useEffect(() => {
    if (!buttonRef.current) return;
    const iframeSection = sectionRef.current;
    const iframe = iframeSection && initFrame(iframeSection);
    if (iframe)
      iframe.onload = () => {
        const head = iframe.contentWindow?.document.head;
        const body = iframe.contentWindow?.document.body;
        if (body) body.innerHTML = createBody.get();
        if (head) head.innerHTML = createHead.get();
      };
    return () => {};
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
      <form onSubmit={handleSubmit}>
        <InputBar
          input={input}
          setInput={setInput}
          processing={processing}
          placeholder="Describe your design"
          inputRef={inputRef}
          buttonRef={buttonRef}
        >
          <ul
            className="dropdown-menu mb-3 p-1 pb-2"
            style={{
              width: "360px",
              transform: "translateX(-50%)",
            }}
            aria-labelledby="dropdownMenuClickable"
          >
            <li className="my-1 row px-3 pt-1">
              <span style={{ cursor: "pointer" }}>Background Color</span>
              <ul className="list-group list-group-horizontal gap-0 pt-2 px-2">
                {COLORS.map((color, i) => (
                  <button
                    key={color.name}
                    type={"button"}
                    onClick={() => setSelectedBackgroundColor(color)}
                    className={`btn btn-outline-secondary p-0 px-1 m-0 border-0 ${
                      selectedBackgroundColor?.name === color.name ? "active border" : ""
                    }`}
                    style={{ width: "42px", height: "42px" }}
                  >
                    <li
                      className="p-0 m-0"
                      style={{
                        backgroundColor: color.value,
                        color: color.value,
                        border: "1px solid #555555",
                        listStyleType: "none",
                        borderRadius: "100%",
                        width: "32px",
                        height: "32px",
                        padding: "0px",
                        margin: "0px",
                      }}
                    ></li>
                  </button>
                ))}
              </ul>
            </li>
            <OptionElement
              title={"Font Size"}
              values={FONT_SIZES}
              selected={selectedFontSize}
              setSelected={setSelectedFontSize}
            />
            <OptionElement
              title={"Font Family"}
              values={FONT_NAMES}
              selected={selectedFontFamily}
              setSelected={setSelectedFontFamily}
            />
            <OptionElement
              title={"Border Radius"}
              values={BORDER_RADIUS}
              selected={selectedBorderRadius}
              setSelected={setSelectedBorderRadius}
            />
            <OptionElement
              title={"Spacing"}
              values={SPACING_VALUES}
              selected={selectedSpacing}
              setSelected={setSelectedSpacing}
            />
            <OptionElement
              title={"CSS Config"}
              values={CSS_CONFIG}
              selected={selectedCSS}
              setSelected={setSelectedCSS}
            />
          </ul>
        </InputBar>
      </form>
    </>
  );
};

export default Create2;
