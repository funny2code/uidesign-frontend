type ProjectCardProps = {
  image?: string;
  name?: string;
  setSelected: () => void;
};

const ProjectCard = ({ image, name, setSelected }: ProjectCardProps) => (
  <div className="card">
    <img
      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
      className="card-img-top"
      alt=""
    />
    <div className="card-body">
      <h5 className="card-title">{name}</h5>
      <p className="card-text">
        Some quick example text to build on the card title and make up the bulk of the card's content.
      </p>
      <button type="button" onClick={setSelected} className="btn btn-primary">
        Choose template
      </button>
    </div>
  </div>
);

export default ProjectCard;
