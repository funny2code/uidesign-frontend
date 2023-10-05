import type { DocumentSimilarityResult } from "../../../../client";
import CodeMirror from "@uiw/react-codemirror";

export interface Props {
  documents: DocumentSimilarityResult[];
  selectedDocument: DocumentSimilarityResult | undefined;
  setSelectedDocument: (d: DocumentSimilarityResult) => void;
}

const DocumentsTable = ({ documents, selectedDocument, setSelectedDocument }: Props) => {
  return (
    <section className="container">
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
      <div className="row">
        {selectedDocument && selectedDocument.data && (
          <CodeMirror
            value={selectedDocument.data?.text || JSON.stringify(selectedDocument.data, null, 2)}
          />
        )}
      </div>
    </section>
  );
};

export default DocumentsTable;
