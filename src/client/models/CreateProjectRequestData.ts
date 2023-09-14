/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateDocumentRequest } from './CreateDocumentRequest';

export type CreateProjectRequestData = {
    content: Array<CreateDocumentRequest>;
    styles: Array<CreateDocumentRequest>;
    other: Array<CreateDocumentRequest>;
};

