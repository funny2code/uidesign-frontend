import Branding from "./Brand";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import { useSession } from "../../auth/useSession";
import { ADMIN_PAGE } from "../../constants";

interface Props {
  currentPage?: string;
  handlePageChange?: (page: string) => void;
}

const SidebarMenu = ({ currentPage, handlePageChange }: Props) => {
  const [pages, setPages] = useState(["Generate", "History", "Projects"]);
  const { getSession } = useSession();
  useEffect(() => {
    getSession().then(tokens => {
      tokens.is_admin && setPages(["Generate", "History", "Admin", "Projects"]);
    });
  }, []);
  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <section>
        <Branding />
        <ul className="menu">
          {pages.map((page, index) => (
            <li key={`option-${index}`}>
              {page === "Admin" ? (
                <a
                  style={{ color: "inherit", textDecoration: "none" }}
                  href={ADMIN_PAGE}
                  target="_blank"
                >
                  <button type={"button"}>Admin</button>
                </a>
              ) : (
                <button
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange && handlePageChange(page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      <Settings />
    </div>
  );
};

export default SidebarMenu;
