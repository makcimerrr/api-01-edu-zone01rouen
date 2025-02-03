// api.test.ts
import {assert, assertEquals} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {Application} from "https://deno.land/x/oak/mod.ts";
import router from "../src/route/route.ts";

Deno.test("GET /api/v1/users should return a list of users", async () => {
    const app = new Application();
    app.use(router.routes());
    app.use(router.allowedMethods());

    const response = await fetch("http://localhost:8000/api/v1/users");
    const responseBody = await response.json();

    assertEquals(response.status, 200);
    assert(Array.isArray(responseBody.data.user));  // Vérifie que c'est bien un tableau
    assert(responseBody.data.user.length > 0);  // Vérifie que le tableau n'est pas vide
});