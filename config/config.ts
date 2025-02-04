// config.ts
import "https://deno.land/x/dotenv/load.ts";

export const API_VERSION = "v1";
export const API_BASE_PATH = "api";

export const CONFIG = {
    DOMAIN: Deno.env.get("DOMAIN")!,
    ACCESS_TOKEN: Deno.env.get("ACCESS_TOKEN")!,
};