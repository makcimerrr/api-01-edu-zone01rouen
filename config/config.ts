// config.ts
import "https://deno.land/x/dotenv/load.ts";

export const API_VERSION = "v1";
export const API_BASE_PATH = "api";

export const CONFIG = {
    DOMAIN: Deno.env.get("DOMAIN")!,
    ACCESS_TOKEN: Deno.env.get("ACCESS_TOKEN")!,
};

/*
export const usersControllerPath = `../${API_BASE_PATH}/${API_VERSION}/user.ts`;
export const promotionsControllerPath = `../${API_BASE_PATH}/${API_VERSION}/promotion.ts`;
export const giteaControllerPath = `../${API_BASE_PATH}/${API_VERSION}/gitea.ts`;*/
