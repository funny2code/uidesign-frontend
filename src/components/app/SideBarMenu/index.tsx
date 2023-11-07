import Branding from "./Brand";
import Settings from "./Settings";
import React, { useEffect, useState } from "react";
import { useSession } from "../../auth/useSession";
import { ADMIN_PAGE } from "../../constants";

import Generate from './generate';

const GENERATE = 'Generate'
const HISTORY = 'History'
const ADMIN = 'Admin'

interface Props {
  currentPage?: string;
  handlePageChange?: (page: string) => void;
}

function getIcon(iconName: string, isActive: boolean) {
  switch (iconName) {
    case GENERATE: {
      return <Generate isActive={isActive} />
    }
    case HISTORY: {
      return <Generate isActive={isActive} />
    }
    default:
      return null
  }
}
const SidebarMenu = ({ currentPage, handlePageChange }: Props) => {
  const [pages, setPages] = useState([GENERATE, HISTORY]);
  const { getSession } = useSession();
  useEffect(() => {
    getSession().then(tokens => {
      tokens.is_admin && setPages([GENERATE, HISTORY, ADMIN]);
    });
  }, []);
  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <section>
        <Branding />
        <ul className="menu">
          {pages.map((page, index) => {
            let isActive = currentPage === page
            return (
              <li key={`option-${index}`}>
                {page === ADMIN ? (
                  <a
                    style={{ color: "inherit", textDecoration: "none" }}
                    href={ADMIN_PAGE}
                    target="_blank"
                  >
                    <button type={"button"}>Admin</button>
                  </a>
                ) : (
                  <SideBarButton
                    icon={getIcon(page, isActive)}
                    isActive={isActive}
                    onClick={() => handlePageChange && handlePageChange(page)}
                  >
                    {page}
                  </SideBarButton>
                )}
              </li>
            )
          })}
        </ul>
      </section>
      <Settings />
    </div>
  );
};

interface SideBarButtonProps {
  icon: React.ReactNode
  children?: React.ReactNode
  onClick(): void
  isActive: Boolean
}

const SideBarButton = ({ icon, children, onClick, isActive }: SideBarButtonProps) => {
  return (
    <button 
      className={`${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div style={{ padding: '4px'}}>
        {icon}
      </div>
      {children}
    </button>
  )
}

export default SidebarMenu;
