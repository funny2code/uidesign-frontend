import { OpenAPI } from "../../../../client";
import type { UserRequest, UserResponse, UserData, UpdateStatus, UserPoolData } from "./types";

export const getUsers = async (props: UserRequest, token: string) => {
  var url = `${OpenAPI.BASE}/auth/admin/users/`;
  url += `?limit=${props.limit}&subscribed_only=${props.subscribed_only}`;
  if (props.email_filter) {
    url += `&email_filter=${props.email_filter}`;
  }
  if (props.pagination_token) {
    url += `&pagination_token=${encodeURIComponent(props.pagination_token)}`;
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json as UserResponse;
  } catch (e) {
    console.log(e);
  }
};

export const getUserData = async (user_email: string, token: string) => {
  var url = `${OpenAPI.BASE}/auth/admin/users/${user_email}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json as UserData;
  } catch (e) {
    console.log(e);
  }
};
export const updateUser = async (user_email: string, props: UpdateStatus, token: string) => {
  var url = `${OpenAPI.BASE}/auth/admin/users/${user_email}`;
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(props),
    });
    console.log(res.status);
    return res.status;
  } catch (e) {
    console.log(e);
  }
};

export const getUserPoolData = async (token: string) => {
  var url = `${OpenAPI.BASE}/auth/admin/userpool/`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json as UserPoolData;
  } catch (e) {
    console.log(e);
  }
};
