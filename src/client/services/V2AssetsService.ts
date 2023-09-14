/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssetResults } from '../models/AssetResults';
import type { CreateImageEmbedding } from '../models/CreateImageEmbedding';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V2AssetsService {

    /**
     * Read Similar Images
     * Get similar images.
     * @param description
     * @param threshold
     * @param offset
     * @param limit
     * @param temperature
     * @returns AssetResults Successful Response
     * @throws ApiError
     */
    public static readSimilarImagesV2AssetsImagesGet(
        description: Array<string>,
        threshold: number = 0.5,
        offset?: number,
        limit: number = 1,
        temperature: number = 0.2,
    ): CancelablePromise<AssetResults> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/assets/images/',
            query: {
                'description': description,
                'threshold': threshold,
                'offset': offset,
                'limit': limit,
                'temperature': temperature,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Upload Image
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static uploadImageV2AssetsImagesUploadPost(
        requestBody: CreateImageEmbedding,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/assets/images/upload',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

}
