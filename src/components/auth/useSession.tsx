// Hook for session callbacks.
import { setSession, getSession, getUserData } from "./session";
import type { Tokens, User } from "./storage";
import { API_URL } from "../app/constants";

export interface UseSessionCalllbacks {
    setSession: (tokens: Tokens | undefined) => void;
    getSession: () => Promise<Tokens>;
    getUserData: (token: string) => User;
    authURL: string;
}
/** Get callbacks for managing session tokens.*/
export const useSession = (): UseSessionCalllbacks => {
    return { setSession: setSession, getSession: getSession, authURL: API_URL, getUserData: getUserData }
}