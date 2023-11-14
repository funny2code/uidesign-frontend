import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSession } from "../../../auth/useSession";
import { useInfiniteQuery } from "@tanstack/react-query";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import { useInView } from "react-intersection-observer";

const BtnRowRenderer = (props) => {
  const [colors, setColors] = useState(props.data.colors);
  const [description, setDescription] = useState(props.data.description);
  const [id, setId] = useState(props.data.id);
  const [modal_refs, setModal_refs] = useState(props.modal_refs);

  console.log("props: ", props)
  const fill_rowdata = () => {
    modal_refs.asset_idRef.current.value = id;
    modal_refs.asset_descriptionRef.current.value = description;
    console.log(colors.join(", "))
    modal_refs.asset_colorsRef.current.value = colors.join(", ");
    props.setSelectedRow(props.data);
  }
  return (
    <button 
      data-bs-toggle="modal"
      data-bs-target="#editModal"
      onClick={fill_rowdata}
    > 
      Edit 
    </button>
  )
}

const FigmaAssets = () => {
  const { getSession } = useSession();
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [depleted, setDepleted] = useState(false);
  const { ref, inView } = useInView();
  const pageSize = 10;
  const asset_idRef = useRef<HTMLInputElement>(null);
  const asset_descriptionRef = useRef<HTMLInputElement>(null);
  const asset_colorsRef = useRef<HTMLInputElement>(null);
  const _asset_idRef = useRef<HTMLInputElement>(null);
  const _asset_descriptionRef = useRef<HTMLInputElement>(null);
  const _asset_colorsRef = useRef<HTMLInputElement>(null);
  const [selectedRow, setSelectedRow] = useState({})

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      width: 50,
      field: 'checkboxBtn'
    },
    { field: "id", filter: true},
    { field: "description", filter: true },
    { field: "type" },
    { field: "colors" },
    {
      field: 'Edit',
      cellRenderer: BtnRowRenderer,
      cellRendererParams: {
        modal_refs: {asset_idRef, asset_descriptionRef, asset_colorsRef},
        setSelectedRow: setSelectedRow
      }
    }
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

  const createColors = () => {
    // gridRef.current.api.deselectAll();
    const colors = _asset_colorsRef.current.value.split(",");
    const request_data = {
      description: _asset_descriptionRef.current.value,
      colors: colors.map(str => str.trim()),
      type: "figma"
    };
    console.log("create request body: ", request_data);
    V3FigmaProjectsService.createFigmaColors(request_data);
  };
  

  const cellClickedListener = useCallback(event => {
    
  }, []);

  const updateColors = () => {
    const data = {
      ...selectedRow,
      colors: asset_colorsRef.current.value.split(", "),
      description: asset_descriptionRef.current.value
    }
    console.log("updated data: ", data);
    V3FigmaProjectsService.updateFigmaColors(asset_idRef.current.value, data);
  }

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  return (
    <>
      {/* Example using Grid's API */}
      <div style={{display: "flex", flexDirection: "row", marginBottom: '1px'}}>
        <button 
          style={{margin: '0px', width: 'fit-content'}} 
          data-bs-toggle="modal"
          data-bs-target="#createModal"
        >
          New Colors
        </button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={ _ => {
          const {api, columnApi} = gridRef.current;
          const selectedRows = api.getSelectedRows();
          console.log("selected rows: ", selectedRows)
          for (const colorset of selectedRows) {
            V3FigmaProjectsService.deleteFigmaColors(colorset.id);
          }
          api.applyTransaction({ remove: selectedRows })
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
          components={{ BtnRowRenderer }}
        />
      </div>
      <div
        className="modal"
        id="editModal"
        tabIndex={-1}
        aria-labelledby="editModalLabel"
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
                  <input type="hidden" ref={asset_idRef} />
                  <li>
                    <label>
                      Description <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={asset_descriptionRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Description"
                    />
                  </li>
                  <li>
                    <label>
                      Colors <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      ref={asset_colorsRef}
                      name="field3"
                      className="field-long"
                      placeholder="#ffffff, #0f0f0f"
                    />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateColors}
                      data-bs-dismiss="modal"
                    >
                      Update Colors
                    </button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal"
        id="createModal"
        tabIndex={-1}
        aria-labelledby="createModalLabel"
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
                  
                  <li>
                    <label>
                      Description <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={_asset_descriptionRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Description"
                    />
                  </li>
                  <li>
                    <label>
                      Colors <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      ref={_asset_colorsRef}
                      name="field3"
                      className="field-long"
                      placeholder="#ffffff, #0f0f0f"
                    />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={createColors}
                      data-bs-dismiss="modal"
                    >
                      Create Colors
                    </button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FigmaAssets;
