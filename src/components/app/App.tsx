import SidebarMenu from "./SideBarMenu";
import { useEffect, useState, useRef } from "react";
import Generate from "./Generate";
import History from "./History";
import Admin from "./Admin";

const App = () => {
  const iframeSectionRef = useRef<HTMLDivElement>(null);
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
        {currentPage == "Admin" && <Admin />}
      </section>
    </section>
  );
};
export default App;
