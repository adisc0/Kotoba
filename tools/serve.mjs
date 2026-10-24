import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};
http
  .createServer(async (request, response) => {
    const requested = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      root,
      "." + (requested.endsWith("/") ? requested + "index.html" : requested),
    );
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    try {
      const content = await fs.readFile(file);
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("Kotoba: http://127.0.0.1:4173"),
  );
