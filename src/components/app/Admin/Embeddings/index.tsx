import React, { useState, useEffect } from "react";
import { V2DocumentsService, V2ProjectsService, V2AssetsService } from "../../../../client";
import type { DocumentResult, DocumentSimilarityResult, SimilarityResults } from "../../../../client";
import { DOCUMENT_TYPE } from "../../../../client";
import CodeMirror from "@uiw/react-codemirror";

const sections = {
  documents: "documents",
  images: "images",
  projects: "projects",
};
const Embeddings = () => {
  const [documents, setDocuments] = useState<DocumentSimilarityResult[]>();
  const [images, setImages] = useState<SimilarityResults[]>();
  const [selectedDocument, setSelectedDocument] = useState<DocumentSimilarityResult | undefined>(
    undefined
  );
  const [inputSearch, setInputSearch] = useState<string>("");
  const [inputTemperature, setInputTemperature] = useState<number>(0.1);
  const [inputType, setInputType] = useState<DOCUMENT_TYPE | "Any">("Any");
  const [section, setSection] = useState<string>("documents");
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(12);

  const handleSubmitDocuments = async (e: React.FormEvent<HTMLFormElement>) => {
    const params = {
      offset: offset,
      limit: limit,
      type: inputType === "Any" ? undefined : inputType,
      preview: false,
      description: inputSearch ? inputSearch : undefined,
      threshold: 0.75,
      timeRange: undefined,
      temperature: inputTemperature,
    };
    const res = await V2DocumentsService.readPublicDocumentsV2PublicDocumentsGet(
      params.offset,
      params.limit,
      params.type,
      params.preview,
      params.description,
      params.threshold,
      params.timeRange,
      params.temperature
    );
    console.log(res);
    setDocuments(res.result);
    //
  };

  const handleSubmitAssets = async (e: React.FormEvent<HTMLFormElement>) => {
    const params = {
      description: inputSearch,
    };
    const res = await V2AssetsService.readSimilarImagesV2AssetsImagesGet(
      [params.description],
      0.5,
      offset,
      limit,
      inputTemperature
    );
    console.log(res);
    setImages(res.result);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (section === "documents") {
      handleSubmitDocuments(e);
    } else if (section === "projects") {
    } else if (section === "images") {
      handleSubmitAssets(e);
    }
  };

  return (
    <>
      <section className="designer-window flex-grow-1" style={{ overflow: "auto" }}>
        <section className="container vstack p-0" style={{ marginTop: "-2px", marginLeft: "-2px" }}>
          <div className="row px-2">
            <ul className="nav nav-tabs">
              {Object.keys(sections).map(s => (
                <li
                  className={`nav-link text-dark ${s === section ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  key={s}
                  onClick={() => setSection(s)}
                >
                  {s.replace("_", " ")}
                </li>
              ))}
            </ul>
            <form className="p-2 px-4" onSubmit={handleSubmit}>
              <section className="pb-2 d-flex flex-row flex-wrap">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder={`Description`}
                  onChange={e => setInputSearch(e.target.value)}
                  value={inputSearch}
                />
                <div className="input-group w-25">
                  <span className="input-group-text">Type</span>
                  <select
                    className="form-select"
                    value={inputType}
                    onChange={e => setInputType(e.target.value as DOCUMENT_TYPE)}
                  >
                    <option value={"Any"}>Any</option>
                    {Object.entries(DOCUMENT_TYPE).map(([k, v]) => (
                      <option key={k} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group w-25">
                  <span className="input-group-text">Temperature</span>
                  <input
                    type="number"
                    step={0.01}
                    max={1.0}
                    min={0.0}
                    className="form-control"
                    placeholder="Temperature"
                    onChange={e => setInputTemperature(parseFloat(e.target.value))}
                    value={inputTemperature}
                  />
                </div>
              </section>
              <div className="hstack gap-2">
                <button className="btn btn-primary p-2" type="submit">
                  Search
                </button>
                <div className="input-group w-25">
                  <span className="input-group-text">Offset</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Offset"
                    onChange={e => setOffset(parseInt(e.target.value))}
                    value={offset}
                  />
                </div>
                <div className="input-group w-25">
                  <span className="input-group-text">Limit</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Limit"
                    onChange={e => setLimit(parseInt(e.target.value))}
                    value={limit}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
        <section className="container p-4">
          <div className="row">
            {section == "documents" && (
              <table className="table table-sm table-striped table-responsive table-hover w-100">
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Tags</th>
                    <th>Owner</th>
                    <th>Similarity</th>
                  </tr>
                </thead>
                <tbody>
                  {documents?.map((d, i) => (
                    <tr key={`${d.id}-${i}`} onClick={() => setSelectedDocument(d)}>
                      {/* <td>{d.id}</td> */}
                      <td>{d.name}</td>
                      <td>{d.type}</td>
                      <td>{d.description}</td>
                      <td>{d.tags.join(", ")}</td>
                      <td>{d.owner_username}</td>
                      <td>{d.similarity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {section == "images" && (
              <>
                {images &&
                  images[0].similar.map((d, i) => (
                    <div className="col-4">
                      <img
                        key={`${d.uri}-${i}`}
                        src={`https://app.uidesign.ai/images/${d.uri}`}
                        className="img-fluid"
                      />
                    </div>
                  ))}
              </>
            )}
          </div>
        </section>
        <section className="container p-4">
          <div className="row">
            {selectedDocument && selectedDocument.data && (
              <CodeMirror
                value={selectedDocument.data?.text || JSON.stringify(selectedDocument.data, null, 2)}
              />
            )}
          </div>
        </section>
      </section>
    </>
  );
};

export default Embeddings;
