import React from "react";
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
  isSaved: boolean;
  isDisabled: boolean;
  handlePageChange?: (page: UIDesignPage | UIDesignAdminPage) => void;
  handleSaveProjectBtn: (e:any) => void;
  setProject: (e:any) => void;
  setIntentId: (e:any) => void;
}

const TopBarMenu = ({ currentPage, setIntentId, isSaved, isDisabled, handlePageChange, handleSaveProjectBtn, setProject }: Props) => {
  const [pages, setPages] = useState(() => PAGES);
  const { getSession } = useSession();
  const Buttons = ({ icon }: { icon?: React.ReactNode } = {}) => {
    return Object.values(pages).map((page, index) => (
      <li key={index}>
        <button
          // className={`${currentPage === page ? "active mb-0" : "mb-0"}`}
          className={`topbar-button ${currentPage === page ? "topbar-button-active" : ""}`}
          onClick={() => (handlePageChange ? handlePageChange(page) : () => {})}
        >
          {icon || null}
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
        {currentPage === "Shopify" && (
          <>
            <ShopifyProjects setProject={setProject} />
            <button className="btn btn-primary px-2" disabled={isDisabled} style={{ width: '132px', height: "60px" }} onClick={handleSaveProjectBtn}>
              { isSaved 
                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                : <span>Save to Projects</span> 
              }
            </button>
            <PaymentButton setIntentId={setIntentId} />
          </>
        )}
        {currentPage !== "Shopify" && <EditButton currentPage={currentPage} />}
        {currentPage !== "Shopify" && <ExportButton currentPage={currentPage} />}
      </section>
    </section>
  );
};

export default TopBarMenu;
