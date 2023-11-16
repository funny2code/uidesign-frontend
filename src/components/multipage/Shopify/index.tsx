import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shopify from "../../app/Generate/Shopify";
import { OpenAPI } from "../../../client";
import SidebarMenu from "../SidebarMenu";
import TopBarMenu from "../TopBarMenu";
import { useState } from "react";

const queryClient = new QueryClient();

const Route = () => {
  OpenAPI.BASE = "https://api.uidesign.ai";

  const [isSaved, setSaved] = useState<boolean>(false);
  const [project, setProject] = useState<any[] | []>([]);

  const handleSaveProjectBtn = () => {
    setSaved(true);
  };
  return (
    <main className="container-fluid vh-100">
      <QueryClientProvider client={queryClient}>
        <section className="row p-4">
          <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
            <SidebarMenu currentPage={"Generate"} handlePageChange={() => {}} />
            <section className="designer d-flex flex-column justify-content-between">
              <TopBarMenu
                currentPage="Shopify"
                handleSaveProjectBtn={handleSaveProjectBtn}
                setProject={setProject}
              />
              <section className="d-flex flex-column flex-grow-1 position-relative">
                <Shopify />
              </section>
            </section>
          </section>
        </section>
      </QueryClientProvider>
    </main>
  );
};

export default Route;
