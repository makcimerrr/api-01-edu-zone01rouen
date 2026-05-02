// server.ts
// @ts-ignore
import {oakCors} from "https://deno.land/x/cors/mod.ts";
import {Application, send} from "../deps.ts";
import router from "./route/route.ts";

const app = new Application();

// Enable CORS for the specified origin
app.use(oakCors({
    origin: ["https://admin-dashboard-blue-one.vercel.app", "http://localhost:3000"]
}));

// Redirige la racine vers la documentation Nextra
app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === "/") {
        ctx.response.redirect("/docs/");
        return;
    }
    await next();
});

// Documentation Nextra (build statique dans docs/out)
app.use(async (ctx, next) => {
    const { pathname } = ctx.request.url;
    if (!pathname.startsWith("/docs")) return next();

    let rel = pathname.replace(/^\/docs\/?/, "") || "index.html";
    if (rel.endsWith("/")) rel += "index.html";
    if (!/\.[a-zA-Z0-9]+$/.test(rel)) rel += "/index.html";

    try {
        await send(ctx, rel, { root: "./docs/out" });
        return;
    } catch {
        // fall through
    }

    try {
        await send(ctx, "404.html", { root: "./docs/out" });
    } catch {
        ctx.response.status = 503;
        ctx.response.type = "text/plain; charset=utf-8";
        ctx.response.body =
            "Documentation indisponible : le build Nextra (docs/out) est manquant.\n" +
            "Lancer `cd docs && npm ci && npm run build` avant de démarrer le serveur.";
    }
});

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Server running on http://localhost:8000");
await app.listen({port: 8000});