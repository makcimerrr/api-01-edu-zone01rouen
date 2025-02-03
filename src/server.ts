// server.ts
import {Application} from "../deps.ts";
import router from "./route/route.ts";

const app = new Application();

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Server running on http://localhost:8000");
await app.listen({port: 8000});