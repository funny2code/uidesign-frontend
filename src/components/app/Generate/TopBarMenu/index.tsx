import ExportButton from "./Export";
import EditButton from "./Edit";
import { PAGES, ADMIN_PAGES } from "./constants";
import { useEffect, useState } from "react";
import { useSession } from "../../../auth/useSession";
import type { UIDesignAdminPage, UIDesignPage } from "./types";

interface Props {
  currentPage: UIDesignPage | UIDesignAdminPage;
  handlePageChange?: (page: UIDesignPage | UIDesignAdminPage) => void;
}

const TopBarMenu = ({ currentPage, handlePageChange }: Props) => {
  const [pages, setPages] = useState(() => PAGES);
  const { getSession } = useSession();
  const Buttons = () => {
    return Object.values(pages).map((page, index) => (
      <li key={index}>
        <button
          className={`topbar-button ${currentPage === page ? "topbar-button-active" : ""}`}
        >
          {page}
        </button> 
      </li>
    ));
  };
  useEffect(() => {
    getSession().then(tokens => {
      tokens.is_admin && setPages(prev => ({ ...prev, ...ADMIN_PAGES }));
    });
  }, []);
  return (
    <section className="topbar d-flex justify-content-between gap-2">
      <section className="d-none d-md-block">
        {/* <div style={{ width: '50px', height: '50px', backgroundColor: 'green' }}></div> */}
        <ul className="no-identation d-flex justify-content-center gap-2 no-bullets">{Buttons()}</ul>
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
      <section className="d-flex gap-2">
        <EditButton currentPage={currentPage} />
        <ExportButton currentPage={currentPage} />
      </section>
    </section>
  );
};

export default TopBarMenu;
