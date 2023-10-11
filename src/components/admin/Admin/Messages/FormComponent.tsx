import { OpenAPI, V2DocumentsService } from "../../../../client";
import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import type { FormComponentProps } from "./types";

export const FormComponent = ({
  category,
  tokens,
  doc,
  acallback,
  width,
  height,
}: FormComponentProps) => {
  const [value, setValue] = useState(doc.data.config);
  const [name, setName] = useState(doc.name);
  const [tag, setTag] = useState(doc.data.tag || "");
  const [description, setDescription] = useState(doc.description);
  const [preMessage, setPreMessage] = useState(doc.data.markup);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOk("");
    // confirm
    if (confirm("Save?")) {
      OpenAPI.TOKEN = tokens.id_token;
      try {
        V2DocumentsService.updateUserDocumentV2UserDocumentsIdPut(doc.id, {
          ...doc,
          name: name || doc.name,
          description: description || doc.description,
          data: {
            config: value,
            markup: preMessage,
            ...(tag && { tag }),
          },
        }).then(res => {
          setOk("OK");
          acallback(doc.id);
        });
      } catch (e: any) {
        setError(e.message);
        return;
      }
    }
  };
  return (
    <form className={`vstack gap-2`} onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div className={`d-flex justify-content-start hstack gap-2 pt-2`}>
        <div className="hstack gap-2 px-2">
          <div className="hstack gap-2">
            <label className="form-label form-text pt-1">Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="hstack gap-2">
            <label className="form-label form-text pt-1">Description</label>
            <input
              className="form-control"
              type="text"
              style={{ width: "100%" }}
              placeholder="Description"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
          </div>
          {/* TODO: Update client to use the new type */}
          {/* @ts-ignore */}
          {doc.type === "mobile_component" && (
            <div className="hstack gap-2">
              <label className="form-label form-text pt-1">Tag</label>
              <input
                className="form-control"
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={e => {
                  setTag(e.target.value);
                }}
              />
            </div>
          )}
        </div>
        <div className="hstack gap-2">
          <button className="btn btn-secondary" type="submit">
            Save
          </button>
          {error && <span className="form-text text-danger">{error}</span>}
          {ok && <span className="form-text text-success">{ok}</span>}
        </div>
      </div>
      <section className="hstack gap-2" style={{ width: "100%", height: "100%" }}>
        <CodeMirror
          value={preMessage}
          minHeight={"800px"}
          width={`${Math.floor(width) - 10}px`}
          theme={"dark"}
          extensions={[html()]}
          onChange={setPreMessage}
          style={{ marginTop: "0px", marginBottom: "auto" }}
        />
      </section>
    </form>
  );
};
