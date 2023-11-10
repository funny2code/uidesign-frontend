import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V3BravoProjectsService {
    /**
     * Create User Project
     * Create new project as Authenticated user.
     * @param requestBody
     * @returns ResourceID Successful Response
     * @throws ApiError
     */
    public static createBravoProject(
        requestBody: Object,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/data/v3/user/bravo/projects/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    /**
     * Read Website Projects
     * Requires Authentication. Always returns previews.
     * @param offset Offset for pagination.
     * @param limit Limit for pagination.
     * @param description Used for similarity search if provided. Defaults to none. If not set, similarity search is not used, and result's similarity is null.
     * @param threshold When using similarity search, return only results above this threshold.
     * @returns MultipleResults_ProjectSimilarityResult_ Successful Response
     * @throws ApiError
     */
    public static readPublicBravoProjects(
        offset?: number,
        limit: number = 10,
        description?: string,
        threshold: number = 0.75,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/public/bravo/projects/',
            query: {
                'offset': offset,
                'limit': limit,
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
         * Read User Project
         * Get existing project as Authenticated user.
         * @param id
         * @returns SingleResult_ProjectResult_ Successful Response
         * @throws ApiError
         */
    public static readUserBravoProject(
        id: string,
    ): CancelablePromise<{results: Object}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/user/bravo/projects/{id}',
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
    public static updateUserBravoProject(
        id: string,
        requestBody: Object,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/data/v3/user/bravo/projects/{id}',
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
     * Delete Website Project
     * Delete existing project as Authenticated user.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteBravoProject(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/v3/user/bravo/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

}
