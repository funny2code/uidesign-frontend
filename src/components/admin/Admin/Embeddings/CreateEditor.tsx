import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

import { useState } from "react";
import Input from "./components/Input";
import InputType from "./components/InputType";
import { PROJECT_TYPE, DOCUMENT_TYPE } from "../../../../client";

import { V2DocumentsService } from "../../../../client";

const CreateEditor = () => {
  const [data, setData] = useState<string>();
  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputType, setInputType] = useState<DOCUMENT_TYPE>(DOCUMENT_TYPE.JS);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(data);

    // V2DocumentsService.createUserDocumentV2UserDocumentsPost({
    //   name: inputDescription,
    //   description: inputDescription,
    //   type: inputType,
    //   // data: data,
    // });
  };

  return (
    <div className="row" style={{ height: "500px" }}>
      <form className="container-fluid gap-2" onSubmit={handleSave}>
        <div className="row">
          <CodeMirror
            value={data}
            onChange={setData}
            height={"400px"}
            extensions={[json()]}
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
