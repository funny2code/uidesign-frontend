/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentMetadata } from './DocumentMetadata';
import type { ProjectDocumentsResult } from './ProjectDocumentsResult';

/**
 * Wrapper for returning a collection.
 */
export type MultipleResults_ProjectDocumentsResult_ = {
    /**
     * List of retrieved documents.
     */
    result: Array<ProjectDocumentsResult>;
    metadata: DocumentMetadata;
};

