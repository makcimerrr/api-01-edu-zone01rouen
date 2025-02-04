import {storage} from "../../config/storage.ts";
import {fetchAPI} from "../utils/fetch.ts";
import {decodeJWT} from "../utils/jwt.ts";
import {CONFIG} from "../../config/config.ts";

export const requestToken = async () => {
    const res = await fetchAPI(CONFIG.DOMAIN, `/api/auth/token?token=${CONFIG.ACCESS_TOKEN}`, {});
    const token = res;
    const payload = decodeJWT(token);
    storage.set("hasura-jwt-token", token);
    return {token, payload};
};

export const isExpired = (payload: any) => {
    const diff = payload.exp - Date.now() / 1000;
    return storage.has("hasura-jwt-token") && Math.floor(diff) <= 0;
};

export const refreshToken = async (token: string) => {
    const newToken = await fetchAPI(CONFIG.DOMAIN, "/api/auth/refresh", {
        "x-jwt-token": token,
    });
    const payload = decodeJWT(newToken);
    return {token: newToken, payload};
};