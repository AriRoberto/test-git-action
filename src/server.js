const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createGreeting } = require("./greeting");

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

function createServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");

    if (requestUrl.pathname === "/") {
      response.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'",
        "x-content-type-options": "nosniff",
      });
      response.end(homePage);
      return;
    }

    if (requestUrl.pathname === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (requestUrl.pathname === "/greet") {
      response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      response.end(createGreeting(requestUrl.searchParams.get("name")));
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Rota nao encontrada.\n");
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const server = createServer();

  server.listen(port, () => {
    console.log(`Servidor disponivel em http://localhost:${port}`);
  });
}

module.exports = { createServer };
