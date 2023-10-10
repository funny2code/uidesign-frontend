import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";

import { useState } from "react";
import Input from "./components/Input";
import InputType from "./components/InputType";
import { PROJECT_TYPE, DOCUMENT_TYPE, OpenAPI } from "../../../../client";

import { V2DocumentsService } from "../../../../client";
import { useSession } from "../../../auth/useSession";

const CreateEditor = () => {
  const { getSession } = useSession();
  const [data, setData] = useState<string>();
  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputType, setInputType] = useState<DOCUMENT_TYPE>(DOCUMENT_TYPE.JS);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const getExtension = (documentType: DOCUMENT_TYPE) => {
    switch (documentType) {
      case DOCUMENT_TYPE.CSS:
        return css();
      case DOCUMENT_TYPE.HTML:
        return html();
      default:
        return json();
    }
  };

  return (
    <div className="row" style={{ height: "500px" }}>
      <form className="container-fluid gap-2" onSubmit={handleSave}>
        <div className="row">
          <span className="form-text">{inputType}</span>
          <CodeMirror
            value={data}
            onChange={setData}
            height={"400px"}
            extensions={[getExtension(inputType)]}
            theme={"dark"}
          />
        </div>
        <div className="row pt-2">
          <Input
            value={inputDescription}
            setValue={setInputDescription}
            placeholder={"Description"}
            required={true}
          />
          <InputType value={inputType} setValue={setInputType} section={"documents"} />
          <div className="col-6 col-lg-3">
            <div className="form-group">
              <button type={"submit"} className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEditor;
