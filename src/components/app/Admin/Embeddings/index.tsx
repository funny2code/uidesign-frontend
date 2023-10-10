import React, { useState, useEffect } from "react";
import {
  V2DocumentsService,
  V2ProjectsService,
  V2AssetsService,
  PROJECT_TYPE,
} from "../../../../client";
import type {
  DocumentSimilarityResult,
  SimilarityResults,
  ProjectSimilarityResult,
} from "../../../../client";
import type { DOCUMENT_TYPE } from "../../../../client";
import DocumentsTable from "./DocumentsTable";
import ImagesGallery from "./ImagesGallery";
import ProjectsPanel from "./ProjectsPanel";
import Input from "./components/Input";
import InputType from "./components/InputType";
import InputNumber from "./components/InputNumber";
import InputInt from "./components/InputInt";

const sections = {
  documents: "documents",
  images: "images",
  projects: "projects",
};
const Embeddings = () => {
  // arrays
  const [documents, setDocuments] = useState<DocumentSimilarityResult[]>();
  const [images, setImages] = useState<SimilarityResults[]>();
  const [projects, setProjects] = useState<ProjectSimilarityResult[]>();
  // selected
  const [selectedDocument, setSelectedDocument] = useState<DocumentSimilarityResult | undefined>(
    undefined
  );
  const [selectedProject, setSelectedProject] = useState<ProjectSimilarityResult | undefined>(undefined);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [inputTemperature, setInputTemperature] = useState<number>(0.0);
  const [inputThreshold, setInputThreshold] = useState<number>(0.75);
  const [inputType, setInputType] = useState<DOCUMENT_TYPE | PROJECT_TYPE | "Any">("Any");
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
      threshold: inputThreshold,
      timeRange: undefined,
      temperature: inputTemperature,
    };
    const res = await V2DocumentsService.readPublicDocumentsV2PublicDocumentsGet(
      params.offset,
      params.limit,
      params.type as DOCUMENT_TYPE,
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

  const handleSubmitImages = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleSubmitProjects = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const res = await V2ProjectsService.readUserProjectsV2UserProjectsGet(
      params.offset,
      params.limit,
      params.type as PROJECT_TYPE,
      params.description,
      params.threshold
    );
    console.log(res);
    setProjects(res.result);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (section === "documents") {
      handleSubmitDocuments(e);
      setSelectedDocument(undefined);
    } else if (section === "projects") {
      handleSubmitProjects(e);
    } else if (section === "images") {
      handleSubmitImages(e);
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
            <form className="container p-2 px-4" onSubmit={handleSubmit}>
              <section className="pb-2 row gap-2">
                <Input placeholder="Description" value={inputSearch} setValue={setInputSearch} />
                <InputType value={inputType} setValue={setInputType} section={section} />
                <InputNumber
                  value={inputTemperature}
                  setValue={setInputTemperature}
                  label={"Temperature"}
                />
                <InputNumber value={inputThreshold} setValue={setInputThreshold} label={"Threshold"} />
                <InputInt value={offset} setValue={setOffset} label={"Offset"} />
                <InputInt value={limit} setValue={setLimit} label={"Limit"} />
                <div className="col-6 col-lg-3">
                  <button className="btn btn-primary p-2" type="submit">
                    Search
                  </button>
                </div>
              </section>
            </form>
          </div>
        </section>
        <section className="container p-4">
          <div className="row">
            {section == "documents" && documents && (
              <DocumentsTable
                documents={documents}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
              />
            )}
            {section == "images" && images && <ImagesGallery images={images} />}
            {section == "projects" && "Projects" && (
              <ProjectsPanel
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            )}
          </div>
          {/* CREATE */}
          <div className="row">
            <form className="" onSubmit={handleSubmit}>
              <div className="form-group">
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </section>
      </section>
    </>
  );
};

export default Embeddings;
