import { PAGES } from "./TopBarMenu/constants";
import TopBarMenu from "./TopBarMenu";
import Messages from "./Messages";
import Embeddings from "./Embeddings";
import FigmaProjects from "./FigmaProjects";
import ColorsAsset from "./ColorsAsset";
import BravoProjects from "./BravoProjects";
import BravoAssets from "./BravoAssets";
import ImageAssets from './ImageAssets';
import Users from "./Users";
import { useState } from "react";

const Admin = () => {
  const [currentPage, setCurrentPage] = useState(() => PAGES.Messages);
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };
  return (
    <section className="designer d-flex flex-column justify-content-between">
      <TopBarMenu currentPage={currentPage} handlePageChange={handlePageChange} />
      {currentPage === PAGES.Messages && <Messages />}
      {currentPage === PAGES.Users && <Users />}
      {currentPage === PAGES.Embeddings && <Embeddings />}
      {currentPage === PAGES.FigmaProjects && <FigmaProjects />}
      {currentPage === PAGES.BravoProjects && <BravoProjects />}
      {currentPage === PAGES.ColorsAsset && <ColorsAsset />}
      {currentPage === PAGES.TextsAsset && <BravoAssets />}
      {currentPage === PAGES.ImageAssets && <ImageAssets />}
    </section>
  );
};

export default Admin;
