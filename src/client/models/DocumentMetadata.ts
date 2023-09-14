/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Metadata of the transaction. Non-persistent.
 */
export type DocumentMetadata = {
    /**
     * Whether the result is a preview and doesn't include the 'data' field.
     */
    preview: boolean;
    /**
     * Whether the result was retrieved by similarity.
     */
    by_similarity?: boolean;
};

