import { serveDir } from "jsr:@std/http/file-server";

const PORT = Number(Deno.env.get("PORT") ?? 8000);

Deno.serve({ port: PORT }, (req) =>
  serveDir(req, {
    fsRoot: "out",
    showIndex: true,
    quiet: true,
  })
);
