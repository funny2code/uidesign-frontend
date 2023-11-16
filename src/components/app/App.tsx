import SidebarMenu from "./SideBarMenu";
import { useState } from "react";
import Generate from "./Generate";
import History from "./History";
import Projects from "./Projects";

const App = () => {
  const [currentPage, setCurrentPage] = useState("Generate");
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <section className="row p-4">
      <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
        <SidebarMenu currentPage={currentPage} handlePageChange={handlePageChange} />
        {currentPage == "Generate" && <Generate />}
        {currentPage == "History" && <History />}
        {/* {currentPage == "Admin" && <Admin />} */}
        {currentPage == "Projects" && <Projects />}
      </section>
    </section>
  );
};
export default App;
