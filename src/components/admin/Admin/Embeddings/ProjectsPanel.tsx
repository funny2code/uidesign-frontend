import { useEffect, useState } from "react";
import type {
  DocumentSimilarityResult,
  SimilarityResults,
  ProjectSimilarityResult,
} from "../../../../client";
import { V2ProjectsService } from "../../../../client";

interface Props {
  projects: ProjectSimilarityResult[] | undefined;
  selectedProject: ProjectSimilarityResult | undefined;
  setSelectedProject: (project: ProjectSimilarityResult) => void;
}

const ProjectsPanel = ({ projects, selectedProject, setSelectedProject }: Props) => {
  const [projectDocuments, setProjectDocuments] = useState<DocumentSimilarityResult[]>([]);

  const getProjectDocuments = async () => {
    if (!selectedProject) return;
    const res = await V2ProjectsService.readUserProjectDocumentsV2UserProjectsIdDocumentsGet(
      selectedProject.id
    );
    console.log(res);
    setProjectDocuments(res.result);
  };

  useEffect(() => {
    console.log(selectedProject);
    if (!selectedProject) return;
    getProjectDocuments();
  }, [selectedProject]);

  return (
    <section className="container-fluid">
      <div>
        <span className="form-text">Projects</span>
        <table className="table table-sm table-striped table-responsive table-hover">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
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
                <td onClick={() => setSelectedProject(d)}>{d.description}</td>
                <td onClick={() => setSelectedProject(d)}>{d.tags.join(", ")}</td>
                <td onClick={() => setSelectedProject(d)}>{d.owner_username}</td>
                <td onClick={() => setSelectedProject(d)}>{d.similarity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
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
                    <td>{d.name}</td>
                    <td>{d.type}</td>
                    <td>{d.description}</td>
                    <td>{d.tags.join(", ")}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ProjectsPanel;
