import Branding from "./Brand";
import Settings from "./Settings";
import React, { useEffect, useState } from "react";
import { useSession } from "../../auth/useSession";
import { ADMIN_PAGE } from "../../constants";

import Generate from "./generate";
import Subscribe from "./Subscribe";

const GENERATE = "Generate";
const HISTORY = "History";
const ADMIN = "Admin";
const PROJECTS = "Projects";

const PAGES = {
  Generate: "/",
};
const ADMIN_PAGES = {
  History: "/history",
  Projects: "/projects",
  Admin: "/admin",
};

interface Props {
  currentPage?: string;
  handlePageChange?: (page: string) => void;
}

function getIcon(iconName: string, isActive: boolean) {
  switch (iconName) {
    case GENERATE: {
      return <Generate isActive={isActive} />;
    }
    case HISTORY: {
      return <Generate isActive={isActive} />;
    }
    case PROJECTS: {
      return <Generate isActive={isActive} />;
    }
    default:
      return null;
  }
}
const SidebarMenu = ({ currentPage, handlePageChange }: Props) => {
  const [pages, setPages] = useState(() => PAGES);
  const { getSession } = useSession();
  useEffect(() => {
    getSession().then(tokens => {
      tokens.is_admin && setPages(prev => ({ ...prev, ...ADMIN_PAGES }));
    });
  }, []);
  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <section>
        <Branding />
        <ul className="menu">
          {Object.entries(pages).map(([key, route], index) => {
            let isActive = currentPage === key;
            return (
              <li key={`option-${index}`}>
                {key === ADMIN ? (
                  <a
                    style={{ color: "inherit", textDecoration: "none" }}
                    href={ADMIN_PAGE}
                    target="_blank"
                  >
                    <button type={"button"}>Admin</button>
                  </a>
                ) : (
                  <a href={route}>
                    <SideBarButton
                      icon={getIcon(key, isActive)}
                      isActive={isActive}
                      onClick={() => handlePageChange && handlePageChange(key)}
                    >
                      {key}
                    </SideBarButton>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <div>
        <Subscribe />
        <Settings />
      </div>
    </div>
  );
};

interface SideBarButtonProps {
  icon: React.ReactNode;
  children?: React.ReactNode;
  onClick(): void;
  isActive: Boolean;
}

const SideBarButton = ({ icon, children, onClick, isActive }: SideBarButtonProps) => {
  return (
    <button className={`${isActive ? "active" : ""}`} onClick={onClick}>
      <div style={{ padding: "4px" }}>{icon}</div>
      {children}
    </button>
  );
};

export default SidebarMenu;
