import { AgGridReact } from "ag-grid-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useSession } from "../../../auth/useSession.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { V3FigmaProjectsService } from "../../../../client/index.ts";
import { useInView } from "react-intersection-observer";

const BtnRowRenderer = (props) => {
    const [id, setId] = useState(props.data.id);
    const [description, setDescription] = useState(props.data.description);
    const [modal_refs, setModal_refs] = useState(props.modal_refs);

    console.log("props: ", props)

    const fill_rowdata = () => {
        modal_refs.image_idRef.current.value = id;
        modal_refs.image_descriptionRef.current.value = description;
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

const ImageAssets = () => {
  const { getSession } = useSession();
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [depleted, setDepleted] = useState(false);
  const { ref, inView } = useInView();
  const [pageParam, setPageParam] = useState(0);
  const pageSize = 10;
  const image_idRef = useRef<HTMLInputElement>(null);
  const image_descriptionRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState();
  const [image_preview, setImage_preview] = useState();
  const [selectedRow, setSelectedRow] = useState({})
  const [imageType, setImageType] = useState("figma");

  // const createImage = (imageFile, callback) => {
  //   const image = document.createElement('img');
  //   image.onload = () => callback(image);
  //   image.setAttribute('src', imageFile);
  // }

  // const convertImage = (image) => {
  //   const canvas = drawImageToCanvas(image);
  //   const ctx = canvas.getContext('2d');
    
  //   let result = [];
  //   for (let y = 0; y < canvas.height; y++) {
  //     result.push([]);
  //     for (let x = 0; x < canvas.width; x++) {
  //       let data = ctx.getImageData(x, y, 1, 1).data;
  //       result[y].push(data[0]);
  //       result[y].push(data[1]);
  //       result[y].push(data[2]);
  //     }
  //   }
  // }
  // const readImageAsArrayBuffer => (s) {
  //   const input = document.getElementById('imageInput');
  //   const file = input.files[0];
  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //       const arrayBuffer = e.target.result;
  //       const imageObject = {
  //         type: "figma",
  //         data: Array.from(new Uint8Array(arrayBuffer)),
  //       }
  //       console.log(imageObject);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }
  const handleFileChange = (e) => {
    console.log(e.target.files);
    const image_file = e.target.files[0];
    console.log("image data: ", e.target.result)
    const imageFile = URL.createObjectURL(image_file);
    setImage_preview(imageFile);
    const reader = new FileReader();
    reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        const imageObject = {
          type: "figma",
          data: Array.from(new Uint8Array(arrayBuffer)),
        }
        console.log(imageObject);
        setFile( Array.from(new Uint8Array(arrayBuffer)) )
    };
    reader.readAsArrayBuffer(image_file);
  }

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
    // { field: "type" },
    { field: "width" },
    { field: "height" },
    { field: "mime_type" },
    {
      field: 'Edit',
      cellRenderer: BtnRowRenderer,
      cellRendererParams: {
        modal_refs: {image_idRef, image_descriptionRef},
        setSelectedRow: setSelectedRow
      }
    }
  ]);

  const onGridReady = async () => {
    const data = await V3FigmaProjectsService.readAllImages(pageParam, pageSize);
    setRowData(data.images);
  }
  
  const createImageAsset = async () => {
    const request_data = {
      data: file,
      type: imageType
    };
    console.log("create request body: ", request_data);
    const created_asset = await V3FigmaProjectsService.createImage(request_data);
    const {api, columnApi} = gridRef.current;
    const addedItem =  {
      id: created_asset.id
    };
    console.log("addedItem: ", addedItem);
    api.applyTransaction({ add:[addedItem]});
  };

  const updateImage = () => {
    const data = {
      ...selectedRow,
      description: image_descriptionRef.current.value
    }
    console.log("updated data: ", data);
    V3FigmaProjectsService.updateImage(image_idRef.current.value, data);
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
    const data = await V3FigmaProjectsService.readAllImages(pageParam, pageSize);
    setRowData(data.images);
  };

  const onBtNext = async () => {
    let nextPageParam = pageParam + pageSize;
    setPageParam(nextPageParam);
    console.log("Updated Page Param: ", nextPageParam, pageParam)
    const data = await V3FigmaProjectsService.readAllImages(pageParam, pageSize);
    setRowData(data.images);
  }

  const handleChange = (e) => {
    setImageType(e.target.value);
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
          New Image
        </button>
        <button style={{margin: '0px', width: 'fit-content'}} onClick={ _ => {
          const {api, columnApi} = gridRef.current;
          const selectedRows = api.getSelectedRows();
          console.log("selected rows: ", selectedRows)
          for (const image_item of selectedRows) {
            V3FigmaProjectsService.deleteImage(image_item.id);
          }
          api.applyTransaction({ remove: selectedRows })
        }} >
          Delete selected Images
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
                  <input type="hidden" ref={image_idRef} />
                  <li>
                    <label>
                      Description <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      ref={image_descriptionRef}
                      name="field1"
                      className="field-divided"
                      placeholder="Description"
                    />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateImage}
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
                  
                    <div className="App">
                        <h2>Add Image:</h2>
                        <input type="file" onChange={handleFileChange} />
                        <img src={image_preview} style={{width: 100, height: 100}} />
            
                    </div>
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
                        onClick={createImageAsset}
                        data-bs-dismiss="modal"
                        >
                        Create Image Asset
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

export default ImageAssets;
