import { useState, useRef, useEffect } from "react";
import { PROJECT_PAGES } from "./ProjectTopBarMenu/constants";
import type { UIProjectsPage } from "./ProjectTopBarMenu/types";
import ProjectTopBarMenu from "./ProjectTopBarMenu";
import Create from "./Create";
import Websites from "./Websites";

const HEIGHT_OFFSET = 68;
const Projects = () => {
  // Flow
  const [currentPage, setCurrentPage] = useState<UIProjectsPage>(PROJECT_PAGES.Websites);
  const handlePageChange = (page: UIProjectsPage) => {
    setCurrentPage(page);
  };
//   const [runBuild, setRunBuild] = useState(false);
  const stackblitzRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);
  const pages = {
    [PROJECT_PAGES.Websites]: <Websites />,
    [PROJECT_PAGES.Create]: <Create />,
  };
  useEffect(() => {
    // Load the Stackblitz iframe on this Component's render to avoid re-creating on page change.
    const stackblitz = stackblitzRef.current;
    const other = otherRef.current;
    if (!stackblitz || !other) return;

    stackblitz.style.display = "none";
    other.style.display = "block";
    stackblitz.style.pointerEvents = "none";
    other.style.pointerEvents = "auto";
    
  }, [currentPage]);
  return (
    <section className="designer d-flex flex-column justify-content-between">
      <ProjectTopBarMenu currentPage={currentPage} handlePageChange={handlePageChange} />
      <section ref={otherRef} className="d-flex flex-column flex-grow-1">
        {pages[currentPage]}
      </section>
      
    </section>
  );
};

export default Projects;
