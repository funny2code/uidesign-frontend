import { useState, useEffect, useRef, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../../auth/useSession.tsx";
import { V3WebsitesProjectsService } from "../../../client/index.ts";
import Document from "./Document.tsx";
import { useInView } from "react-intersection-observer";

const Projects =  () => {
    const { getSession } = useSession();
    const pageSize = 10;
    const { ref, inView } = useInView();
    const [depleted, setDepleted] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [iframeDoc, setIframeDoc] = useState("");

    /***************************
     * Get All Grapejs Projects*
     ***************************/ 
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
      <>
      {!isEdit ? (
        <section className="designer d-flex flex-column justify-content-between">
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
                            <Document key={document.id} {...document} setIsEdit={setIsEdit} setIframeDoc={setIframeDoc}/>
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
          </section>
        </section>
      ) : (
        <>
          <section>
            <button><a href="/projects">Back</a></button>
          </section>
          <section className="designer-window hstack flex-grow-1">
            <iframe
              srcDoc={iframeDoc}
              title="Grapes Editor"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </section>
        </>
      )}
      </>
    );
}

export default Projects;