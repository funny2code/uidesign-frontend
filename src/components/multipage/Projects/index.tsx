import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Projects from "../../app/Projects";
import { OpenAPI } from "../../../client";
import SidebarMenu from "../SidebarMenu";
import TopBarMenu from "./TopbarMenu";
import { useState } from "react";

const queryClient = new QueryClient();

const Route = () => {
  OpenAPI.BASE = "https://api.uidesign.ai";
  const [isEdit, setIsEdit] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container-fluid vh-100">
        <section className="row p-4">
          <section className="d-flex flex-column flex-md-row justify-content-around gap-3">
            <SidebarMenu currentPage={"Projects"} handlePageChange={() => {}} />
            <section className="designer d-flex flex-column justify-content-between">
              <TopBarMenu currentPage="Projects" />
              <section className="d-flex flex-column flex-grow-1 position-relative">
                <Projects />
              </section>
            </section>
          </section>
        </section>
      </main>
    </QueryClientProvider>
  );
};

export default Route;
