// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {sql} from "drizzle-orm";
import {db} from "../../db/client.ts";
import {API_VERSION} from "../../../config/config.ts";

const startedAt = Date.now();

type DependencyStatus = {
    status: "ok" | "down";
    latencyMs?: number;
    error?: string;
};

async function ping(label: string, fn: () => Promise<unknown>): Promise<DependencyStatus> {
    const t0 = performance.now();
    try {
        await fn();
        return {status: "ok", latencyMs: Math.round(performance.now() - t0)};
    } catch (err) {
        return {
            status: "down",
            latencyMs: Math.round(performance.now() - t0),
            error: err instanceof Error ? err.message : String(err),
        };
    }
}

export const getHealthHandler = async (ctx: RouterContext) => {
    const [database, gitea] = await Promise.all([
        ping("postgres", () => db.execute(sql`SELECT 1`)),
        ping("gitea", async () => {
            const r = await fetch(
                "https://zone01normandie.org/git/api/v1/version",
                {signal: AbortSignal.timeout(2000)}
            );
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            await r.text();
        }),
    ]);

    const overall: "ok" | "degraded" =
        database.status === "ok" ? "ok" : "degraded";

    ctx.response.status = overall === "ok" ? 200 : 503;
    ctx.response.body = {
        status: overall,
        version: API_VERSION,
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
        timestamp: new Date().toISOString(),
        dependencies: {database, gitea},
    };
};
