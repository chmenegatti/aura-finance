# Deploy na Vercel

Esta monorepo serve dois projetos distintos:

- **Frontend** (Vite/React) no diretório raiz.
- **API** (Express + TypeORM/Drizzle) dentro da pasta `api/`.

## 1. Deploy do frontend (padrão Vercel)

A raiz já contém `package.json` com o script `build` do Vite. O arquivo `vercel.json` no nível superior instrui o Vercel a usar `npm run build` e publicar o diretório `dist`.

Passos principais:
1. No painel do Vercel, crie um projeto apontando para o repositório.
2. No formulário, mantenha o `Root Directory` vazio (padrão). O Vercel detecta `package.json` e usa `npm run build` como comando de build.
3. Entre nas _Environment Variables_ do projeto e defina as variáveis globais esperadas:
   - `VITE_API_URL` (aponta para a URL pública do backend deployado separadamente)
   - `PORT` (opcional)
   - `NODE_ENV=production` (aparece automaticamente)
4. Deploy automático será acionado a cada push.

## 2. Deploy da API (backend)

Como o backend usa Express e precisa falar com o Turso, recomendamos criar um segundo projeto no Vercel apontando para a pasta `api/`.

Configuração sugerida para o projeto `api`:
- **Root Directory**: `api`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev` (opcional)
- **Command de produção**: `npm run start` (Vercel executa automaticamente `npm start` se o `package.json` definir o script). Caso necessário, use `vercel.json` local no diretório `api/` para comandos customizados.

Defina as variáveis de ambiente necessárias:
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `NODE_ENV=production`

Você também precisará aplicar manualmente as migrations no Turso (veja abaixo).

## 3. Migrations e seed em Turso

Como o driver TypeORM rodando no `api/` não conecta diretamente ao Turso, siga este fluxo antes de publicar:

1. Na máquina local (ou CI), execute `npm run typeorm:migration:run` dentro de `api/` usando SQLite. Isso gera os arquivos em `dist/database/migrations`.
2. Extraia os comandos SQL do migration (ou use `sqlite3` para exportar o DDL) e execute contra o Turso usando o CLI:
   ```bash
   turso db execute --database <nome> --file sql/migration.sql
   ```
3. Registre manualmente a entrada na tabela `migrations` do Turso copiando o `timestamp`/`name` do migration.
4. Repita o processo para seeds, se houver.

## 4. Fluxo geral

- Deploy do frontend pode seguir o fluxo automático padrão do Vercel.
- Deploy do backend exige alterações no projeto `api/` e garante que o Turso tenha o schema atualizado.
- No frontend, consuma a API pública (`https://<api-project>.vercel.app/api/...`).

Precisa que eu gere um `README` dentro de `api/` também com esses passos?