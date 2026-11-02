const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const port = Number(option("--port", process.env.PORT || 3000));
const host = option("--host", process.env.HOST || "127.0.0.1");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error("Port must be an integer between 0 and 65535.");
  process.exit(1);
}

function resolveRequestPath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(urlPath, "http://localhost").pathname);
  } catch {
    return null;
  }

  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const candidates = path.extname(relative) ? [relative] : [relative, `${relative}.html`, path.join(relative, "index.html")];

  for (const candidate of candidates) {
    const absolute = path.resolve(root, candidate);
    if (absolute !== root && absolute.startsWith(`${root}${path.sep}`) && fs.existsSync(absolute)) {
      const stat = fs.statSync(absolute);
      if (stat.isFile()) return { absolute, stat };
    }
  }
  return null;
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  const file = resolveRequestPath(request.url);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : "404 — Documentation page not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(file.absolute)] || "application/octet-stream",
    "Content-Length": file.stat.size,
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = fs.createReadStream(file.absolute);
  stream.on("error", () => response.destroy());
  stream.pipe(response);
});

server.on("error", (error) => {
  const customPort = args.includes("--port") || Boolean(process.env.PORT);
  if (error.code === "EADDRINUSE" && !customPort && port !== 0) {
    console.warn(`Port ${port} is busy; selecting a free port.`);
    server.listen(0, host);
    return;
  }
  console.error(`Unable to start documentation server: ${error.message}`);
  process.exit(1);
});

server.listen(port, host, () => {
  const address = server.address();
  console.log(`GonidonCloud FPU Documentation`);
  console.log(`Local: http://${host}:${address.port}`);
  console.log("Stop: Ctrl+C");
});
