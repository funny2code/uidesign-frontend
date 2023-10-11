export interface UserRequest {
  limit: number;
  subscribed_only: boolean;
  pagination_token?: string;
  email_filter?: string;
}
export interface User {
  Username: string;
  Attributes: { Name: string; Value: string }[];
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
}
export interface UserData extends User {
  UserAttributes: { Name: string; Value: string }[];
  is_subscribed: boolean;
  is_admin: boolean;
}
export interface UserResponse {
  pagination_token: string;
  users: Array<User>;
}
export interface UpdateStatus {
  is_subscribed: boolean;
}
export interface UserPoolData {
  number_of_users: number;
}
