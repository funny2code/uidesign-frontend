import Component from "../../app/Generate/Component";
import { OpenAPI } from "../../../client";
import SidebarMenu from "../SidebarMenu";
import TopBarMenu from "../TopBarMenu";
import { useState } from "react";

const Route = () => {
  OpenAPI.BASE = "https://api.uidesign.ai";

  const [isSaved, setSaved] = useState<boolean>(false);
  const [project, setProject] = useState<any[] | []>([]);
  const handleSaveProjectBtn = () => {
    setSaved(true);
  };
  return (
    <main className="container-fluid vh-100">
      <section className="row p-4">
        <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
          <SidebarMenu currentPage={"Generate"} handlePageChange={() => {}} />
          <section className="designer d-flex flex-column justify-content-between">
            <TopBarMenu
              currentPage="Components"
              handleSaveProjectBtn={handleSaveProjectBtn}
              setProject={setProject}
            />
            <section className="d-flex flex-column flex-grow-1 position-relative">
              <Component />
            </section>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Route;
