/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentView } from '../models/ContentView';
import type { CreateContentRequest } from '../models/CreateContentRequest';
import type { EmbeddingPostRequest } from '../models/EmbeddingPostRequest';
import type { ResponseContentId } from '../models/ResponseContentId';
import type { ResponseWrapper_ContentViewSimilarity_ } from '../models/ResponseWrapper_ContentViewSimilarity_';
import type { ResponseWrapper_ResponseContentId_ } from '../models/ResponseWrapper_ResponseContentId_';
import type { UpdateContentRequest } from '../models/UpdateContentRequest';
import type { UserData } from '../models/UserData';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V1Service {

    /**
     * Create Content Deprecated
     * Create new content with embeddings in database.
     *
     * NOTE: This endpoint receives an ID in the body for testing purposes.
     * Otherwise it is randomly generated.
     * DEPRECATED: Use POST /embedding instead.
     * @param requestBody
     * @returns ResponseWrapper_ResponseContentId_ Successful Response
     * @throws ApiError
     */
    public static createContentDeprecatedV1EmbeddingCreatePost(
        requestBody: CreateContentRequest,
    ): CancelablePromise<ResponseWrapper_ResponseContentId_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/embedding/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Public Content By Embedded Description Deprecated
     * Get most similar results from database based on given description.
     *
     * NOTE: This endpoint still returns both Public and non-public content.
     * DEPRECATED: Use GET /embedding with a non null description query parameter.
     * For example: GET /embedding?description=...
     * @param requestBody
     * @returns ResponseWrapper_ContentViewSimilarity_ Successful Response
     * @throws ApiError
     */
    public static readPublicContentByEmbeddedDescriptionDeprecatedV1EmbeddingReadPost(
        requestBody: EmbeddingPostRequest,
    ): CancelablePromise<ResponseWrapper_ContentViewSimilarity_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/embedding/read',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Public Content List
     * Read list of content, max limit is 25.
     *
     * This endpoint returns public content only.
     * @param offset
     * @param limit
     * @param description
     * @param threshold
     * @returns ResponseWrapper_ContentViewSimilarity_ Successful Response
     * @throws ApiError
     */
    public static readPublicContentListV1EmbeddingGet(
        offset?: number,
        limit: number = 5,
        description?: string,
        threshold: number = 0.85,
    ): CancelablePromise<ResponseWrapper_ContentViewSimilarity_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/embedding/',
            query: {
                'offset': offset,
                'limit': limit,
                'description': description,
                'threshold': threshold,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Create Content
     * Create new content with embeddings in database.
     *
     * Include ID for testing purposes, otherwise it is automatically generated.
     * @param requestBody
     * @returns ResponseContentId Successful Response
     * @throws ApiError
     */
    public static createContentV1EmbeddingPost(
        requestBody: CreateContentRequest,
    ): CancelablePromise<ResponseContentId> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/embedding/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Public Content
     * Read content by id.
     *
     * This endpoint returns public content, for private content go to /user/{...}
     * @param id
     * @returns ContentView Successful Response
     * @throws ApiError
     */
    public static readPublicContentV1EmbeddingIdGet(
        id: string,
    ): CancelablePromise<ContentView> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/embedding/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Update Content
     * Update content in database.
     *
     * This requires Authorization and that the user owns the resource.
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateContentV1EmbeddingIdPut(
        id: string,
        requestBody: UpdateContentRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/embedding/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Delete Content
     * Delete content from database.
     *
     * This requires Authorization and that the user owns the resource.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteContentV1EmbeddingIdDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/embedding/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Content List
     * Read list of content, max limit is 25.
     *
     * Include description if want to search by similarity, with given threshold.
     * Otherwise returns ordered by last_modified.
     *
     * This endpoint only returns embeddings owned by the user.
     * @param offset
     * @param limit
     * @param description
     * @param threshold
     * @returns ResponseWrapper_ContentViewSimilarity_ Successful Response
     * @throws ApiError
     */
    public static readContentListV1UserEmbeddingGet(
        offset?: number,
        limit: number = 5,
        description?: string,
        threshold: number = 0.85,
    ): CancelablePromise<ResponseWrapper_ContentViewSimilarity_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user/embedding/',
            query: {
                'offset': offset,
                'limit': limit,
                'description': description,
                'threshold': threshold,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Content
     * Read content by id.
     *
     * This endpoint returns public content, for private content go to /user/{...}
     * @param id
     * @returns ContentView Successful Response
     * @throws ApiError
     */
    public static readContentV1UserIdGet(
        id: string,
    ): CancelablePromise<ContentView> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Test User
     * Test getting current user data.
     * @returns UserData Successful Response
     * @throws ApiError
     */
    public static testUserV1UserTestGet(): CancelablePromise<UserData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user/test/',
        });
    }

}
