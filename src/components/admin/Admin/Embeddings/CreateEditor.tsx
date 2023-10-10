import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";

import { useState } from "react";
import Input from "./components/Input";
import InputType from "./components/InputType";
import { DOCUMENT_TYPE, OpenAPI } from "../../../../client";
import type { DocumentSimilarityResult } from "../../../../client";

import { V2DocumentsService } from "../../../../client";
import { useSession } from "../../../auth/useSession";

import { isTextDataDocumentType, isDataText } from "../../../../client_utils/typeguards";

export type CreateEditorProps = {
  selectedDocument: DocumentSimilarityResult | undefined;
  setSelectedDocument: React.Dispatch<React.SetStateAction<DocumentSimilarityResult | undefined>>;
};

const CreateEditor = ({ selectedDocument, setSelectedDocument }: CreateEditorProps) => {
  const { getSession } = useSession();
  const [data, setData] = useState<string>();
  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputType, setInputType] = useState<DOCUMENT_TYPE>(DOCUMENT_TYPE.JS);

  /** Depending on document type, parse data differently. */
  const parseData = (data: string, documentType: DOCUMENT_TYPE) => {
    switch (documentType) {
      case DOCUMENT_TYPE.CSS:
        return { text: data };
      case DOCUMENT_TYPE.HTML:
        return { text: data };
      default:
        return JSON.parse(data);
    }
  };

  /** Handle creating a new document. */
  const handleSave = async () => {
    console.log(data);
    if (!data) {
      return alert("Missing data");
    }
    const tokens = await getSession();
    if (!tokens) return;
    // Call
    OpenAPI.TOKEN = tokens.id_token;
    const res = await V2DocumentsService.createUserDocumentV2UserDocumentsPost({
      name: inputDescription,
      description: inputDescription,
      type: inputType,
      data: parseData(data, inputType),
      public: true,
      url: "",
      img_url: "",
      tags: [],
    });
    console.log(res);
    if (res.id) {
      window.alert(`Saved ${res.id}`);
    }
  };

  /** If selected document exists, edit. */
  const handleEdit = async () => {
    const document = selectedDocument;
    if (!document || !document.data) return;
    console.log(document, document.data);
    try {
      const body = {
        name: document.name,
        public: document.public,
        description: document.description,
        url: document.url,
        img_url: document.img_url,
        tags: document.tags,
        type: document.type,
        data: document.data,
      };
      await V2DocumentsService.updateUserDocumentV2UserDocumentsIdPut(document.id, body);
      window.alert("Saved");
    } catch {
      window.alert("Failed to save");
    }
  };

  /** Get the extension for the codemirror editor  */
  const getExtension = (documentType: DOCUMENT_TYPE) => {
    const type = selectedDocument?.type || documentType;
    switch (type) {
      case DOCUMENT_TYPE.CSS:
        return css();
      case DOCUMENT_TYPE.HTML:
        return html();
      default:
        return json();
    }
  };

  const getExtensionTextLabel = (documentType: DOCUMENT_TYPE) => {
    const type = selectedDocument?.type || documentType;
    switch (type) {
      case DOCUMENT_TYPE.CSS:
        return "css";
      case DOCUMENT_TYPE.HTML:
        return "html";
      default:
        return "json";
    }
  };

  /** General form management */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocument === undefined) {
      handleSave();
    } else {
      handleEdit();
    }
  };

  return (
    <div className="row" style={{ height: "480px", overflowY: "auto" }}>
      <form className="container-fluid gap-2" onSubmit={handleSubmit}>
        <div className="row pt-2">
          <Input
            value={inputDescription}
            setValue={setInputDescription}
            placeholder={"Description"}
            required={true}
            disabled={selectedDocument !== undefined}
          />
          <InputType
            value={inputType}
            setValue={setInputType}
            section={"documents"}
            disabled={selectedDocument !== undefined}
          />
          <div className="col-6 col-lg-3 py-1">
            <div className="form-group hstack gap-2">
              <button
                type={"button"}
                className="btn btn-primary"
                onClick={() => setSelectedDocument(undefined)}
              >
                New
              </button>
              <button type={"submit"} className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <span className="form-text">{getExtensionTextLabel(inputType)}</span>
          <CodeMirror
            // value={data}
            // onChange={setData}
            value={
              selectedDocument !== undefined
                ? isDataText(selectedDocument.data)
                  ? selectedDocument.data.text
                  : JSON.stringify(selectedDocument.data, null, 2)
                : data
            }
            onChange={e => {
              // setDocumentData(prev => (prev.hasOwnProperty("text") ? { text: e } : JSON.parse(e)));
              selectedDocument !== undefined
                ? setSelectedDocument(prev => (prev ? { ...prev, data: parseData(e, inputType) } : prev))
                : setData(e);
            }}
            height={"400px"}
            extensions={[getExtension(inputType)]}
            theme={"dark"}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEditor;
