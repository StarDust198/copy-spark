# Copy Spark

An AI marketing copy generator built on the [Vercel AI SDK](https://ai-sdk.dev)
and Anthropic's **Claude** models. Copy Spark turns a short brief about a
product, audience, and tone into ready-to-use marketing copy — headlines, ad
variations, product descriptions, email subject lines, and more.

> **Status:** early development. This is the initial project scaffold — the
> stack and tooling below are in place, but the copy-generation features are
> still being built.

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
[Anthropic API key](https://console.anthropic.com).

```bash
git clone <your-repo-url> copy-spark
cd copy-spark
pnpm install
```

Create your environment files with the following variables:

`.env`

```bash
DATABASE_URL=          # Postgres connection (pooled) — used by the app
DIRECT_URL=            # Postgres connection (direct) — used for migrations
ANTHROPIC_API_KEY=
```

`.env.local`

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ANTHROPIC_API_KEY=
```

Apply the database schema and start the dev server:

```bash
pnpm prisma migrate dev
pnpm dev
```

## Folder structure

- `src`
  - `app` — App Router (route groups for auth and protected pages, plus API
    routes).
  - `components` — `ui` (shadcn on Base UI), plus feature and layout components.
  - `lib` — server actions, the Anthropic REST client, TanStack Query hooks,
    pricing helpers, and Prisma setup.
  - `types`, `schemas`, `constants`, `hooks`, `styles`.
  - `proxy.ts` — Clerk middleware (Next.js 16 renames `middleware` → `proxy`).
- `prisma` — schema and migrations.

## License

[MIT](LICENSE) © Sergey Zhilinsky
