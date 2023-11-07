import { PROJECT_PAGES } from "./constants";
import type { UIProjectsPage } from "./types";
import { useState } from "react";
import { useSession } from "../../../auth/useSession";

interface Props {
    currentPage: UIProjectsPage;
    handlePageChange?: (page: UIProjectsPage) => void;
}

const ProjectTopBarMenu = ({ currentPage, handlePageChange }: Props) => {
    const [pages, setPages] = useState(() => PROJECT_PAGES);
    const { getSession } = useSession();
    const Buttons = () => {
        return Object.values(pages).map((page, index) => (
            <li key={index}>
              <button
                className={`${currentPage === page ? "active" : ""}`}
                onClick={() => (handlePageChange ? handlePageChange(page) : () => {})}
              >
                {page}
              </button>
            </li>
        ));
    };
    return (
        <section className="topbar d-flex justify-content-between gap-2">
          <section className="d-none d-md-block">
            <ul className="menu d-flex justify-content-center gap-2">{Buttons()}</ul>
          </section>
          <section className="d-block d-md-none menu justify-content-center gap-2 dropdown">
            <button
              className="settings dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currentPage}
            </button>
            <ul className="dropdown-menu w-100">{Buttons()}</ul>
          </section>
        </section>
      );
}

export default ProjectTopBarMenu;