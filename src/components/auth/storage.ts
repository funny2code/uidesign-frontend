// Utilities for storing and reading cookies
import { SESSION_PREFIX, BASE_DURATION, REFRESH_DURATION } from "./config";

export interface Tokens {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  is_subscribed: boolean;
  is_admin: boolean;
}
export interface User {
  username: string;
}
export function setTokens(tokens: Tokens) {
  localStorage.setItem(`${SESSION_PREFIX}-tokens`, JSON.stringify(tokens));
}
export function getTokens(): Tokens | undefined {
  const data = localStorage.getItem(`${SESSION_PREFIX}-tokens`);
  if (!data) return undefined;
  return JSON.parse(data);
}
