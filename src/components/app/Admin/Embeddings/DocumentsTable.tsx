import type { DocumentSimilarityResult } from "../../../../client";
import { V2DocumentsService } from "../../../../client";
import CodeMirror from "@uiw/react-codemirror";

export interface Props {
  documents: DocumentSimilarityResult[];
  selectedDocument: DocumentSimilarityResult | undefined;
  setSelectedDocument: (d: DocumentSimilarityResult) => void;
}

const DocumentsTable = ({ documents, selectedDocument, setSelectedDocument }: Props) => {
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const document = selectedDocument;
    if (!document) return;
    if (document.hasOwnProperty("data") || !document.data) return;
    const req = {
      name: document.name,
      public: document.public,
      description: document.description,
      url: document.url,
      img_url: document.img_url,
      tags: document.tags,
      type: document.type,
      data: document.data,
    };
    try {
      await V2DocumentsService.updateUserDocumentV2UserDocumentsIdPut(document.id, req);
    } catch {
      window.alert("Saved");
    }
  };
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
  return (
    <section className="container">
      {selectedDocument && selectedDocument.data && (
        <div className="row" style={{ height: "500px" }}>
          <form className="vstack gap-2" onSubmit={handleSave}>
            <CodeMirror
              value={selectedDocument.data?.text || JSON.stringify(selectedDocument.data, null, 2)}
              height={"400px"}
            />
            <div className="form-group">
              <button className="btn btn-success">Save</button>
            </div>
          </form>
        </div>
      )}
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
