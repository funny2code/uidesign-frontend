/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateProjectRequestData } from './CreateProjectRequestData';
import type { PROJECT_TYPE } from './PROJECT_TYPE';

export type CreateProjectRequest = {
    name: string;
    public: boolean;
    description: string;
    url: string;
    img_url: string;
    tags: Array<string>;
    type: PROJECT_TYPE;
    data: CreateProjectRequestData;
};

