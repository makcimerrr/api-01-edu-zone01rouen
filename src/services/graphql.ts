import {storage} from "../../config/storage.ts";
import {requestToken, refreshToken, isExpired} from "./auth.ts";
import {fetchAPI} from "../utils/fetch.ts";
import {CONFIG} from "../../config/config.ts";

export const getClient = async () => {
    let _pendingTokenQuery = requestToken();
    storage.set("hasura-jwt-token", (await _pendingTokenQuery).token);

    const getToken = async () => {
        let {token, payload} = await (_pendingTokenQuery || (_pendingTokenQuery = requestToken()));
        if (isExpired(payload)) {
            _pendingTokenQuery = refreshToken(token);
            return (await _pendingTokenQuery).token;
        }
        return token;
    };

    return {
        run: async (query: string, variables?: any) => {
            const form = JSON.stringify({query, variables});
            const body = await fetchAPI(
                CONFIG.DOMAIN,
                "/api/graphql-engine/v1/graphql",
                {
                    Authorization: `Bearer ${await getToken()}`,
                    "Content-Type": "application/json",
                    "Content-Length": form.length.toString(),
                },
                form
            );
            const {errors, data} = body;
            if (errors) {
                throw new Error(errors[0].message);
            }
            return data;
        },
    };
};