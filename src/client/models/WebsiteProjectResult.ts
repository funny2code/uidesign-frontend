/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type WebsiteProjectResult = {
    id: string;
    name: string;
    public: boolean;
    description: string;
    /**
     * Can be empty list.
     */
    tags: Array<string>;
    context?: Record<string, any>;
};

