# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds all Next.js App Router entries. Pages live under feature folders (`app/login`, `app/dashboard`), while API routes sit inside `app/api`. Reusable UI goes in `app/components`. Keep new feature directories colocated with their route or component.
- `app/generated/prisma/` stores the generated Prisma client. Do not edit these files directly; regenerate them after schema changes.
- `prisma/schema.prisma` defines the data model, while `prisma/migrations/` tracks migrations and `prisma/dev.db` provides the SQLite development database.
- `public/` contains static assets served verbatim. Favor SVGs and prefix new files with the feature name (e.g., `dashboard-empty.svg`).

## Build, Test, and Development Commands
- `npm install` retrieves dependencies. Run it after pulling schema or config updates.
- `npm run dev` starts the dev server with Turbopack at `http://localhost:3000`.
- `npm run build` produces an optimized production build; use before deployment reviews.
- `npm run start` runs the production bundle locally for smoke tests.
- `npm run lint` checks TypeScript, React, and accessibility rules via the configured ESLint profile.
- `npx prisma migrate dev` applies schema changes and refreshes the generated client; follow with `npx prisma generate` if migrations are skipped.

## Coding Style & Naming Conventions
- Use TypeScript with strict typing; prefer explicit interfaces for shared props.
- Observe 2-space indentation, trailing commas, and double quotes to align with the existing ESLint setup.
- Name React components with PascalCase (`UserCard`), hooks with `use` prefixes, and API route files using kebab-case segments under `app/api`.
- Keep server-side logic in route handlers or `prisma/` helpers; avoid database calls in client components.

## Testing Guidelines
- Linting is the enforced quality gate today. Run `npm run lint` before opening a pull request.
- When adding automated tests, place component specs in `app/**/__tests__` and integration flows in `tests/e2e/`. Mirror the route or component path.
- For Prisma changes, include a snapshot of the resulting migration SQL and verify seeding scripts against `dev.db`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`). Localized descriptions are welcome; keep the summary under 72 characters.
- Reference related issues in the body and note database or config changes explicitly.
- Pull request descriptions should cover scope, screenshots for UI updates, migration or seed impacts, and manual verification steps.
