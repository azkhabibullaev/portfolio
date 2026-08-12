# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this project is

A personal portfolio site (`azkhabibullaev/portfolio`), built as a client-side
React single-page app with Vite.

**Current state: this is still the unmodified Vite `react-ts` starter scaffold.**
The single commit in history is `feat: initial commit`, and `src/App.tsx` is the
stock template landing page — hero logos, a `Count is {n}` button, and link cards
pointing at vite.dev / react.dev / the Vite community. None of that content is
portfolio content yet.

Practical consequence: when asked to build portfolio features (about section,
projects list, contact, resume link, routing), treat the template markup in
`src/App.tsx` and its styles in `src/App.css` as **placeholder to be replaced**,
not as an established design to preserve. The design tokens in `src/index.css`
are worth keeping — see "Styling conventions" below.

## Stack

| Concern    | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | React 19 (`StrictMode`, function components, hooks) |
| Build tool | Vite 8 (`@vitejs/plugin-react`, Oxc-based)          |
| Language   | TypeScript 6, strict bundler mode, `noEmit`         |
| Styling    | Plain CSS with custom properties — no CSS framework |
| Linting    | ESLint 10 flat config + typescript-eslint           |
| Package mgr| **pnpm** (`pnpm-lock.yaml` is the committed lockfile) |
| Tests      | None configured                                     |

There is no router, no state library, no CSS-in-JS, no component library, and no
test runner. Do not assume any of these exist; if a task needs one, add it
deliberately and mention the new dependency.

## Commands

Use pnpm. The repo has a `pnpm-lock.yaml` and no `package-lock.json`; running
`npm install` would create a competing lockfile.

```bash
pnpm install        # install dependencies
pnpm dev            # Vite dev server with HMR (default http://localhost:5173)
pnpm build          # tsc -b (typecheck) && vite build  -> dist/
pnpm lint           # eslint .
pnpm preview        # serve the built dist/ locally
```

Verification loop before committing: **`pnpm lint && pnpm build`**. Both pass
clean on the current tree, so any failure is from the change at hand. `pnpm build`
is also the only typechecker — `tsc -b` runs as its first half, so a build failure
is often a type error, not a bundling error.

There are no tests to run. Do not invent a `pnpm test` script; if a change really
warrants tests, propose adding Vitest rather than silently wiring one up.

## Layout

```
index.html            Vite entry HTML; mounts #root, loads /src/main.tsx
src/
  main.tsx            createRoot + StrictMode; imports ./index.css
  App.tsx             root component (currently the starter page)
  index.css           design tokens, resets, element-level base styles
  App.css             component/section styles for App.tsx
  assets/             images imported by TS (hero.png, react.svg, vite.svg)
public/               copied verbatim to dist root, referenced by absolute URL
  favicon.svg         referenced from index.html
  icons.svg           SVG sprite of <symbol> icons
vite.config.ts        Vite config (react plugin only)
tsconfig.json         solution file; references the two configs below
tsconfig.app.json     covers src/, DOM libs, jsx: react-jsx
tsconfig.node.json    covers vite.config.ts, node types
eslint.config.js      flat config, ignores dist/
```

`README.md` is still the stock Vite template readme (it documents the template's
optional type-aware-lint upgrade, not this project). Don't treat it as a source of
truth about this codebase; it's a reasonable file to replace once the portfolio
has real content.

### Assets: `src/assets/` vs `public/`

Two different mechanisms, and the distinction matters:

- **`src/assets/`** — `import heroImg from './assets/hero.png'`. Vite hashes the
  filename and inlines/copies it; the import gives you the final URL. Use this for
  images the components own.
- **`public/`** — served and copied at the path you write, no hashing. Referenced
  by literal absolute path, e.g. `<use href="/icons.svg#github-icon">` in
  `App.tsx`. Use this for the favicon and the icon sprite. Never `import` from
  `public/`.

