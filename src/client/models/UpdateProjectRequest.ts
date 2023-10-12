/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PROJECT_TYPE } from './PROJECT_TYPE';

export type UpdateProjectRequest = {
    name: string;
    public: boolean;
    description: string;
    url: string;
    img_url: string;
    tags: Array<string>;
    context?: Record<string, any>;
    type: PROJECT_TYPE;
};

