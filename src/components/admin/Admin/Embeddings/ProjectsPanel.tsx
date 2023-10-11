import type {
  DocumentSimilarityResult,
  SimilarityResults,
  ProjectSimilarityResult,
} from "../../../../client";

interface Props {
  projects: ProjectSimilarityResult[] | undefined;
  selectedProject: ProjectSimilarityResult | undefined;
  setSelectedProject: (project: ProjectSimilarityResult) => void;
}

const ProjectsPanel = ({ projects, selectedProject, setSelectedProject }: Props) => {
  return (
    <section className="container">
      <table className="table table-sm table-striped table-responsive table-hover w-100">
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
              <td>{d.name}</td>
              <td>{d.type}</td>
              <td>{d.description}</td>
              <td>{d.tags.join(", ")}</td>
              <td>{d.owner_username}</td>
              <td>{d.similarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProjectsPanel;
