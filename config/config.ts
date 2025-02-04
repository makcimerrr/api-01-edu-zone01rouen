// config.ts
import "https://deno.land/x/dotenv/load.ts";

export const VERSION_ACTUAL = "v1";
export const BASE_PATH = "api";

export const CONFIG = {
    DOMAIN: Deno.env.get("DOMAIN")!,
    ACCESS_TOKEN: Deno.env.get("ACCESS_TOKEN")!,
};