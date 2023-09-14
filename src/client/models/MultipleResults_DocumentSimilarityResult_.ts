/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentMetadata } from './DocumentMetadata';
import type { DocumentSimilarityResult } from './DocumentSimilarityResult';

/**
 * Wrapper for returning a collection.
 */
export type MultipleResults_DocumentSimilarityResult_ = {
    /**
     * List of retrieved documents.
     */
    result: Array<DocumentSimilarityResult>;
    metadata: DocumentMetadata;
};

