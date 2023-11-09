import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class V3WebsitesProjectsService {
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
    public static readPublicWebsiteProjects(
        offset?: number,
        limit: number = 5,
        description?: string,
        threshold: number = 0.85,
    ): CancelablePromise<{results: Array<Object>}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/v3/public/website/projects/',
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
     * Delete Website Project
     * Delete existing project as Authenticated user.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteWebsiteProject(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/v3/user/website/projects/{id}',
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
