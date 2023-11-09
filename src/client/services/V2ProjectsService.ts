/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProjectRequest } from '../models/CreateProjectRequest';
import type { MultipleResults_ProjectDocumentsResult_ } from '../models/MultipleResults_ProjectDocumentsResult_';
import type { MultipleResults_ProjectSimilarityResult_ } from '../models/MultipleResults_ProjectSimilarityResult_';
import type { PROJECT_TYPE } from '../models/PROJECT_TYPE';
import type { ResourceID } from '../models/ResourceID';
import type { SingleResult_ProjectResult_ } from '../models/SingleResult_ProjectResult_';
import type { UpdateProjectDocumentsRequest } from '../models/UpdateProjectDocumentsRequest';
import type { UpdateProjectRequest } from '../models/UpdateProjectRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V2ProjectsService {

    /**
     * Read User Projects
     * Requires Authentication. Always returns previews.
     * @param offset Offset for pagination.
     * @param limit Limit for pagination.
     * @param type Project type filter. Returns any if it is none. Defaults to none.
     * @param description Used for similarity search if provided. Defaults to none. If not set, similarity search is not used, and result's similarity is null.
     * @param threshold When using similarity search, return only results above this threshold.
     * @returns MultipleResults_ProjectSimilarityResult_ Successful Response
     * @throws ApiError
     */
    public static readUserProjectsV2UserProjectsGet(
        offset?: number,
        limit: number = 5,
        type?: PROJECT_TYPE,
        description?: string,
        threshold: number = 0.85,
    ): CancelablePromise<MultipleResults_ProjectSimilarityResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/user/projects/',
            query: {
                'offset': offset,
                'limit': limit,
                'type': type,
                'description': description,
                'threshold': threshold,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Create User Project
     * Create new project as Authenticated user.
     * @param requestBody
     * @returns ResourceID Successful Response
     * @throws ApiError
     */
    public static createUserProjectV2UserProjectsPost(
        requestBody: CreateProjectRequest,
    ): CancelablePromise<ResourceID> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/user/projects/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read User Project
     * Get existing project as Authenticated user.
     * @param id
     * @returns SingleResult_ProjectResult_ Successful Response
     * @throws ApiError
     */
    public static readUserProjectV2UserProjectsIdGet(
        id: string,
    ): CancelablePromise<SingleResult_ProjectResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/user/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Update User Project
     * Update existing project as Authenticated user.
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserProjectV2UserProjectsIdPut(
        id: string,
        requestBody: UpdateProjectRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/user/projects/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Delete User Project
     * Delete existing project as Authenticated user.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteUserProjectV2UserProjectsIdDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/user/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read User Project Documents
     * @param id
     * @param preview Preview mode. Sets result's **data** field to `null` if True to reduce payload size. Defaults to False.
     * @returns MultipleResults_ProjectDocumentsResult_ Successful Response
     * @throws ApiError
     */
    public static readUserProjectDocumentsV2UserProjectsIdDocumentsGet(
        id: string,
        preview: boolean = false,
    ): CancelablePromise<MultipleResults_ProjectDocumentsResult_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/user/projects/{id}/documents/',
            path: {
                'id': id,
            },
            query: {
                'preview': preview,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Update User Project Documents
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserProjectDocumentsV2UserProjectsIdDocumentsPut(
        id: string,
        requestBody: UpdateProjectDocumentsRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/user/projects/{id}/documents/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

}