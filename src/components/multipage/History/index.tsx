import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import History from "../../app/History";
import { OpenAPI } from "../../../client";
import SidebarMenu from "../SidebarMenu";
import TopBarMenu from "../TopBarMenu";

const queryClient = new QueryClient();

const Route = () => {
  OpenAPI.BASE = "https://api.uidesign.ai";

  const [isSaved, setSaved] = useState<boolean>(false);
  const [project, setProject] = useState<any[] | []>([]);
  const handleSaveProjectBtn = () => {
    setSaved(true);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container-fluid vh-100">
        <section className="row p-4">
          <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
            <SidebarMenu currentPage={"History"} handlePageChange={() => {}} />
            <section className="designer d-flex flex-column justify-content-between">
              <TopBarMenu
                currentPage="Build"
                handleSaveProjectBtn={handleSaveProjectBtn}
                setProject={setProject}
              />
              <section className="d-flex flex-column flex-grow-1 position-relative">
                <History />
              </section>
            </section>
          </section>
        </section>
      </main>
    </QueryClientProvider>
  );
};

export default Route;
