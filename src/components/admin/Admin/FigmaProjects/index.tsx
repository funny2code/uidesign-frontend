import { useState, useEffect, useRef, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../../../auth/useSession.tsx";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import Project from "./Project.tsx";
import { useInView } from "react-intersection-observer";

const FigmaProjects = () => {
  const { getSession } = useSession();
  const pageSize = 10;
  const { ref, inView } = useInView();
  const sectionRef = useRef<HTMLDivElement>(null);
  const project_nameRef = useRef<HTMLInputElement>(null);
  const project_tagRef = useRef<HTMLInputElement>(null);
  const project_descriptionRef = useRef<HTMLTextAreaElement>(null);
  const project_idRef = useRef<HTMLInputElement>(null);
  const project_privacyRef = useRef<HTMLSelectElement>(null);
  const [depleted, setDepleted] = useState(false);
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [project_data, setProject_data] = useState(null);
  const [privacyValue, setPrivacyValue] = useState("public");

  const toggle = () => {
    setIsCreateProject(isCreateProject => !isCreateProject);
  };
  const handleChange = e => {
    setPrivacyValue(e.target.value);
  };

  const resetModal = () => {
    if (sectionRef) {
      project_descriptionRef.current.value = "";
      project_tagRef.current.value = "";
      project_nameRef.current.value = "";
    }
  };
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
      const data = await V3FigmaProjectsService.readPublicBravoProjects(pageParam, pageSize);
      setDepleted(data.results.length < pageSize);
      return { data: data.results, previousId: pageParam - pageSize, nextId: pageParam + pageSize };
    },
    {
      getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
      getNextPageParam: lastPage => lastPage.nextId ?? undefined,
    }
  );

  const create_project = () => {
    const request_data = {
      name: project_nameRef.current.value,
      description: project_descriptionRef.current.value,
      tags: project_tagRef.current.value.split(","),
      public: privacyValue == "public",
      screens: [],
    };
    console.log("create request body: ", request_data);
    V3FigmaProjectsService.createBravoProject(request_data);
    resetModal();
  };

  const updateProject = () => {
    const data = {
      ...project_data,
      name: project_nameRef.current.value,
      description: project_descriptionRef.current.value,
      tags: project_tagRef.current.value.split(","),
    };
    console.log("data : ", data);
    V3FigmaProjectsService.updateUserBravoProject(project_idRef.current.value, data);
  };

  useEffect(() => {
    if (inView && !depleted) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <section className="designer d-flex flex-column justify-content-between">
      {!isCreateProject && (
        <div>
          <section className="d-flex flex-wrap justify-content-end align-content-start gap-3">
            <button className="btn btn-primary" onClick={toggle}>
              CREATE PROJECT
            </button>
          </section>
          <section className="history d-flex flex-wrap justify-content-start align-content-start gap-3">
            {status === "loading" ? (
              [...Array(pageSize).keys()].map(x => (
                <Project
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
                        {page.data.map(project => {
                          return (
                            <Project
                              key={project.id}
                              {...project}
                              sectionRef={sectionRef}
                              project_nameRef={project_nameRef}
                              project_descriptionRef={project_descriptionRef}
                              project_tagRef={project_tagRef}
                              project_idRef={project_idRef}
                              setProject_data={setProject_data}
                              resetModal={resetModal}
                            />
                          );
                        })}
                      </Fragment>
                    ))
                  : null}
                <div
                  className="menu"
                  style={{ margin: "0px 33% 0px 0px", opacity: 1, pointerEvents: "none" }}
                >
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
                    <form>
                      <ul className="form-style-1">
                        <input type="hidden" ref={project_idRef} />
                        <li>
                          <label>
                            Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            ref={project_nameRef}
                            name="field1"
                            className="field-divided"
                            placeholder="Project Name"
                          />

                          <label>Privacy</label>
                          <select name="field4" className="field-select" onChange={handleChange}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </li>
                        <li>
                          <label>
                            Tags <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            ref={project_tagRef}
                            name="field3"
                            className="field-long"
                            placeholder="Tag1, Tag2, Tag3"
                          />
                        </li>
                        <li>
                          <label>
                            Description <span className="required">*</span>
                          </label>
                          <textarea
                            ref={project_descriptionRef}
                            name="field5"
                            id="field5"
                            className="field-long field-textarea"
                          ></textarea>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={updateProject}
                            data-bs-dismiss="modal"
                          >
                            Update PROJECT
                          </button>
                        </li>
                      </ul>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      {isCreateProject && (
        <div>
          <button className="btn btn-primary" onClick={toggle}>
            Back to list
          </button>
          <section className="d-flex flex-wrap justify-content-start align-content-start gap-3">
            <div>
              <form>
                <ul className="form-style-1">
                  <li>
                    <label>
                      Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={project_nameRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Project Name"
                    />

                    <label>Privacy</label>
                    <select name="field4" className="field-select" onChange={handleChange}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </li>
                  <li>
                    <label>
                      Tags <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      ref={project_tagRef}
                      name="field3"
                      className="field-long"
                      placeholder="Tag1, Tag2, Tag3"
                    />
                  </li>
                  <li>
                    <label>
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      ref={project_descriptionRef}
                      name="field5"
                      id="field5"
                      className="field-long field-textarea"
                    ></textarea>
                  </li>
                  <li>
                    <button type="button" className="btn btn-primary" onClick={create_project}>
                      CREATE PROJECT
                    </button>
                  </li>
                </ul>
              </form>
              <br />
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default FigmaProjects;
