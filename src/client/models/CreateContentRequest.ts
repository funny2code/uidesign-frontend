/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Schema for content request from client.
 */
export type CreateContentRequest = {
    /**
     * ID of the resource.
     */
    id?: string;
    url?: string;
    html?: string;
    img_url?: string;
    public?: boolean;
    /**
     * Used for creating the embedding.
     */
    description?: string;
    /**
     * Optional list of tags.
     */
    tags?: Array<string>;
};

