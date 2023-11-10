import { OpenAPI, V3BravoProjectsService } from "../../../../client";
import { useSession } from "../../../auth/useSession";

interface DocumentItemProps {
  id: string;
  name: string;
  public: boolean;
  description: string;
  /**
   * Can be empty list.
   */
  tags: Array<string> | null;
  sectionRef?: React.MutableRefObject<HTMLDivElement | null>;
  project_nameRef?: React.MutableRefObject<HTMLInputElement | null>;
  project_idRef?: React.MutableRefObject<HTMLInputElement | null>;
  project_tagRef?: React.MutableRefObject<HTMLInputElement | null>;
  project_descriptionRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
  setProject_data: void;
  resetModal: void;
}

const fetchProject = async (id: string, preview: boolean = false) => {
  const project = await V3BravoProjectsService.readUserBravoProject(id);

  return project;
};

const Project = (props: DocumentItemProps) => {
  const { getSession } = useSession();
  const handleEdit = async () => {
    if (!props.id) return;
    props.resetModal();
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const project_data = await fetchProject(props.id);
    props.project_idRef.current.value = props.id;
    props.project_descriptionRef.current.value = project_data.description;
    let tags = project_data.tags;
    if (tags != undefined) {
      let tags_str = "";
      for (let index in tags) {
        tags_str += (index != 0 ? "," : "") + tags[index];
      }
      props.project_tagRef.current.value = tags_str;
    } else {
      props.project_tagRef.current.value = "Null";
    }
    props.project_nameRef.current.value = project_data.name;
    props.setProject_data(project_data);
  };

  const handleDelete = async () => {
    if (!props.id) return;
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const confirm = window.confirm("Delete?");
    if (!confirm) return;
    await V3BravoProjectsService.deleteBravoProject(props.id);
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
            <button
              className="link-primary"
              style={{ cursor: "pointer" }}
              onClick={handleEdit}
              data-bs-toggle="modal"
              data-bs-target="#viewModal"
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
  );
};

export default Project;
