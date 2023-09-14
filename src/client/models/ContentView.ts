/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Schema for inserting and querying content from database.
 */
export type ContentView = {
    id: string;
    url: string;
    html: string;
    img_url: string;
    public: boolean;
    description: string;
    tags: Array<string>;
    owner?: string;
};

