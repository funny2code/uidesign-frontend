import { useEffect, useState, useRef } from "react";
import Admin from "./Admin";

const App = () => {
  const [currentPage, setCurrentPage] = useState("Generate");
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <section className="row p-4">
      <section className="d-flex flex-column flex-md-row justify-content-around gap-3"></section>
      <Admin />
    </section>
  );
};
export default App;
