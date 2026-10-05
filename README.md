# Tutorial: configurando GitHub Actions

Este tutorial usa a aplicacao de exemplo deste repositorio para configurar e acompanhar um workflow de CI (integracao continua) diretamente no GitHub. O workflow verifica a sintaxe, executa os testes e audita as dependencias automaticamente.

## 1. Confira a aplicacao localmente

Requer Node.js 20 ou superior. Na pasta do projeto, execute:

```bash
npm ci
npm run check
npm test
npm start
```

Abra `http://localhost:3000` para ver a aplicacao, `http://localhost:3000/health` para consultar o endpoint de saude ou `http://localhost:3000/greet?name=Ari` para receber uma saudacao personalizada. Os testes e a verificacao de sintaxe tambem serao executados pelo GitHub Actions.

## 2. Crie um repositorio no GitHub

1. Entre em [github.com](https://github.com/) e clique em **New repository** (ou no sinal **+** e depois **New repository**).
2. Escolha um nome, por exemplo `demo-github-actions`.
3. Selecione **Public** ou **Private**, conforme sua preferencia.
4. Como o projeto ja existe nesta pasta, deixe desmarcadas as opcoes para criar README, `.gitignore` ou licenca. Isso evita conflitos no primeiro envio.
5. Clique em **Create repository**. Mantenha aberta a pagina com a URL do repositorio.

## 3. Envie o projeto para o GitHub

Abra um terminal na pasta do projeto e execute os comandos abaixo. Troque a URL pela URL HTTPS exibida na pagina do repositorio:

```bash
git init
git add .
git commit -m "Adiciona demo de GitHub Actions"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Se o Git informar que `origin` ja existe, confira o endereco com `git remote -v` e, se necessario, atualize-o com:

```bash
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

O GitHub pode solicitar que voce autentique sua conta durante o `git push`.

## 4. Confira o arquivo do workflow

O workflow ja esta preparado no projeto em `.github/workflows/ci.yml`. O GitHub procura arquivos YAML dentro de `.github/workflows/` e os executa conforme os eventos configurados.

Neste exemplo:

- `on.push` inicia o workflow quando voce envia commits.
- `on.pull_request` inicia o workflow quando um pull request e aberto ou atualizado.
- `jobs.test` define um trabalho executado em uma maquina Linux hospedada pelo GitHub.
- `steps` sao as etapas: obter o codigo, configurar Node.js, instalar dependencias, verificar sintaxe, testar e auditar.
- `permissions: contents: read` concede ao workflow apenas permissao de leitura do conteudo do repositorio.

O workflow usa `npm ci`, que instala as dependencias registradas no `package-lock.json`. Mesmo sem dependencias externas neste exemplo, o lockfile permite que o comando funcione de forma reproduzivel.

## 5. Acompanhe a primeira execucao

1. Na pagina do repositorio, abra a aba **Actions**.
2. Se aparecer uma tela de boas-vindas, escolha a opcao para configurar workflows voce mesmo ou retorne ao repositorio: o arquivo YAML ja foi enviado junto com o codigo.
3. Se o GitHub pedir para habilitar Actions, habilite-os para o repositorio.
4. Abra a execucao chamada **CI** iniciada pelo evento `push`.
5. Clique no trabalho **Testes e auditoria de dependencias** e expanda as etapas para ver os comandos e seus resultados.

Uma marca verde indica sucesso; uma marca vermelha indica que uma etapa falhou. Abra a etapa vermelha para ler a mensagem de erro, corrija o problema localmente e envie outro commit.

## 6. Faca uma alteracao para praticar

Edite, por exemplo, o texto retornado pela aplicacao em `src/server.js`. Depois, envie a alteracao:

```bash
git add src/server.js
git commit -m "Atualiza mensagem da aplicacao"
git push
```

Volte a **Actions** e confirme que uma nova execucao foi iniciada automaticamente pelo `push`.

## 7. Pratique com um pull request

Um pull request (PR) permite propor e revisar alteracoes antes de integra-las na branch principal.

```bash
git switch -c minha-alteracao
```

Faca uma mudanca, salve-a e envie a branch:

```bash
git add .
git commit -m "Faz uma alteracao de pratica"
git push -u origin minha-alteracao
```

No GitHub, clique em **Compare & pull request** (ou abra **Pull requests** e depois **New pull request**), escolha `main` como destino e crie o PR. O evento `pull_request` executara o mesmo workflow. Confira o resultado na aba **Actions** ou na secao de verificacoes do PR.

Para praticar a protecao da branch, nas configuracoes do repositorio procure **Branches** ou **Rulesets** e configure uma regra para `main` exigindo que o trabalho **Testes e auditoria de dependencias** passe antes do merge. Os nomes e a localizacao dessas opcoes podem variar conforme a interface e o plano do GitHub.

## 8. O que fazer quando uma execucao falhar

1. Abra **Actions** e selecione a execucao com falha.
2. Abra o trabalho e expanda a etapa vermelha.
3. Leia o comando que falhou e a mensagem exibida.
4. Reproduza localmente, por exemplo com `npm test`, `npm run check` ou `npm audit --audit-level=high`.
5. Corrija, faca commit e envie a mudanca. O GitHub executara o workflow novamente.

## Seguranca basica

- Mantenha as permissoes do workflow no minimo necessario; este exemplo so precisa de `contents: read`.
- Nao coloque senhas, tokens ou chaves diretamente no arquivo YAML ou no codigo.
- Se um workflow futuro precisar de credenciais, armazene-as em **Settings > Secrets and variables > Actions** e acesse-as como secrets, dando apenas as permissoes necessarias.
- Revise as actions de terceiros e prefira versoes confiaveis e atualizadas.

## Rodar localmente

Os comandos usados pelo workflow tambem podem ser executados na sua maquina:

```bash
npm ci
npm run check
npm test
npm audit --audit-level=high
```

O GitHub Actions executa esses mesmos passos em uma maquina hospedada, sem depender do seu computador estar ligado.

## Executar com Docker

Com o Docker instalado e em execucao, crie a imagem na pasta do projeto:

```bash
docker build -t demo-github-actions .
```

Inicie o container e publique a porta 3000 da aplicacao na mesma porta da sua maquina:

```bash
docker run --rm -p 3000:3000 demo-github-actions
```

Acesse `http://localhost:3000`, `http://localhost:3000/health` ou `http://localhost:3000/greet?name=Ari`. Para parar o container, pressione `Ctrl+C`.

O Dockerfile usa Node.js 24 Alpine, instala apenas dependencias de producao e executa o processo como o usuario sem privilegios `node`.
