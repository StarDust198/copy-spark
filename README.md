# Copy Spark

An AI marketing copy generator built on the [Vercel AI SDK](https://ai-sdk.dev).
Copy Spark turns a short brief about a product, audience, and tone into
ready-to-use marketing copy, streamed variant by variant.

Models are addressed as plain `provider/model` strings and routed through the
[Vercel AI Gateway](https://vercel.com/docs/ai-gateway) — Google, OpenAI,
Anthropic, Mistral, and Amazon models are selectable per generation (see
`src/constants/model.ts`).

## Features

- Three templates: Facebook / Instagram ad, email subject lines, product
  description (`src/constants/templates.ts`).
- Structured streaming — each generation returns a title plus an array of
  typed variants, validated with Zod on both ends.
- Pick a favorite variant, rename, edit the brief and regenerate, or stop a
  run mid-stream.
- Generation history persisted per Clerk user, with status tracking
  (`PENDING` / `STREAMING` / `COMPLETED` / `ERROR`).
- Light/dark theme.

## Stack

Versions are pinned intentionally — this is **not** the Next.js you may know from
older docs (App Router with breaking changes).

- [Next.js](https://nextjs.org) 16.2.4 — App Router
- [React](https://react.dev) 19.2.4
- [AI SDK](https://ai-sdk.dev) (`ai`) 7 · `@ai-sdk/react` 4 · `@ai-sdk/anthropic` 4
- [TanStack Query](https://tanstack.com/query) 5 — client data fetching
- [Prisma](https://www.prisma.io) 7 with `@prisma/adapter-pg` + `pg` — Postgres
- [Clerk](https://clerk.com) 7 — authentication
- [Tailwind CSS](https://tailwindcss.com) 4
- [shadcn/ui](https://ui.shadcn.com) 4 on [Base UI](https://base-ui.com) (`@base-ui/react`)
- [Zod](https://zod.dev) 4
- [TypeScript](https://www.typescriptlang.org) 5

## Getting Started

**Prerequisites:** Node.js, [pnpm](https://pnpm.io), a Postgres database, a
[Clerk](https://clerk.com) application, and an
[AI Gateway API key](https://vercel.com/docs/ai-gateway).

```bash
git clone <your-repo-url> copy-spark
cd copy-spark
pnpm install
```

Create your environment files with the following variables. The database URLs
live in `.env` because `prisma.config.ts` loads only that file via `dotenv`;
everything else is read by Next.js from `.env.local`.

`.env`

```bash
DATABASE_URL=          # Postgres connection (pooled) — used by the app
DIRECT_URL=            # Postgres connection (direct) — used for migrations
```

`.env.local`

```bash
AI_GATEWAY_API_KEY=    # not needed if you run `vercel env pull` / deploy on
                       # Vercel — OIDC auth is used instead
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Apply the database schema and start the dev server:

```bash
pnpm prisma migrate dev
pnpm dev
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Folder structure

- `src`
  - `app` — App Router: `(public)` (sign-in/sign-up), `(private)` (dashboard,
    generation history, new generation), and `api/generate/[templateId]`.
  - `components` — `ui` (shadcn on Base UI), plus `generation`, `forms`,
    `fields`, `layout`, `themes`, and `ai-elements`.
  - `lib` — server actions (`actions`), Prisma queries (`db`), prompt builders
    (`prompts.ts`), TanStack Query options and hooks (`query`), and the Prisma
    client (`prisma.ts`).
  - `schemas`, `constants`, `hooks`, `styles`.
  - `proxy.ts` — Clerk middleware (Next.js 16 renames `middleware` → `proxy`).
- `prisma` — schema and migrations. `Generation.input` / `Generation.output`
  are `Json` columns rather than per-template tables — a deliberate v1 choice,
  since every template has a different shape.

## License

MIT © Sergey Zhilinsky
