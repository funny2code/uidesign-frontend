import { useEffect, useState } from "react";
import type { DocumentSimilarityResult } from "../../../../client";
import { V2DocumentsService } from "../../../../client";
import CodeMirror from "@uiw/react-codemirror";
import { isDataText } from "../../../../client_utils/typeguards";

export interface Props {
  documents: DocumentSimilarityResult[];
  selectedDocument: DocumentSimilarityResult | undefined;
  setSelectedDocument: React.Dispatch<React.SetStateAction<DocumentSimilarityResult | undefined>>;
}
const DocumentsTable = ({ documents, selectedDocument, setSelectedDocument }: Props) => {
  const [documentData, setDocumentData] = useState<Record<string, any>>({});
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete?");
    if (!confirm) return;
    try {
      await V2DocumentsService.deleteUserDocumentV2UserDocumentsIdDelete(id);
      window.alert("Deleted");
    } catch {
      window.alert("Failed to delete");
    }
  };
  useEffect(() => {
    if (selectedDocument) {
      setDocumentData(prev =>
        isDataText(selectedDocument.data) ? { text: selectedDocument.data?.text } : selectedDocument.data
      );
    }
  }, [selectedDocument]);
  return (
    <section className="container-fluid px-2">
      <div className="row">
        <table className="table table-sm table-striped table-responsive table-hover">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Tags</th>
              <th>Owner</th>
              <th>Similarity</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {documents?.map((d, i) => (
              <tr key={`${d.id}-${i}`}>
                {/* <td>{d.id}</td> */}
                <td onClick={() => setSelectedDocument(d)}>{d.name}</td>
                <td onClick={() => setSelectedDocument(d)}>{d.type}</td>
                <td onClick={() => setSelectedDocument(d)}>{d.description}</td>
                <td onClick={() => setSelectedDocument(d)}>{d.tags.join(", ")}</td>
                <td onClick={() => setSelectedDocument(d)}>{d.owner_username}</td>
                <td onClick={() => setSelectedDocument(d)}>{d.similarity}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={e => {
                      handleDelete(d.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DocumentsTable;
