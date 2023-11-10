import { useState, useEffect, useRef, Fragment } from "react";
import { PROJECT_PAGES } from '../ProjectTopBarMenu/constants.ts';
import type { UIProjectsPage } from '../ProjectTopBarMenu/types.ts'
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../../../auth/useSession.tsx";
import { V3WebsitesProjectsService } from "../../../../client/index.ts";
import Document from "./Document.tsx";
import { useInView } from "react-intersection-observer";

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
    const project_descriptionRef = useRef<HTMLTextAreaElement>(null);
    const project_privacyRef = useRef<HTMLSelectElement>(null);
    const iframeRef = useRef<HTMLDivElement>(null);
    const [depleted, setDepleted] = useState(false);
    const [isCreateProject, setIsCreateProject] = useState(false);
    const [privacyValue, setPrivacyValue] = useState("public");

    const toggle = () => {
      setIsCreateProject((isCreateProject) => !isCreateProject);
    }
    const handleChange = (e) => {
      setPrivacyValue(e.target.value);
    };

    const resetModal = () => {
      if (sectionRef){
        sectionRef.current.innerHTML = "";
        project_descriptionRef.current.value = "";
        project_tagRef.current.value = "";
        project_nameRef.current.value = "";
      }
    }
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
        const data = await V3WebsitesProjectsService.readPublicWebsiteProjects(
          pageParam,
          pageSize
        );
        setDepleted(data.results.length < pageSize);
        return { data: data.results, previousId: pageParam - pageSize, nextId: pageParam + pageSize };
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
        {!isCreateProject && 
          <div>
          <section className="d-flex flex-wrap justify-content-end align-content-start gap-3" >
            <button className="btn btn-primary" onClick={toggle}>CREATE PROJECT</button>
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
                        {
                          page.data.map(project => {
                            return (
                            <Document key={project.id} {...project} sectionRef={sectionRef} />
                            )
                          })
                        }
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
          </div>
        }
        {isCreateProject && <div>
          <button className="btn btn-primary" onClick={toggle}>Back to list</button>
          <section className="d-flex flex-wrap justify-content-start align-content-start gap-3" >
            <div>
            <form>
              <ul className="form-style-1">
                  <li>
                    <label>Name <span className="required">*</span></label>
                    <input type="text" ref={project_nameRef} name="field1" className="field-divided" placeholder="Project Name" />
                    
                    <label>Privacy</label>
                    <select name="field4" className="field-select" onChange={handleChange}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </li>
                  <li>
                      <label>Tags <span className="required">*</span></label>
                      <input type="email" ref={project_tagRef} name="field3" className="field-long" placeholder="Tag1, Tag2, Tag3" />
                  </li>
                  <li>
                      <label>Description <span className="required">*</span></label>
                      <textarea ref={project_descriptionRef} name="field5" id="field5" className="field-long field-textarea"></textarea>
                  </li>
                  <li>
                      <button type="button" data-bs-toggle="modal" className="btn btn-primary"
                        data-bs-target="#iframeModal"
                        onClick = {async () => {
                          let tags = project_tagRef.current?.value.split(",");

                          const tokens = await getSession();
                          // const res = await fetch("http://127.0.0.1:5000/display", {
                          const res = await fetch("http://3.135.207.187/display", {
                            method: "POST",
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              refresh_token: tokens.refresh_token,
                              action: "create_project",
                              data: {
                                name: project_nameRef.current?.value ?? "test project by grapesjs", 
                                public: privacyValue == "public"? true: false,
                                tags: project_tagRef.current?.value.split(",") ?? [],
                                description: project_descriptionRef.current?.value ?? "test_project description", 
                                context: {}
                              }
                            })
                          });
                          const html_text = await res.text();
                          // Open project in GrapesJS Editor
                          let iframeSection = sectionRef.current;
                          iframeSection.innerHTML = "";
                          let iframe = document.createElement("iframe");
                          iframe.width = "100%";
                          iframe.height = "600px";
                          iframe.srcdoc = html_text;
                          iframeSection.appendChild(iframe);
                        }}>CREATE PROJECT 
                      </button>
                  </li>
                </ul>
            </form>
              <br />
            </div>
            
          </section>
          
          <div
            className="modal background"
            id="iframeModal"
            tabIndex={-1}
            aria-labelledby="viewModalLabel"
            aria-hidden="true"
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
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
                    onClick={resetModal}
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <section ref={sectionRef} style={{ height: "80vh" }}></section>
                </div>
              </div>
            </div>
          </div>
          
          </div>
        }
        
      </section> 
    );
}

export default Websites;