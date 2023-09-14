// Infinite scroll of user records
import { useState, useEffect, useRef, Fragment } from "react";
import { OpenAPI, V2ProjectsService } from "../../../client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "../../auth/useSession";
import DocumentItem from "./Document";

const pageSize = 10;
const History = () => {
  const { ref, inView } = useInView();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getSession } = useSession();
  const [depleted, setDepleted] = useState(false);
  // TODO: replace depleted with hasNextPage or server-side check
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
    ["history"],
    async ({ pageParam = 0 }) => {
      const tokens = await getSession();
      OpenAPI.TOKEN = tokens.id_token;
      const data = await V2ProjectsService.readUserProjectsV2UserProjectsGet(
        pageParam,
        pageSize,
        undefined
      );
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
    <section className="history d-flex flex-wrap justify-content-start align-content-start gap-3">
      {status === "loading" ? (
        [...Array(pageSize).keys()].map(x => (
          <DocumentItem
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
                    <DocumentItem key={document.id} {...document} sectionRef={sectionRef} />
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
  );
};

export default History;
