/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DOCUMENT_TYPE } from './DOCUMENT_TYPE';

export type CreateDocumentRequest = {
    name: string;
    public: boolean;
    description: string;
    url: string;
    img_url: string;
    tags: Array<string>;
    type: DOCUMENT_TYPE;
    data: Record<string, any>;
};