Icons come from the `public/icons.svg` sprite via
`<svg><use href="/icons.svg#some-icon" /></svg>`. Add a new `<symbol id="...">`
to that file rather than pasting raw inline SVG paths into components, and keep
decorative icons marked `role="presentation" aria-hidden="true"` as the existing
ones are.

## Styling conventions

All styling is hand-written CSS using modern native features — **no preprocessor**,
so nested rules like `&:hover { ... }` and nested `@media` blocks in `App.css` /
`index.css` are native CSS nesting, not Sass. Keep them; don't "fix" them by
flattening or by adding a preprocessor.

`src/index.css` holds the theme layer and is the part worth carrying forward as the
portfolio grows:

- Design tokens on `:root` — `--text`, `--text-h`, `--bg`, `--border`,
  `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`,
  `--shadow`, plus `--sans` / `--heading` / `--mono` font stacks.
- A full dark-mode override of those tokens under
  `@media (prefers-color-scheme: dark)`, with `color-scheme: light dark` on `:root`.
- Base element styles (`h1`, `h2`, `p`, `code`) and the `#root` container
  (1126px max width, centered, `min-height: 100svh`, flex column).

Rules for new styles:

1. **Use the tokens, never hardcode colors.** A literal hex in a new rule breaks
   dark mode. If a genuinely new color is needed, add a token to `:root` *and* its
   dark-mode counterpart in the same change.
2. The responsive breakpoint throughout is `@media (max-width: 1024px)`. Match it
   instead of introducing new breakpoints.
3. Element-level and token changes go in `index.css`; component and section styles
   go alongside the component (today, `App.css`).
4. Interactive elements carry a visible `:focus-visible` outline (see `.counter`).
   Preserve that on anything clickable.

## Code conventions

Follow what's already in the files:

- **No semicolons**, single quotes, 2-space indent, trailing commas in multiline
  literals. There is no Prettier config — match the surrounding file by hand.
- Function components with `export default` at the bottom of the file
  (`export default App`), not `export default function`.
- `.tsx` for anything with JSX; `.ts` for plain modules.
- Import order as seen in `App.tsx`: React → asset imports → CSS last.
- Prefer explicit `type` on `<button type="button">` — the existing button does.

TypeScript is strict in ways that bite at build time, not in the editor's default
config: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (so use
`import type { Foo } from './x'` for type-only imports), and `erasableSyntaxOnly`
(so **no enums, no parameter properties, no namespaces** — they won't compile).
`allowImportingTsExtensions` is on, and `main.tsx` writes `import App from
'./App.tsx'` with the extension; keep that style consistent within a file's
neighbors.

ESLint runs `js.configs.recommended`, `tseslint.configs.recommended`,
`react-hooks` recommended, and `react-refresh/vite`. The react-refresh rule means
**a module that exports a component should export only that component** — putting
a helper constant or hook next to a component in the same file will warn. Put
shared helpers in their own module.

Type-aware lint rules are *not* enabled (the stock README describes how to turn
them on). Don't assume rules like `no-floating-promises` are catching anything.

## Git workflow

- Default branch is `main`; work happens on feature branches.
- Commit messages follow Conventional Commits — the existing history is
  `feat: initial commit`. Use `feat:`, `fix:`, `chore:`, `docs:`, `style:`,
  `refactor:` accordingly.
- Only commit when asked. Never push to `main` directly.
- `dist/`, `node_modules/`, and `*.local` are gitignored; never commit build output.
- `pnpm-lock.yaml` **is** committed — include it in the diff whenever dependencies
  change.

## Gotchas

- `pnpm dev` gives no type errors on screen. Vite transpiles without typechecking,
  so run `pnpm build` to see what `tsc` thinks.
- `StrictMode` in `main.tsx` double-invokes effects and renders in development.
  Effects that "run twice" locally are expected behavior, not a bug to patch.
- Anything referenced by absolute path (`/icons.svg`) must live in `public/`, or it
  will 404 in the production build while appearing to work in dev only if the path
  happens to resolve.
- Adding a dependency requires `pnpm add`, and the lockfile change must be
  committed alongside it or CI-style clean installs will drift.
