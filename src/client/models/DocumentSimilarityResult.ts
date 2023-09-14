/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DOCUMENT_TYPE } from './DOCUMENT_TYPE';
import type { USER_TYPE } from './USER_TYPE';

export type DocumentSimilarityResult = {
    id: string;
    owner_username: string;
    owner_type: USER_TYPE;
    created_at: string;
    updated_at: string;
    name: string;
    public: boolean;
    description: string;
    url: string;
    img_url: string;
    /**
     * Document tags, can be empty list.
     */
    tags: Array<string>;
    type: DOCUMENT_TYPE;
    data?: Record<string, any>;
    /**
     * Similarity score, may be over 1.0 if temperature is > 0
     */
    similarity?: number;
};

