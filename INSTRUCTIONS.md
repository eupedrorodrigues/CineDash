# CineDash

CineDash é uma SPA (Single Page Application) de catálogo de filmes construída com React e TypeScript. Consome a API pública do TMDB (The Movie Database) para exibir filmes populares, permitir buscas com filtros avançados e manter uma watchlist pessoal persistida no navegador.

## Funcionalidades

- **Dashboard** — listagem infinita de filmes populares com scroll automático
- **Busca e filtros** — pesquisa por título, gênero, ano de lançamento e nota mínima
- **Detalhe do filme** — sinopse, elenco, diretor, duração e trailer via YouTube
- **Watchlist** — adicionar/remover filmes, listagem em tabela com persistência local
- **Tema** — alternância entre modo escuro e claro, persistido entre sessões
- **Autenticação simulada** — login com e-mail e senha, sessão com expiração de 24 h

---

## Pré-requisitos

- **Node.js** >= 18
- **pnpm** >= 9 (`npm install -g pnpm`)
- Conta na [TMDB](https://www.themoviedb.org/) para obter as credenciais de API

---

## Configuração do ambiente

### 1. Obter credenciais TMDB

1. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crie uma aplicação do tipo **Developer**
3. Anote a **API Key (v3 auth)** e o **API Read Access Token (v4 auth — Bearer token)**

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite `.env`:

```env
VITE_API_URL=/api
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_API_KEY=sua_api_key_aqui
VITE_TMDB_ACCESS_TOKEN=seu_bearer_token_aqui
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_TMDB_BACKDROP_BASE_URL=https://image.tmdb.org/t/p/w1280
VITE_YOUTUBE_EMBED_BASE_URL=https://www.youtube.com/embed
VITE_POSTER_FALLBACK_URL=
```

> `VITE_TMDB_ACCESS_TOKEN` é o Bearer token (começa com `eyJ...`). É ele que autentica as chamadas ao proxy Vite em desenvolvimento.

---

## Instalação e execução

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento (inclui proxy TMDB)
pnpm dev
```

Acesse [http://localhost:5173](http://localhost:5173).

### Login

O sistema de autenticação é simulado localmente — não há backend. Use qualquer e-mail válido e uma senha com 6 ou mais caracteres:

```
Email: usuario@exemplo.com
Senha: minhasenha123
```

A sessão expira após 1 hora e é persistida no `localStorage`.

---

## Outros comandos

```bash
# Build de produção
pnpm build

# Pré-visualizar build de produção
pnpm preview

# Executar testes unitários (single run)
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Lint
pnpm lint
```

---

## Estrutura resumida

```
src/
├── modules/       # Domínios: auth, dashboard, movie, watchlist
├── components/    # Componentes genéricos e primitivos UI (shadcn)
├── services/      # Chamadas à API TMDB e autenticação simulada
├── routes/        # File-based routing (TanStack Router)
├── store/         # Estado global com Zustand
└── hooks/         # Hooks utilitários reutilizáveis
```

Para detalhes sobre decisões técnicas, consulte [ARCHITECTURE.md](./ARCHITECTURE.md).
