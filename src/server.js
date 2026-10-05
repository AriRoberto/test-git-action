const http = require("node:http");
const { createGreeting } = require("./greeting");

function createServer() {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");

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

    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("Aplicacao de exemplo para praticar GitHub Actions!\n");
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
