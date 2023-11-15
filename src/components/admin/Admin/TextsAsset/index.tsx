import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSession } from "../../../auth/useSession.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import { useInView } from "react-intersection-observer";

const BtnRowRenderer = (props) => {
  const [text, setText] = useState(props.data.text);
  const [meta_text, setMeta_text] = useState(props.data.meta_text);
  const [id, setId] = useState(props.data.id);
  const [text_type, setText_type] = useState(props.data.type);
  const [modal_refs, setModal_refs] = useState(props.modal_refs);

  // console.log("props: ", props)
  const fill_rowdata = () => {
    modal_refs.asset_idRef.current.value = id;
    modal_refs._asset_textRef.current.value = text;
    modal_refs._asset_meta_textRef.current.value = meta_text;
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

const TextsAsset = () => {
  const { getSession } = useSession();
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [pageParam, setPageParam] = useState(0);
  const pageSize = 10;
  const asset_idRef = useRef<HTMLInputElement>(null);
  const asset_textRef = useRef<HTMLInputElement>(null);
  const asset_meta_textRef = useRef<HTMLInputElement>(null);    
  const _asset_textRef = useRef<HTMLInputElement>(null);
  const _asset_meta_textRef = useRef<HTMLInputElement>(null);
  const [selectedRow, setSelectedRow] = useState({})
  const [texts_type, setTexts_type] = useState("figma");

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
    { field: "text", filter: true },
    { field: "type" },
    { field: "meta_text" },
    {
      field: 'Edit',
      cellRenderer: BtnRowRenderer,
      cellRendererParams: {
        modal_refs: {asset_idRef, _asset_textRef, _asset_meta_textRef},
        setSelectedRow: setSelectedRow
      }
    }
  ]);

  const onGridReady = async () => {
    const data = await V3FigmaProjectsService.readAllTexts(pageParam, pageSize);
    setRowData(data.sentences);
  }

  const createTexts = async () => {
    const request_data = {
      text: asset_textRef.current.value,
      meta_text: asset_meta_textRef.current.value,
      type: texts_type
    };
    const created_texts = await V3FigmaProjectsService.createTexts(request_data);
    const {api, columnApi} = gridRef.current;
    const addedItem =  {
      id: created_texts.id,
      text: asset_textRef.current.value,
      meta_text: asset_meta_textRef.current.value,
      type: texts_type
    };
    console.log("addedItem: ", addedItem);
    api.applyTransaction({ add:[addedItem]});
  };

  const updateTexts = () => {
    const data = {
      ...selectedRow,
      meta_text: _asset_meta_textRef.current.value,
      text: _asset_textRef.current.value
    }
    console.log("updated data: ", data);
    V3FigmaProjectsService.updateTexts(asset_idRef.current.value, data);
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
    const data = await V3FigmaProjectsService.readAllTexts(prevParam, pageSize);
    setRowData(data.sentences);
  };

  const onBtNext = async () => {
    let nextPageParam = pageParam + pageSize;
    setPageParam(nextPageParam);
    console.log("Updated Page Param: ", nextPageParam, pageParam)
    const data = await V3FigmaProjectsService.readAllTexts(nextPageParam, pageSize);
    setRowData(data.sentences);
  }

  const handleChange = (e) => {
    setTexts_type(e.target.value);
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
          New Texts
        </button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={ _ => {
          const {api, columnApi} = gridRef.current;
          const selectedRows = api.getSelectedRows();
          console.log("selected rows: ", selectedRows)
          for (const textasset of selectedRows) {
            V3FigmaProjectsService.deleteTexts(textasset.id);
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
                      text <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={_asset_textRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Text"
                    />
                  </li>
                  <li>
                    <label>
                      Meta Text <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={_asset_meta_textRef}
                      name="field3"
                      className="field-long"
                      placeholder="meta text"
                    />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateTexts}
                      data-bs-dismiss="modal"
                    >
                      Update Texts
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
                      text <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={asset_textRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Text"
                    />
                  </li>
                  <li>
                    <label>
                      Meta Text <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      ref={asset_meta_textRef}
                      name="field3"
                      className="field-long"
                      placeholder="meta text"
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
                      onClick={createTexts}
                      data-bs-dismiss="modal"
                    >
                      Create Texts
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

export default TextsAsset;