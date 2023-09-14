/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentRequest } from '../models/CreateDocumentRequest';
import type { DOCUMENT_TYPE } from '../models/DOCUMENT_TYPE';
import type { MultipleResults_DocumentSimilarityResult_ } from '../models/MultipleResults_DocumentSimilarityResult_';
import type { ResourceID } from '../models/ResourceID';
import type { SingleResult_DocumentResult_ } from '../models/SingleResult_DocumentResult_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V2DocumentsService {

    /**
     * Read Public Documents
     * Returns a list of documents.
     * Sorted by updated_at if description is not provided, otherwise use description for similarity search.
     * Requires no Authentication.
     * @param offset Offset for pagination.
     * @param limit Limit for pagination.
     * @param type Document type filter. Returns any if it is none. Defaults to none.
     * @param preview Preview mode. Sets result's **data** field to `null` if True to reduce payload size. Defaults to False.
     * @param description Used for similarity search if provided. Defaults to none. If not set, similarity search is not used, and result's similarity is null.
     * @param threshold When using similarity search, return only results above this threshold.
     * @param timeRange Two timestamps (before, after) for filtering. Defaults to none.
     * @param temperature Temperature for similarity search. Defaults to 0.2
     * @param tags List of tags to filter by. Not supported with similarity search yet. Defaults to none.
     * @returns MultipleResults_DocumentSimilarityResult_ Successful Response
     * @throws ApiError
     */
    public static readPublicDocumentsV2PublicDocumentsGet(
        offset?: number,
        limit: number = 5,
        type?: DOCUMENT_TYPE,
        preview: boolean = false,
        description?: string,
        threshold: number = 0.85,
        timeRange?: Array<string>,
        temperature: number = 0.2,
        tags?: Array<string>,
    ): CancelablePromise<MultipleResults_DocumentSimilarityResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/public/documents/',
            query: {
                'offset': offset,
                'limit': limit,
                'type': type,
                'preview': preview,
                'description': description,
                'threshold': threshold,
                'time_range': timeRange,
                'temperature': temperature,
                'tags': tags,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Public Document
     * Returns a single document under "result". Get public document by ID. Requires no Authentication.
     * @param id
     * @param preview Preview mode. Sets result's **data** field to `null` if True to reduce payload size. Defaults to False.
     * @returns SingleResult_DocumentResult_ Successful Response
     * @throws ApiError
     */
    public static readPublicDocumentV2PublicDocumentsIdGet(
        id: string,
        preview: boolean = false,
    ): CancelablePromise<SingleResult_DocumentResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/public/documents/{id}',
            path: {
                'id': id,
            },
            query: {
                'preview': preview,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read User Documents
     * Requires Authentication.
     * Returns a list of documents of the authenticated user.
     * Sorted by updated_at if description is not provided, otherwise use description for similarity search.
     * @param offset Offset for pagination.
     * @param limit Limit for pagination.
     * @param type Document type filter. Returns any if it is none. Defaults to none.
     * @param preview Preview mode. Sets result's **data** field to `null` if True to reduce payload size. Defaults to False.
     * @param description Used for similarity search if provided. Defaults to none. If not set, similarity search is not used, and result's similarity is null.
     * @param threshold When using similarity search, return only results above this threshold.
     * @param timeRange Two timestamps (before, after) for filtering. Defaults to none.
     * @param temperature Temperature for similarity search. Defaults to 0.2
     * @param tags List of tags to filter by. Not supported with similarity search yet. Defaults to none.
     * @returns MultipleResults_DocumentSimilarityResult_ Successful Response
     * @throws ApiError
     */
    public static readUserDocumentsV2UserDocumentsGet(
        offset?: number,
        limit: number = 5,
        type?: DOCUMENT_TYPE,
        preview: boolean = false,
        description?: string,
        threshold: number = 0.85,
        timeRange?: Array<string>,
        temperature: number = 0.2,
        tags?: Array<string>,
    ): CancelablePromise<MultipleResults_DocumentSimilarityResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/user/documents/',
            query: {
                'offset': offset,
                'limit': limit,
                'type': type,
                'preview': preview,
                'description': description,
                'threshold': threshold,
                'time_range': timeRange,
                'temperature': temperature,
                'tags': tags,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Create User Document
     * Create new document as Authenticated user.
     * @param requestBody
     * @returns ResourceID Successful Response
     * @throws ApiError
     */
    public static createUserDocumentV2UserDocumentsPost(
        requestBody: CreateDocumentRequest,
    ): CancelablePromise<ResourceID> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/user/documents/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read User Document
     * Get existing document as Authenticated user.
     * @param id
     * @param preview Preview mode. Sets result's **data** field to `null` if True to reduce payload size. Defaults to False.
     * @returns SingleResult_DocumentResult_ Successful Response
     * @throws ApiError
     */
    public static readUserDocumentV2UserDocumentsIdGet(
        id: string,
        preview: boolean = false,
    ): CancelablePromise<SingleResult_DocumentResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/user/documents/{id}',
            path: {
                'id': id,
            },
            query: {
                'preview': preview,
            },
            errors: {
                403: `Forbidden`,
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Update User Document
     * Update existing document as Authenticated user.
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserDocumentV2UserDocumentsIdPut(
        id: string,
        requestBody: CreateDocumentRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/user/documents/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Delete User Document
     * Delete existing document as Authenticated user.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteUserDocumentV2UserDocumentsIdDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/user/documents/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not Found`,
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

}
