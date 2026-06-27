import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 5173);
const root = fileURLToPath(new URL(".", import.meta.url));

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendFile(response, filePath) {
  const type = contentTypes[extname(filePath)] || "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  createReadStream(filePath).pipe(response);
}

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(root, clean);
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (url.pathname === "/") {
    response.writeHead(302, { Location: "/ai" });
    response.end();
    return;
  }

  if (url.pathname === "/ai" || url.pathname === "/ai/") {
    sendFile(response, join(root, "index.html"));
    return;
  }

  const filePath = safePath(url.pathname);

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && existsSync(filePath)) {
      sendFile(response, filePath);
      return;
    }
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`DevPilot AI page ready at http://localhost:${port}/ai`);
});
