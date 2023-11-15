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
  const pageSize = 10;
  const image_idRef = useRef<HTMLInputElement>(null);
  const image_descriptionRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState();
  const [image_preview, setImage_preview] = useState();
  const [selectedRow, setSelectedRow] = useState({})

  const handleFileChange = (e) => {
    console.log(e.target.files);
    const image_file = e.target.files[0];
    setImage_preview(URL.createObjectURL(image_file));
    console.log("image file: ", image_file);
    const reader = new FileReader();
    reader.onload = () => {
        let { result } = reader;
        let index = result.indexOf("base64") + 7;
        let data = result.slice(index);
        console.log("prefix: ", result?.slice(0, index))
        setFile(data);
    };
    reader.readAsDataURL(image_file);
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
    ["imageassets"],
    async ({ pageParam = 0 }) => {
      const tokens = await getSession();
      const data = await V3FigmaProjectsService.readAllImages(pageParam, pageSize);
      console.log("images: ", data)
      setRowData(data.images);
      setDepleted(data.images.length < pageSize);
      return { data: data.images, previousId: pageParam - pageSize, nextId: pageParam + pageSize };
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

  const createImageAsset = async () => {
    const request_data = {
      file: file,
      type: "default"
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
