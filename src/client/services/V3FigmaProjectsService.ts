import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V3FigmaProjectsService {
    /**
     * Create User Project
     * Create new project as Authenticated user.
     * @param requestBody
     * @returns ResourceID Successful Response
     * @throws ApiError
     */
    public static createFigmaProject(
        requestBody: Object,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/data/v3/user/figma/projects/',
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
    public static readPublicFigmaProjects(
        offset?: number,
        limit: number = 10,
        preview: boolean = false,
        description?: string,
        threshold: number = 0.75,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/public/figma/projects/',
            query: {
                'offset': offset,
                'limit': limit,
                'description': description,
                'threshold': threshold,
                'preview': preview
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
    public static readUserFigmaProject(
        id: string,
    ): CancelablePromise<{results: Object}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/user/figma/projects/{id}',
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
    public static updateUserFigmaProject(
        id: string,
        requestBody: Object,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/data/v3/user/figma/projects/{id}',
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
    public static deleteFigmaProject(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/v3/user/figma/projects/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    // color CRUD
    public static readAllFigmaColors(
        offset?: number = 1,
        limit: number = 10,
        type: string = "figma",
        threshold: number = 0.75,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/assets/storage/color-palettes/',
            query: {
                'offset': offset,
                'limit': limit,
                'type': type
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }
    
    public static createFigmaColors(
        requestBody: Object,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/data/v3/assets/storage/color-palettes/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    public static updateFigmaColors(
        id: string,
        requestBody: Object,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/data/v3/assets/storage/color-palettes/{id}',
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

    public static deleteFigmaColors(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/v3/assets/storage/color-palettes/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    // Images Part
    public static readAllImages(
        offset: number = 1,
        limit: number = 3,
        // type: string = "figma",
        threshold: number = 0.75,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/assets/storage/images/',
            query: {
                'offset': offset,
                'limit': limit,
                // 'type': type
            },
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }
    
    public static createImage(
        requestBody: Object,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/data/v3/assets/storage/images/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
                502: `Bad Gateway`,
            },
        });
    }

    public static updateImage(
        id: string,
        requestBody: Object,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/data/v3/assets/storage/images/{id}',
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

    public static deleteImage(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/v3/assets/storage/images/{id}',
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
