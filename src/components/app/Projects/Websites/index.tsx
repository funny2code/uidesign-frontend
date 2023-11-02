import { useState, useEffect, useRef, Fragment } from "react";
import { PROJECT_PAGES } from '../ProjectTopBarMenu/constants.ts';
import type { UIProjectsPage } from '../ProjectTopBarMenu/types.ts'
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../../../auth/useSession.tsx";
import { V2ProjectsService } from "../../../../client/index.ts";
import Document from "./Document.tsx";
import { useInView } from "react-intersection-observer";
import { PROJECT_TYPE } from '../../../../client';

const Websites =  () => {
    const [currentPage, setCurrentPage] = useState<UIProjectsPage>(PROJECT_PAGES.Websites);
    const handlePageChange = (page: UIProjectsPage) => {
        setCurrentPage(page);
    };
    const { getSession } = useSession();
    const pageSize = 10;
    const { ref, inView } = useInView();
    const sectionRef = useRef<HTMLDivElement>(null);
    const project_nameRef = useRef<HTMLInputElement>(null);
    const project_tagRef = useRef<HTMLInputElement>(null);
    const project_descriptionRef = useRef<HTMLInputElement>(null);
    const iframeRef = useRef<HTMLDivElement>(null);
    const [depleted, setDepleted] = useState(false);

    // Get all projects
    const {
      status,
      data,
      error,
      isFetching,
      isFetchingNextPage,
      isFetchingPreviousPage,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
    } = useInfiniteQuery(
      ["projects"],
      async ({ pageParam = 0 }) => {
        const tokens = await getSession();
        const data = await V2ProjectsService.readPublicProjectsV2PublicProjectsGet(
          pageParam,
          pageSize,
          undefined
        );

        console.log("PUBLIC PROJECTS: ", data);

        setDepleted(data.result.length < pageSize);
        return { data: data.result, previousId: pageParam - pageSize, nextId: pageParam + pageSize };
      },
      {
        getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
        getNextPageParam: lastPage => lastPage.nextId ?? undefined,
      }
    );

    useEffect(() => {
      if (inView && !depleted) {
        fetchNextPage();
      }
    }, [inView]);
    return (
      <section className="designer d-flex flex-column justify-content-between">
        <section className="d-flex flex-wrap justify-content-end align-content-start gap-3" >
          <div>
            <input ref={project_nameRef} type="text" name="projectName" placeholder="Project Name"/>
            <input ref={project_tagRef} type="text" name="tags" placeholder="Tag1, Tag2, Tag3"/>
            <input ref={project_descriptionRef} type="text" name="projectDescription" placeholder="Project Description"/>
          </div>
          <button className="btn btn-primary"
            onClick = {async () => {
              // Create a Project
              const data = await V2ProjectsService.createUserProjectV2UserProjectsPost({
                name: project_nameRef.current?.value ?? "test project by grapesjs", 
                public: true, 
                tags: ["Grapesjs", "Tag2", "Tag3"], 
                description: project_descriptionRef.current?.value ?? "test_project description",
                url: "",
                img_url: "",
                type: PROJECT_TYPE.HTML_CSS,
                data: {
                  content: [],
                  styles: [],
                  other: []
                }
              });
              console.log("Create Project data", data);
              const tokens = await getSession();
              console.log(tokens)
              const res = await fetch("http://3.135.207.187/display", {
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  refresh_token: tokens.refresh_token,
                  project_id: data.id
                })
              });
              const html_text = await res.text();
              // Open project in GrapesJS Editor
              let iframeSection = iframeRef.current;
              iframeSection.innerHTML = "";
              let iframe = document.createElement("iframe");
              iframe.width = "100%";
              iframe.height = "600px";
              iframe.srcdoc = html_text;//"http://127.0.0.1:5000/newproject";
              // "https://make-ui.herokuapp.com/view/6306f8e7db2cbec8c440f780?page=index";
              iframeSection.appendChild(iframe);
            }}>
              CREATE PROJECT
            </button>
        </section>
        <section ref={iframeRef} className="d-flex flex-wrap justify-content-start align-content-start gap-3">
          
        </section>
        <section className="history d-flex flex-wrap justify-content-start align-content-start gap-3">
          {status === "loading" ? (
            [...Array(pageSize).keys()].map(x => (
              <Document
                key={x}
                {...({
                  id: "",
                  url: "",
                  img_url: "",
                  name: "",
                } as any)}
              />
            ))
          ) : status === "error" ? (
            <span>Error: {(error as any).message}</span>
          ) : (
            <>
              {data
                ? data.pages.map(page => (
                    <Fragment key={page.nextId}>
                      {page.data.map(document => (
                        <Document key={document.id} {...document} sectionRef={sectionRef} />
                      ))}
                    </Fragment>
                  ))
                : null}
              <div className="menu" style={{ margin: "0px 33% 0px 0px", opacity: 1, pointerEvents: "none" }}>
                <button
                  ref={ref}
                  onClick={() => fetchNextPage()}
                  disabled={depleted || isFetchingNextPage} // !hasNextPage
                >
                  {isFetchingNextPage
                    ? "Loading..."
                    : !depleted // hasNextPage
                    ? "Load More Data"
                    : "No More Data"}
                </button>
              </div>
            </>
          )}
          <div
            className="modal"
            id="viewModal"
            tabIndex={-1}
            aria-labelledby="viewModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    style={{ fontSize: ".82rem" }}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <section ref={sectionRef} style={{ height: "80vh" }}></section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section> 
    );
}

export default Websites;