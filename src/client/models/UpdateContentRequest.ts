/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateContentRequest = {
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

