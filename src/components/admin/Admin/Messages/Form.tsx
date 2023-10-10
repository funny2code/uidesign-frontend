import { OpenAPI, V2DocumentsService } from "../../../../client";
import type { FormProps, DataContent } from "./types";
import { useState } from "react";

import { css } from "@codemirror/lang-css";
import CodeMirror from "@uiw/react-codemirror";

const CONTENT = "content";
export const Form = ({
  type,
  category,
  tokens,
  document,
  height,
  width,
  hasPreMessage = true,
}: FormProps) => {
  // @ts-ignore
  const [value, setValue] = useState(document.data.system_message || document.data.config);
  // @ts-ignore
  const [preMessage, setPreMessage] = useState(document.data.pre_message || document.data.markup);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // confirm
    if (confirm(category === "dev" ? "Save?" : "Publish?")) {
      OpenAPI.TOKEN = tokens.id_token;
      if (category === CONTENT) {
        V2DocumentsService.updateUserDocumentV2UserDocumentsIdPut(document.id, {
          ...document,
          data: {
            config: value,
            markup: preMessage,
          },
        });
      } else {
        V2DocumentsService.updateUserDocumentV2UserDocumentsIdPut(document.id, {
          ...document,
          data: {
            ...document.data,
            pre_message: preMessage,
            system_message: value,
          } as DataContent,
        });
      }
    }
  };
  return (
    <form className={`vstack gap-2 text-start`} onSubmit={handleSubmit} style={{ width: "100%" }}>
      {hasPreMessage && <label className="form-text">{document.name.replace(/_/g, " ")}</label>}
      {!hasPreMessage && (
        <div className="hstack gap-2">
          <button className="btn btn-secondary" type="submit">
            Save
          </button>
          <label className="form-text">{type.replace(/_/g, " ")} system</label>
        </div>
      )}
      {hasPreMessage ? (
        <textarea
          className="form-control"
          rows={hasPreMessage ? 10 : 20}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        ></textarea>
      ) : (
        <CodeMirror
          value={value}
          minHeight={"800px"}
          width={`${Math.floor(width / 2) - 10}px`}
          theme={"dark"}
          extensions={[css()]}
          onChange={setValue}
        />
      )}
      <div
        className={`d-flex ${hasPreMessage ? "justify-content-between " : "justify-content-end"} gap-2`}
      >
        {hasPreMessage && category !== CONTENT && (
          <div className="input-group">
            <label className="input-group-text" id="basic-addon3">
              PreMessage
            </label>
            <input
              type={"text"}
              className="form-control"
              aria-describedby="basic-addon3"
              value={preMessage}
              onChange={e => {
                setPreMessage(e.target.value);
              }}
            ></input>
          </div>
        )}
        <div className="hstack gap-2">
          {hasPreMessage && (
            <button className="btn btn-secondary" type="submit">
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
