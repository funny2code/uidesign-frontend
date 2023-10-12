import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import type {
  DocumentSimilarityResult,
  SimilarityResults,
  ProjectSimilarityResult,
} from "../../../../client";
import { V2ProjectsService, DOCUMENT_TYPE } from "../../../../client";
import { isDataText } from "../../../../client_utils/typeguards";

interface Props {
  projects: ProjectSimilarityResult[] | undefined;
  selectedProject: ProjectSimilarityResult | undefined;
  setSelectedProject: (project: ProjectSimilarityResult) => void;
}

const ProjectsPanel = ({ projects, selectedProject, setSelectedProject }: Props) => {
  const [projectDocuments, setProjectDocuments] = useState<DocumentSimilarityResult[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentSimilarityResult | undefined>(
    undefined
  );
  const [data, setData] = useState<string>();
  const [inputType, setInputType] = useState<DOCUMENT_TYPE>(DOCUMENT_TYPE.JS);
  const [projectContext, setProjectContext] = useState<Record<string, any> | undefined>(
    () => selectedProject?.context
  );

  const getProjectDocuments = async () => {
    if (!selectedProject) return;
    const res = await V2ProjectsService.readUserProjectDocumentsV2UserProjectsIdDocumentsGet(
      selectedProject.id
    );
    console.log(res);
    setProjectDocuments(res.result);
    setProjectContext(selectedProject.context);
  };
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

  useEffect(() => {
    console.log(selectedProject);
    if (!selectedProject) return;
    getProjectDocuments();
  }, [selectedProject]);

  return (
    <section className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="vstack">
            <span className="form-text">Project Context</span>
            <span className="form-text">{getExtensionTextLabel(inputType)}</span>
          </div>
          <CodeMirror
            // value={data}
            // onChange={setData}
            value={projectContext && JSON.stringify(projectContext, null, 2)}
            onChange={e => {
              setProjectContext(JSON.parse(e));
            }}
            height={"400px"}
            extensions={[json()]}
            theme={"dark"}
          />
        </div>
        <div className="col-12 col-lg-6">
          <div className="vstack">
            <span className="form-text">Document Data</span>
            <span className="form-text">{getExtensionTextLabel(inputType)}</span>
          </div>
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
      </div>
      <div className="row">
        <div className="col-12 col-lg-6">
          <span className="form-text">Projects</span>
          <table className="table table-sm table-striped table-responsive table-hover">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Type</th>
                <th>Tags</th>
                <th>Owner</th>
                <th>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((d, i) => (
                <tr key={`${d.id}-${i}`} onClick={() => setSelectedProject(d)}>
                  {/* <td>{d.id}</td> */}
                  <td onClick={() => setSelectedProject(d)}>{d.name}</td>
                  <td onClick={() => setSelectedProject(d)}>{d.type}</td>
                  <td onClick={() => setSelectedProject(d)}>{d.tags.join(", ")}</td>
                  <td onClick={() => setSelectedProject(d)}>{d.owner_username}</td>
                  <td onClick={() => setSelectedProject(d)}>{d.similarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-12 col-lg-6">
          <span className="form-text">Documents</span>
          {selectedProject && (
            <table
              id="project-documents"
              className="table table-sm table-striped table-responsive table-hover"
            >
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {projectDocuments.length > 0 &&
                  projectDocuments.map((d, i) => (
                    <tr key={`${d.id}-${i}`}>
                      {/* <td>{d.id}</td> */}
                      <td onClick={() => setSelectedDocument(d)}>{d.name}</td>
                      <td onClick={() => setSelectedDocument(d)}>{d.type}</td>
                      <td onClick={() => setSelectedDocument(d)}>{d.description}</td>
                      <td onClick={() => setSelectedDocument(d)}>{d.tags.join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPanel;
