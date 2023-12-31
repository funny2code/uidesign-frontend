import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSession } from "../../../auth/useSession.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import { useInView } from "react-intersection-observer";

const BtnRowRenderer = (props) => {
  const [colors, setColors] = useState(props.data.colors);
  const [description, setDescription] = useState(props.data.description);
  const [id, setId] = useState(props.data.id);
  const [modal_refs, setModal_refs] = useState(props.modal_refs);

  // console.log("props: ", props)
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

const ColorsAsset = () => {
  const { getSession } = useSession();
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [depleted, setDepleted] = useState(false);
  const { ref, inView } = useInView();
  const [pageParam, setPageParam] = useState(0);
  const pageSize = 10;
  const asset_idRef = useRef<HTMLInputElement>(null);
  const asset_descriptionRef = useRef<HTMLInputElement>(null);
  const asset_colorsRef = useRef<HTMLInputElement>(null);
  const _asset_idRef = useRef<HTMLInputElement>(null);
  const _asset_descriptionRef = useRef<HTMLInputElement>(null);
  const _asset_colorsRef = useRef<HTMLInputElement>(null);
  const [selectedRow, setSelectedRow] = useState({})
  const [colorType, setColorType] = useState('figma');

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

  const onGridReady = async () => {
    const data = await V3FigmaProjectsService.readAllColors(pageParam, pageSize);
    // setDepleted(data.color_palettes.length < pageSize);
    setRowData(data.color_palettes);
  }

  const createColors = async () => {
    const colors = _asset_colorsRef.current.value.split(",");
    const request_data = {
      description: _asset_descriptionRef.current.value,
      colors: colors.map(str => str.trim()),
      type: colorType
    };
    const created_colors = await V3FigmaProjectsService.createColors(request_data);
    const {api, columnApi} = gridRef.current;
    const addedItem =  {
      id: created_colors.id,
      description: _asset_descriptionRef.current.value,
      colors: colors.map(str => str.trim())
    };
    console.log("addedItem: ", addedItem);
    api.applyTransaction({ add:[addedItem]});
  };

  const updateColors = () => {
    const data = {
      ...selectedRow,
      colors: asset_colorsRef.current.value.split(", "),
      description: asset_descriptionRef.current.value
    }
    console.log("updated data: ", data);
    V3FigmaProjectsService.updateColors(asset_idRef.current.value, data);
    const {api, columnApi} = gridRef.current;
    api.applyTransaction({update: [data]})
  }

  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  const onBtPrevious = async () => {
    let prevParam = pageParam - pageParam;
    if (prevParam < 0) prevParam = 0;
    setPageParam(prevParam);
    console.log("Updated Page Param: ", prevParam, pageParam)
    const data = await V3FigmaProjectsService.readAllColors(prevParam, pageSize);
    setRowData(data.color_palettes);
  };

  const onBtNext = async () => {
    let nextPageParam = pageParam + pageSize;
    setPageParam(nextPageParam);
    console.log("Updated Page Param: ", nextPageParam, pageParam)
    const data = await V3FigmaProjectsService.readAllColors(nextPageParam, pageSize);
    setRowData(data.color_palettes);
  }

  const handleChange = (e) => {
    setColorType(e.target.value);
  }

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
            V3FigmaProjectsService.deleteColors(colorset.id);
          }
          api.applyTransaction({ remove: selectedRows })
        }} >
          Delete selected Rows
        </button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={onBtPrevious}>To Previous</button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={onBtNext}>To Next</button>
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
          // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          components={{ BtnRowRenderer }}
          onGridReady={onGridReady}
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
                    <label>Type</label>
                    <select name="field4" className="field-select" onChange={handleChange}>
                      <option value="figma">Figma</option>
                      <option value="bravo">Bravo</option>
                    </select>
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

export default ColorsAsset;
