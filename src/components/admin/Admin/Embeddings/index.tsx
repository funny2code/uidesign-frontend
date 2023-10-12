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
import CreateEditor from "./CreateEditor";
import Button from "./components/Button";
import SectionWrapper from "./components/SectionWrapper";

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
  const [viewEditor, setViewEditor] = useState<boolean>(false);

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
        <div className="row gap-0" style={{ marginTop: "-2px", marginLeft: "-2px" }}>
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
          {/* CREATE */}
          {section == "documents" && (
            <SectionWrapper>
              <CreateEditor
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
              />
            </SectionWrapper>
          )}
          {/* SEARCH / VIEW / EDIT / DELETE */}
          <SectionWrapper>
            <span className="form-text p-0 m-0">Search</span>
            <form className="row gap-0" onSubmit={handleSubmit}>
              <Input placeholder="Description" value={inputSearch} setValue={setInputSearch} />
              <InputType value={inputType} setValue={setInputType} section={section} allowAny={true} />
              <InputNumber
                value={inputTemperature}
                setValue={setInputTemperature}
                label={"Temperature"}
              />
              <InputNumber value={inputThreshold} setValue={setInputThreshold} label={"Threshold"} />
              <InputInt value={offset} setValue={setOffset} label={"Offset"} />
              <InputInt value={limit} setValue={setLimit} label={"Limit"} />
              <Button text={"Search"} />
            </form>
          </SectionWrapper>
          <SectionWrapper>
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
          </SectionWrapper>
        </div>
      </section>
    </>
  );
};

export default Embeddings;
