import { useState } from "react";
import { MENUITEMS } from './constants';

interface Props {
    currentPage: string;
    // isEdit: boolean;
    // isCreated: boolean;
    // setIsEdit: (value: boolean) => void;
    // setIsCreated: (value: boolean) => void;
  }

const TopBarMenu = ({ currentPage }: Props) => {
  const [menus, setPages] = useState( MENUITEMS );
  const Buttons = () => {
    return Object.entries(menus).map(([menuItem, route], index) => (
      <li key={index}>
        <a href={route}>
          <button className={`topbar-button ${currentPage === menuItem ? "topbar-button-active" : ""}`}>
            {menuItem}
          </button>
        </a>
      </li>
    ));
  };
 
  return (
    <section className="topbar d-flex align-items-center justify-content-between gap-2">
      <section className="d-none d-md-block">
        <ul className="no-identation d-flex justify-content-center gap-2 no-bullets">
        {
            <ul className="no-identation d-flex justify-content-center gap-2 no-bullets">{Buttons()}</ul>
        }
        </ul>
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
        {/* {currentPage == "Projects" && (isEdit ? (
          <button>
            <a href="/projects">Back</a>
          </button>
        ): (
          <></>
        )
        )}
        {currentPage == "Create" && (isCreated ? (
          <button>
            <a href="/projects/create">Back</a>
          </button>
        ): (
          <></>
        )
        )} */}
      </section>
    </section>
  );
};

export default TopBarMenu;
