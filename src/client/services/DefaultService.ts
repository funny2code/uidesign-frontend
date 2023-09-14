/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HomeResponse } from '../models/HomeResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Home
     * General API information.
     * @returns HomeResponse Successful Response
     * @throws ApiError
     */
    public static homeGet(): CancelablePromise<HomeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

}
