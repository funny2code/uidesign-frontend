import type React from "react";
import OptionElement from "./Option";
import type { IValue } from "../Create/types";

interface InputBarProps extends React.PropsWithChildren {
  input: string;
  setInput: (input: string) => void;
  processing: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  settingsRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  placeholder: string;
  center?: boolean;
  promptType?: IValue;
  promptOptions?: IValue[];
  setPromptType?: React.Dispatch<React.SetStateAction<IValue>>;
  isImageMode?: boolean;
}

const InputBar = ({
  input,
  setInput,
  processing,
  inputRef,
  buttonRef,
  settingsRef,
  placeholder,
  children,
  center = true,
  promptType,
  promptOptions,
  setPromptType,
  isImageMode = false,
}: InputBarProps) => {
  return (
    <div className="hstack designer-form p-1">
      <input
        ref={inputRef}
        className="form-control border-0"
        style={{
          height: "100%",
          borderRadius: "4px 0px 0px 4px",
          border: "1px solid #fff",
          borderRight: "0px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          outline: "none",
        }}
        type="text"
        placeholder={placeholder || "Describe your design"}
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={processing}
      />
      {promptType && setPromptType && (
        <div
          className="dropdown"
          style={{
            height: "100%",
          }}
        >
          <button
            type={"button"}
            className="btn btn-outline-secondary text-dark"
            aria-expanded="false"
            style={{ height: "96%", width: "64px", marginTop: "1px", marginBottom: "1px" }}
            id="dropdownPromptMenuClickable"
            data-bs-toggle="dropdown"
            data-bs-auto-close="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              width="28"
              height="28"
            >
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
          </button>
          <ul
            className="dropdown-menu mb-3 p-1 pb-2"
            style={{
              width: "200px",
              transform: "translateX(-30%)",
            }}
            aria-labelledby="dropdownPromptMenuClickable"
          >
            {promptOptions && (
              <OptionElement
                title={"Prompt Type"}
                values={promptOptions}
                selected={promptType}
                setSelected={setPromptType}
                horizontal={false}
              />
            )}
          </ul>
        </div>
      )}
      <div
        className={center ? "dropdown-center" : "dropdown"}
        style={{
          height: "100%",
        }}
        id="settings-dropdown"
        ref={settingsRef}
      >
        {isImageMode && (
          <button
            type={"button"}
            className="btn text-dark"
            style={{
              height: "96%",
              width: "64px",
              marginTop: "1px",
              marginBottom: "1px",
              position: "absolute",
              right: "40px",
            }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 1024 1024"
              height="28"
              width="28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M864 260H728l-32.4-90.8a32.07 32.07 0 0 0-30.2-21.2H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 260H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V340c0-44.2-35.8-80-80-80zM512 716c-88.4 0-160-71.6-160-160s71.6-160 160-160 160 71.6 160 160-71.6 160-160 160zm-96-160a96 96 0 1 0 192 0 96 96 0 1 0-192 0z"></path>
            </svg>
          </button>
        )}

        <button
          type={"button"}
          className="btn text-dark"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            height: "96%",
            width: "64px",
            marginTop: "1px",
            marginBottom: "1px",
            position: "absolute",
            right: "0",
          }}
          id="dropdownMenuClickable"
          data-bs-auto-close="false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 8a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-2 12c-.25 0-.46-.18-.5-.42l-.37-2.65c-.63-.25-1.17-.59-1.69-.99l-2.49 1.01c-.22.08-.49 0-.61-.22l-2-3.46a.493.493 0 0 1 .12-.64l2.11-1.66L4.5 12l.07-1l-2.11-1.63a.493.493 0 0 1-.12-.64l2-3.46c.12-.22.39-.31.61-.22l2.49 1c.52-.39 1.06-.73 1.69-.98l.37-2.65c.04-.24.25-.42.5-.42h4c.25 0 .46.18.5.42l.37 2.65c.63.25 1.17.59 1.69.98l2.49-1c.22-.09.49 0 .61.22l2 3.46c.13.22.07.49-.12.64L19.43 11l.07 1l-.07 1l2.11 1.63c.19.15.25.42.12.64l-2 3.46c-.12.22-.39.31-.61.22l-2.49-1c-.52.39-1.06.73-1.69.98l-.37 2.65c-.04.24-.25.42-.5.42h-4m1.25-18l-.37 2.61c-1.2.25-2.26.89-3.03 1.78L5.44 7.35l-.75 1.3L6.8 10.2a5.55 5.55 0 0 0 0 3.6l-2.12 1.56l.75 1.3l2.43-1.04c.77.88 1.82 1.52 3.01 1.76l.37 2.62h1.52l.37-2.61c1.19-.25 2.24-.89 3.01-1.77l2.43 1.04l.75-1.3l-2.12-1.55c.4-1.17.4-2.44 0-3.61l2.11-1.55l-.75-1.3l-2.41 1.04a5.42 5.42 0 0 0-3.03-1.77L12.75 4h-1.5Z"
            />
          </svg>
        </button>
        {children}
      </div>
      <button
        ref={buttonRef}
        className="btn btn-success"
        style={{ height: "100%", width: "188px" }}
        type="submit"
      >
        {processing ? "Stop" : "Send"}
      </button>
    </div>
  );
};

export default InputBar;
