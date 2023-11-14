import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSession } from "../../../auth/useSession";
import { useInfiniteQuery } from "@tanstack/react-query";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import { useInView } from "react-intersection-observer";
import { GridApi } from "ag-grid-community";

const FigmaAssets = () => {
  const { getSession } = useSession();
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [depleted, setDepleted] = useState(false);
  const { ref, inView } = useInView();
  const pageSize = 10;
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      width: 50,
      field: 'checkboxBtn'
    },
    { field: "id", filter: true },
    { field: "description", filter: true },
    { field: "type" },
    { field: "colors" },
    { field: "created_at" },
    { field: "updated_at" }
  ]);

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
    ["figmacolors"],
    async ({ pageParam = 0 }) => {
      const tokens = await getSession();
      const data = await V3FigmaProjectsService.readAllFigmaColors(pageParam, pageSize);
      setRowData(data.color_palettes);
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

  const buttonListener = useCallback(e => {
    gridRef.current.api.deselectAll();
  }, []);

  const cellClickedListener = useCallback(event => {
    console.log("cellClicked", event);
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  return (
    <>
      {/* Example using Grid's API */}
      <div style={{display: "flex", flexDirection: "row", marginBottom: '1px'}}>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={buttonListener}>Push Me</button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={ _ => {
          const selectedRows = gridRef.current.api.getSeletectedRows()
          gridRef.current.api.applyTransaction({ remove: selectedRows })
        }} >
          Delete selected Rows
        </button>
      </div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: 'auto', height: '100%' }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </>
  );
};

export default FigmaAssets;
