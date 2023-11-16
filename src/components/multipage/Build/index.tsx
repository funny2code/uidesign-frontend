import { useState, useEffect, useRef } from "react";
import Build from "../../app/Generate/Build";
import { OpenAPI } from "../../../client";
import SidebarMenu from "../SidebarMenu";
import TopBarMenu from "../TopBarMenu";

const Route = () => {
  OpenAPI.BASE = "https://api.uidesign.ai";

  const [isSaved, setSaved] = useState<boolean>(false);
  const [project, setProject] = useState<any[] | []>([]);
  const handleSaveProjectBtn = () => {
    setSaved(true);
  };
  const stackblitzRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Load the Stackblitz iframe on this Component's render to avoid re-creating on page change.
    const stackblitz = stackblitzRef.current;
    if (!stackblitz) return;
    const embed = stackblitz.querySelector("#embed");
    if (embed) {
      embed.setAttribute("height", String("100%"));
    }
  }, []);
  return (
    <main className="container-fluid vh-100">
      <section className="row p-4">
        <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
          <SidebarMenu currentPage={"Generate"} handlePageChange={() => {}} />
          <section className="designer d-flex flex-column justify-content-between">
            <TopBarMenu
              currentPage="Build"
              handleSaveProjectBtn={handleSaveProjectBtn}
              setProject={setProject}
            />
            <section ref={stackblitzRef} className="d-flex flex-column flex-grow-1 position-relative">
              <Build height={800} />
            </section>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Route;
