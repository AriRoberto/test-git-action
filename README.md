# Demo de GitHub Actions e DevSecOps

Aplicacao HTTP pequena para praticar um pipeline de CI no GitHub Actions. Ela nao usa dependencias de terceiros, entao e simples de executar e de entender.

## Executar localmente

Requer Node.js 20 ou superior.

```bash
npm ci
npm run check
npm test
npm start
```

Abra `http://localhost:3000` para ver a mensagem da aplicacao ou `http://localhost:3000/health` para consultar o endpoint de saude.

## O que o workflow faz

O arquivo `.github/workflows/ci.yml` executa automaticamente em cada `push` e `pull_request`:

1. Baixa o codigo e configura o Node.js.
2. Instala exatamente as dependencias descritas no lockfile.
3. Verifica a sintaxe e executa os testes.
4. Executa `npm audit` para procurar vulnerabilidades conhecidas nas dependencias.

Se alguma etapa falhar, a execucao do workflow fica vermelha na aba **Actions** do GitHub.

## Publicar no GitHub para acompanhar a pratica

Crie um repositorio vazio no GitHub e, nesta pasta, execute os comandos abaixo substituindo a URL pela do seu repositorio:

```bash
git init
git add .
git commit -m "Adiciona demo de GitHub Actions"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Depois, abra a aba **Actions** do repositorio e acompanhe o workflow **CI**. Para praticar pull requests, crie uma branch, faca uma pequena alteracao, envie-a e abra um PR contra `main`.
# test-git-action
