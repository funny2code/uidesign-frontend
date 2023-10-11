import { DOCUMENT_TYPE } from "../client";

export type DataText = {
  text: string;
};
export type DataObject = Record<string, any>;

/** Defined as record with only one field, being "text". */
export const isDataText = (data: DataText | DataObject | undefined): data is DataText => {
  return data !== undefined && Object.keys(data).length === 1 && data.hasOwnProperty("text");
};

/** Not DataText */
export const isDataObject = (data: DataText | DataObject | undefined): data is DataObject => {
  return !isDataText(data);
};

export const TEXT_DOCUMENTS = [DOCUMENT_TYPE.HTML, DOCUMENT_TYPE.CSS];
export type TextDocumentType = DOCUMENT_TYPE.HTML | DOCUMENT_TYPE.CSS;
/** All document types that can be text. */
export const isTextDataDocumentType = (type: DOCUMENT_TYPE): type is TextDocumentType => {
  return TEXT_DOCUMENTS.includes(type);
};
