import type { DOCUMENT_TYPE } from "../../../../client";
import type { WritableAtom } from "nanostores";

export type DataType = DOCUMENT_TYPE.HTML | DOCUMENT_TYPE.CSS;
export type StoresType = { [key in DataType]: WritableAtom<any> };
export type ShopifyHtml = string;
export type DocumentProcessor = {
  [key in DataType]: (d: string, b?: boolean) => string;
};
export type StatusCallback = (state: boolean, stores?: StoresType | ShopifyHtml) => void;
