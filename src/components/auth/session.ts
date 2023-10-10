import { setTokens, getTokens } from "./storage";
import type { Tokens, User } from "./storage";
import { API_URL } from "../app/constants";
import { OpenAPI } from "../../client";
import jwt_decode from "jwt-decode";
export type { Tokens };

/** Decode JWT and get user data*/
export const getUserData = (token: string): User => {
  const decoded = jwt_decode(token) as any;
  return {
    username: decoded["preferred_username"],
  };
};
/** Set Cookie using token and config variables. Set empty if undefined / logout. */
export const setSession = (tokens: Tokens | undefined) => {
  if (!tokens) {
    setTokens({
      id_token: "",
      access_token: "",
      expires_in: 0,
      refresh_token: "",
      token_type: "",
      is_admin: false,
      is_subscribed: false,
    });
    return;
  }
  const expiration = Math.floor(Date.now() / 1000) + tokens.expires_in;
  setTokens({ ...tokens, expires_in: expiration });
};
/** API call to auth provider using refresh token. Returns both if successful. */
export const refreshToken = (): Promise<Tokens> =>
  new Promise(async (resolve, reject) => {
    const tokens = getTokens();
    if (!tokens || !tokens.refresh_token) return reject("INVALID_SESSION");
    try {
      const response = await fetch(`${API_URL}/auth/noflow/refresh`, {
        method: "POST",
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.id_token || !data.refresh_token) reject("INVALID_SESSION");
        return resolve(data as Tokens);
      }
      return reject(response.status);
    } catch (e) {
      return reject("INVALID_SESSION");
    }
  });
/** Get Session from storage. If expired, call refresh. */
export const getSession = (): Promise<Tokens> =>
  new Promise(async (resolve, reject) => {
    const tokens = getTokens();
    if (tokens && tokens.expires_in > Math.floor(Date.now() / 1000)) {
      OpenAPI.TOKEN = tokens.id_token;
      return resolve(tokens);
    }
    return refreshToken()
      .then(tokens => {
        OpenAPI.TOKEN = tokens.id_token;
        setSession(tokens);
        return resolve(tokens);
      })
      .catch(e => reject("INVALID_SESSION"));
  });
