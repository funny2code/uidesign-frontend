/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentMetadata } from './DocumentMetadata';
import type { ProjectSimilarityResult } from './ProjectSimilarityResult';

/**
 * Wrapper for returning a collection.
 */
export type MultipleResults_ProjectSimilarityResult_ = {
    /**
     * List of retrieved documents.
     */
    result: Array<ProjectSimilarityResult>;
    metadata: DocumentMetadata;
};

