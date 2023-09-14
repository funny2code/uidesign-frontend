/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Get only required claims for db operations.
 */
export type UserData = {
    sub: string;
    preferred_username: string;
    type_id?: number;
    'cognito:groups'?: (Array<string> | string);
};

