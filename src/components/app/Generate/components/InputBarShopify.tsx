import type React from "react";
import type { ISopifyPages } from "../Create/types";

interface InputBarProps extends React.PropsWithChildren {
  input: string;
  setInput: (input: string) => void;
  isDisabled: boolean;
  processing: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  pages: string[] | undefined;
  page: string;
  handlePageChange: (e: any) => void;
  themes: ISopifyPages[] | undefined;
  themeId: string;
  handleThemeChange: (e: any) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  placeholder: string;
  children?: any;
  center?: boolean;
  isDownload: boolean;
  downloadTheme: (e: any) => void;
}

const InputBar = ({
  input,
  setInput,
  isDisabled,
  processing,
  inputRef,
  pages,
  page,
  handlePageChange,
  themes,
  themeId,
  handleThemeChange,
  buttonRef,
  placeholder,
  children,
  center = true,
  isDownload,
  downloadTheme
}: InputBarProps) => {
  return (
    <div
      className="hstack gap-2 designer-form form-control p-1"
    >
      <input
        ref={inputRef}
        className="form-control border-0"
        style={{ height: "100%" }}
        type="text"
        placeholder={placeholder || "Describe your design"}
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={processing}
      />
      {themes && (
        <select
          onChange={handleThemeChange}
          value={themeId}
          className="form-select bc-shopify-pages"
          disabled={processing}
          aria-label="Default select Theme"
          style={{ height: "100%", width: "130px" }}
        >
          {themes.map((page, i) => (
            <option key={page._id} value={page._id}>
              {page.name}
            </option>
          ))}
        </select>
      )}
      {pages && (
        <select
          onChange={handlePageChange}
          value={page}
          className="form-select bc-shopify-pages"
          disabled={processing}
          aria-label="Default select Page"
          style={{ height: "100%", width: "130px" }}
        >
          {
            pages.map((p) => (
              <option key={p} value={p}>
                  {p}
              </option>
            ))
          }
        </select>
      )}
      <div
        className={center ? "dropup-center dropup" : "dropup"}
        style={{
          height: "100%",
        }}
      >
        <button
          type={"button"}
          className="btn btn-outline-secondary text-dark"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ height: "96%", width: "64px", marginTop: "1px", marginBottom: "1px" }}
          id="dropdownMenuClickable"
          data-bs-auto-close="false"
          disabled={processing}
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
        className="btn btn-primary px-2"
        style={{ height: "100%", width: "188px" }}
        disabled={processing}
        type="submit"
      >
        {isDisabled ? (
          <>
            <span className="spinner-border spinner-border-md" aria-hidden="true"></span>
            <span className="visually-hidden" role="status">
              Loading...
            </span>
          </>
        ) : (
          <span>Send</span>
        )}
      </button>
    </div>
  );
};

export default InputBar;
