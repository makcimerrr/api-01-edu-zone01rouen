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

// Route pour servir le fichier index.html et style.css
app.use(async (ctx: { request: { url: { pathname: string; }; }; }, next: () => any) => {
    if (ctx.request.url.pathname === "/") {
        await send(ctx, "index.html", {root: "./src/public"});
    } else if (ctx.request.url.pathname === "/style.css") {
        await send(ctx, "style.css", {root: "./src/public"});
    } else {
        await next();
    }
});

// Documentation Nextra (build statique dans docs/out)
app.use(async (ctx, next) => {
    const { pathname } = ctx.request.url;
    if (!pathname.startsWith("/docs")) return next();

    let rel = pathname.replace(/^\/docs\/?/, "") || "index.html";
    // trailingSlash: true → /docs/foo/ doit servir foo/index.html
    if (rel.endsWith("/")) rel += "index.html";
    if (!/\.[a-zA-Z0-9]+$/.test(rel)) rel += "/index.html";

    try {
        await send(ctx, rel, { root: "./docs/out" });
    } catch {
        await send(ctx, "404.html", { root: "./docs/out" });
    }
});

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Server running on http://localhost:8000");
await app.listen({port: 8000});