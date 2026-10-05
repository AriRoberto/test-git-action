const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createServer } = require("../src/server");

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET /health retorna status ok em JSON", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("GET / retorna uma mensagem da aplicacao", async () => {
  const response = await fetch(baseUrl);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /GitHub Actions/);
});

test("GET /greet personaliza a saudacao com o nome informado", async () => {
  const response = await fetch(`${baseUrl}/greet?name=Ari`);

  assert.equal(response.status, 200);
  assert.equal(
    await response.text(),
    "Ola, Ari! Bem-vindo a aplicacao de exemplo.",
  );
});

test("GET /greet usa visitante quando o nome nao e informado", async () => {
  const response = await fetch(`${baseUrl}/greet`);

  assert.equal(
    await response.text(),
    "Ola, visitante! Bem-vindo a aplicacao de exemplo.",
  );
});
