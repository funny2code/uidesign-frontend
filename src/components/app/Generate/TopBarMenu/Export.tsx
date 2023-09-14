import { generatedProjectsIds } from "../../../../atoms";
import { exportDocuments } from "../../utils/documents";
import { useSession } from "../../../auth/useSession";
import { OpenAPI } from "../../../../client";
import type { UIDesignPage, UIDesignAdminPage } from "./types";

const ExportButton = ({ currentPage }: { currentPage: UIDesignPage | UIDesignAdminPage }) => {
  const { getSession } = useSession();
  const handleExport = async () => {
    const tokens = await getSession();
    OpenAPI.TOKEN = tokens.id_token;
    const project = generatedProjectsIds.get();
    await exportDocuments(project[currentPage]);
  };
  return (
    <>
      <section className="menu">
        <button onClick={handleExport} className="settings" type="button">
          Export
        </button>
      </section>
    </>
  );
};

export default ExportButton;
