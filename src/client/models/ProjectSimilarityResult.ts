/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PROJECT_TYPE } from './PROJECT_TYPE';
import type { USER_TYPE } from './USER_TYPE';

export type ProjectSimilarityResult = {
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
     * Can be empty list.
     */
    tags: Array<string>;
    type: PROJECT_TYPE;
    context?: Record<string, any>;
    /**
     * Can be empty list.
     */
    document_ids: Array<string>;
    /**
     * Similarity score, may be over 1.0 if temperature is > 0
     */
    similarity?: number;
};

