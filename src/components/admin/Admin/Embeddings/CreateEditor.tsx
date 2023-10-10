import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";

const CreateEditor = () => {
  const [data, setData] = useState<string>();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <div className="row" style={{ height: "500px" }}>
      <form className="vstack gap-2" onSubmit={handleSave}>
        <CodeMirror value={data} onChange={setData} height={"400px"} />
        <div className="form-group">
          <button type={"submit"} className="btn btn-success">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditor;
