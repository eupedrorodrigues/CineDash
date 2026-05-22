# Architecture

## Stack

| Camada | Tecnologia | Motivação |
|---|---|---|
| Framework UI | React 19 + Vite 8 | Ecossistema maduro, HMR rápido, suporte a RSC no horizonte |
| Linguagem | TypeScript 6 | Segurança de tipos end-to-end entre camada de serviço e UI |
| Roteamento | TanStack Router | Type-safe por padrão; `beforeLoad` possibilita guards de rota sem boilerplate |
| Fetch / Cache | TanStack Query | Gerenciamento de cache, infinite scroll e deduplicação sem estado manual |
| Estado global | Zustand + persist | Superfície mínima de API; middleware `persist` grava no `localStorage` automaticamente |
| Formulários | React Hook Form + Zod | Validação declarativa; erros tipados sem re-renders desnecessários |
| Estilos | Tailwind CSS v4 | CSS-first config, purge automático, compatível com shadcn/ui |
| Componentes | shadcn/ui (Radix UI) | Acessibilidade pronta; componentes não empacotados — vivem no repositório |
| HTTP | Axios | Interceptors e timeout configuráveis de forma central |
| Notificações | Sonner | Toast leve, integrado ao QueryCache global |
| Testes | Vitest + Testing Library | API idêntica ao Jest; roda no mesmo processo do Vite |

---

## Estrutura de pastas

```
src/
├── components/        # Componentes verdadeiramente genéricos (Header, MovieCard, skeletons)
│   └── ui/            # Primitivos shadcn/ui gerados (Button, Input, etc.)
├── constants/         # Literais e mapas estáticos (gêneros TMDB, mensagens de erro)
├── hooks/             # Hooks reutilizáveis sem domínio (useDebounce, useIntersectionObserver)
├── lib/               # Instâncias singleton (axios, QueryClient)
├── modules/           # Domínios verticais — cada módulo é autossuficiente
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── page/
│   │   └── store/
│   ├── dashboard/
│   │   ├── hooks/
│   │   └── page/
│   ├── movie/
│   │   ├── hooks/
│   │   └── page/
│   └── watchlist/
│       ├── components/
│       ├── page/
│       └── store/
├── routes/            # Arquivo-rota do TanStack Router (file-based routing)
├── services/          # Funções puras de I/O (auth.ts, movie.ts)
├── store/             # Stores globais sem domínio (themeStore)
├── types/             # Interfaces e tipos TypeScript compartilhados
└── utils/             # Funções puras utilitárias (validateToken)
```

### Princípio orientador

A separação `modules/` vs `components/` segue a regra: se o código conhece um domínio de negócio (autenticação, filmes, watchlist), entra em `modules/`; se é agnóstico ao domínio, entra em `components/` ou `hooks/`. Isso evita que componentes de UI acumulem lógica de negócio e facilita testar cada camada isoladamente.

`services/` contém apenas funções puras de I/O — sem hooks, sem estado. Os hooks em `modules/*/hooks/` são o único lugar que conecta serviços ao React Query.

---

## Autenticação sem backend

O projeto não possui servidor próprio. A autenticação é simulada em `src/services/auth.ts`:

1. **Login simulado** — `authLogin` valida presença de e-mail e senha com mais de 6 caracteres, introduz um delay de 800 ms para simular latência de rede, e retorna um token gerado localmente via `btoa(email + ":" + Date.now())`.

2. **Token com TTL** — `src/utils/auth.ts` decodifica o token com `atob` e valida que o timestamp embutido não ultrapassa 1 hora. Tokens expirados causam logout automático.

3. **Persistência** — O store Zustand usa o middleware `persist`, gravando `{ token, isAuthenticated }` na chave `cinedash-auth` do `localStorage`. A sessão sobrevive a recarregamentos de página sem chamada de rede.

4. **Guard de rota** — O layout `_authenticated.tsx` usa o `beforeLoad` do TanStack Router. Antes de qualquer renderização, lê o estado do store via `useAuthStore.getState()` (fora do React, acesso síncrono), valida o token e redireciona para `/login` se inválido. Isso evita flashes de conteúdo autenticado.

```
Login page → authLogin() → token (btoa) → useAuthStore.login()
                                                    ↓
                                          localStorage (persist)
                                                    ↓
                    _authenticated.tsx beforeLoad → validateToken() → rota liberada ou /login
```

A abordagem é intencional para uma SPA de demonstração: sem servidor, sem cookies `HttpOnly`, sem refresh tokens. Em produção, substituir `authLogin` por uma chamada real e armazenar apenas o token JWT retornado pelo backend.

---

## Desafios com a API do TMDB

### 1. CORS em desenvolvimento

A TMDB API não permite chamadas diretas de `localhost` no browser — a resposta é bloqueada por CORS. A solução foi um plugin Vite customizado em `plugins/tmdb-proxy.ts` que adiciona um middleware ao servidor de desenvolvimento:

- Todas as requisições para `/api/*` são interceptadas pelo servidor Vite (Node.js), que as repassa para `https://api.themoviedb.org/3` com o cabeçalho `Authorization` intacto.
- A resposta retorna ao browser como se viesse de mesma origem.
- `VITE_API_URL=/api` aponta o Axios para o proxy local em dev; em produção bastaria apontar para um proxy real ou usar a TMDB diretamente de um servidor.

### 2. Sem endpoint de busca com filtros combinados

A TMDB não possui um único endpoint que aceite query de texto + filtros (gênero, ano, rating) simultaneamente. A solução foi uma lógica de roteamento em `src/services/movie.ts`:

| Condição | Endpoint usado |
|---|---|
| `query` preenchido | `/search/movie` |
| Filtros sem query | `/discover/movie` |
| Nenhum filtro ativo | `/movie/popular` |

Isso significa que busca por texto e filtros são mutuamente exclusivos na camada de serviço — a UI deixa isso explícito ao desabilitar filtros quando há texto digitado.

### 3. Infinite scroll e reset de estado

O `useInfiniteQuery` acumula páginas em memória. Quando o usuário muda um filtro, o `queryKey` muda (`["movies", "filtered", params]`) e o cache é invalidado automaticamente — sem necessidade de reset manual. O componente de sentinel (observado pelo `IntersectionObserver`) usa `rootMargin: "200px"` para disparar o carregamento antecipado antes de atingir o fim da lista.

### 4. Mapeamento do modelo TMDB para modelo interno

A TMDB retorna `genre_ids` (array de IDs) no endpoint de listagem, mas `genres` (array de objetos) no endpoint de detalhe. Os mappers em `src/constants/movie.ts` normalizam ambos para o modelo `Movie`/`MovieDetail` da aplicação, desacoplando a UI do formato externo.
