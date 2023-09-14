import { generatedProjectsIds } from "../../../../atoms";
import { editDocuments } from "../../utils/documents";
import { useSession } from "../../../auth/useSession";
import { OpenAPI } from "../../../../client";
import { useState } from "react";

const EditButton = ({ currentPage }: { currentPage: string }) => {
  const { getSession } = useSession();
  const [valid, setValid] = useState(true);
  const handleClick = async () => {
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const projects = generatedProjectsIds.get();
    //@ts-ignore
    if (!projects[currentPage]) {
      setValid(false);
      console.log("Project not found");
      return;
    }
    setValid(true);
    //@ts-ignore
    await editDocuments(projects[currentPage]);
  };
  return (
    <div className="menu">
      <button className="settings" type="button" onClick={handleClick}>
        Edit
      </button>
    </div>
  );
};
export default EditButton;
