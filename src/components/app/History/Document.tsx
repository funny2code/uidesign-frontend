import { OpenAPI, V2ProjectsService } from "../../../client";
import { fetchDocuments, editDocuments, exportDocuments } from "../utils/documents";
import type { ProjectSimilarityResult } from "../../../client";
import { useSession } from "../../auth/useSession";
import { initFrame } from "../utils/frame";

interface DocumentItemProps extends ProjectSimilarityResult {
  sectionRef?: React.MutableRefObject<HTMLDivElement | null>;
}
const DocumentItem = (props: DocumentItemProps) => {
  const { getSession } = useSession();
  const handleView = async () => {
    if (!props.sectionRef || !props.sectionRef.current) return;
    props.sectionRef.current.innerHTML = ""; // deals with flash of previous view
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const { content, styles } = await fetchDocuments(props.id);
    const iframe = initFrame(props.sectionRef.current);
    iframe.onload = async () => {
      const contentWindow = iframe.contentWindow;
      if (!contentWindow) return;
      contentWindow.document.title = props.name;
      contentWindow.document.body.innerHTML = content.map(c => c.data?.text || "").join("\n");
      contentWindow.document.head.innerHTML = styles
        ? `<style>${styles.map(s => s.data?.text || "").join("\n")}</style>`
        : "";
    };
  };
  const handleEdit = async () => {
    if (!props.id) return;
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    await editDocuments(props.id);
  };
  const handleExport = async () => {
    if (!props.id) return;
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    await exportDocuments(props.id);
  };
  const handleDelete = async () => {
    if (!props.id) return;
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const confirm = window.confirm("Delete?");
    if (!confirm) return;
    await V2ProjectsService.deleteUserProjectV2UserProjectsIdDelete(props.id);
  };
  return (
    <>
      <section
        className={`document${
          !props.id ? "-loading" : ""
        } bg-white p-3 d-flex flex-column justify-content-between`}
      >
        {/* <img src={imgSrc} className="img-fluid mt-2" style={{width: "100%", height: "150px", objectFit: "cover"}}/> */}
        <div className="document-image-placeholder mt-1 mb-2"></div>
        {/* <span className="text-muted mb-2" style={{fontSize: "0.8rem"}}>{id}</span> */}
        <h2 className="document-title">{props.description}</h2>
        {props.id && (
          <section className="hstack gap-3 mt-2">
            <a
              className="link-primary"
              style={{ cursor: "pointer" }}
              onClick={handleView}
              data-bs-toggle="modal"
              data-bs-target="#viewModal"
            >
              View
            </a>
            <a className="link-primary" style={{ cursor: "pointer" }} onClick={handleEdit}>
              Edit
            </a>
            <a className="link-primary" style={{ cursor: "pointer" }} onClick={handleExport}>
              Export
            </a>
            <a className="link-primary" style={{ cursor: "pointer" }} onClick={handleDelete}>
              Delete
            </a>
          </section>
        )}
      </section>
    </>
  );
};

export default DocumentItem;
