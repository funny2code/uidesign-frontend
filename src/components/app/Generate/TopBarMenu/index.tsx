import ExportButton from "./Export";
import EditButton from "./Edit";
import { PAGES, ADMIN_PAGES } from "./constants";
import { useEffect, useState } from "react";
import { useSession } from "../../../auth/useSession";
import type { UIDesignAdminPage, UIDesignPage } from "./types";
import PaymentButton from "../Shopify/components/paymentButton";
import ShopifyProjects from "./shopifyProjects";

interface Props {
  currentPage: UIDesignPage | UIDesignAdminPage;
  handlePageChange?: (page: UIDesignPage | UIDesignAdminPage) => void;
  handleSaveProjectBtn: (e:any) => void;
  setProject: (e:any) => void;
}

const TopBarMenu = ({ currentPage, handlePageChange, handleSaveProjectBtn, setProject }: Props) => {
  const [pages, setPages] = useState(() => PAGES);
  const { getSession } = useSession();
  const Buttons = () => {
    return Object.values(pages).map((page, index) => (
      <li key={index}>
        <button
          className={`${currentPage === page ? "active mb-0" : "mb-0"}`}
          onClick={() => (handlePageChange ? handlePageChange(page) : () => {})}
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
    <section className="topbar d-flex align-items-center justify-content-between gap-2">
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
      <section className="d-flex gap-2">
        { currentPage === "Shopify" && (
          <>
            <ShopifyProjects setProject={setProject} />
            <button className="btn btn-primary px-2" style={{ height: "60px" }} onClick={handleSaveProjectBtn}>Save to Projects</button>
            <PaymentButton />
          </>
        )}
        { currentPage !== "Shopify" && <EditButton currentPage={currentPage} />}
        { currentPage !== "Shopify" && <ExportButton currentPage={currentPage} />}
      </section>
    </section>
  );
};

export default TopBarMenu;
