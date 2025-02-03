// api.test.ts
import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {createApp} from "https://deno.land/x/oak/mod.ts";
import router from "../src/route/routes.ts";

Deno.test("GET /api/v1/users should return a list of users", async () => {
    const app = createApp();
    app.use(router.routes());
    app.use(router.allowedMethods());

    const response = await fetch("http://localhost:8000/api/v1/users");
    const users = await response.json();

    assertEquals(response.status, 200);
    assertEquals(users.length, 2);
});