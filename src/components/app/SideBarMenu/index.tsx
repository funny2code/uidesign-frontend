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
  const [pages, setPages] = useState(["Generate", "History"]);
  const { getSession } = useSession();
  useEffect(() => {
    getSession().then(tokens => {
      tokens.is_admin && setPages(["Generate", "History", "Admin"]);
    });
  }, []);
  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <section>
        <Branding />
        <ul className="menu">
          {pages.map((page, index) => (
            <li key={`option-${index}`}>
              <button
                className={currentPage === page ? "active" : ""}
                onClick={() =>
                  page === "Admin"
                    ? (window.location.href = ADMIN_PAGE)
                    : handlePageChange && handlePageChange(page)
                }
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <Settings />
    </div>
  );
};

export default SidebarMenu;
