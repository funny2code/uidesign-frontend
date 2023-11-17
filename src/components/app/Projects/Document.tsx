import { OpenAPI, V3WebsitesProjectsService } from "../../../client";
import type { GrapesjsProject }  from './interfaces';
import { useSession } from "../../auth/useSession";

interface DocumentItemProps extends GrapesjsProject {
  setIsEdit: (value: boolean) => void;
  setIframeDoc: (value: string) => void;
}

const Document = (props: DocumentItemProps) => {
  const { getSession } = useSession();
  const handleView = async () => {
    const tokens = await getSession();    
    // const res = await fetch("http://127.0.0.1:5000/display", {
    const res = await fetch("http://3.135.207.187/display", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
        project_id: props.id,
        action: "edit_project"
      })
    });
    
    const html_text = await res.text();
    props.setIsEdit(true);
    props.setIframeDoc(html_text);
  };
  
  const handleDelete = async () => {
    if (!props.id) return;
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const confirm = window.confirm("Delete?");
    if (!confirm) return;
    await V3WebsitesProjectsService.deleteWebsiteProject(props.id);
  };
  return (
    <>
      <section
        className={`document${
          !props.id ? "-loading" : ""
        } bg-white p-3 d-flex flex-column justify-content-between`}
      >
        {/* <div className="document-image-placeholder mt-1 mb-2"></div> */}
        <h2 className="document-title">{props.description}</h2>
        {props.id && (
          <section className="hstack gap-3 mt-2">
            <button
              className="link-primary"
              style={{ cursor: "pointer" }}
              onClick={handleView}
            >
              Edit Project
            </button>
            <a className="link-primary" style={{ cursor: "pointer" }} onClick={handleDelete}>
              Delete
            </a> 
          </section>
        )}
      </section>
    </>
  )
};

export default Document;
