# Preact Hacker News Port — Design Spec

## Overview

Port `view-models-react-hackernews` to Preact using native Preact APIs (no compat layer where possible), `@view-models/preact`, and `@nano-router/preact`.

## Source Reference

`/Users/ssimonsen/Code/view-models-react-hackernews/` — the React implementation to port.

## Architecture

Identical layered architecture:

```
HackerNewsApi (fetch layer)
    ↓
ViewModels (state management via @view-models/core)
    ↓
Hooks (bridge via @view-models/preact + preact/hooks)
    ↓
Components (preact + @nano-router/preact)
```

## What Stays Identical

These files copy directly with zero changes:

- `src/api/HackerNewsApi.ts` — pure TypeScript HTTP client
- `src/state/HackerNewsModel.ts` — root model with Maps for caching
- `src/state/TopStoriesViewModel.ts` — paginated story list
- `src/state/StoryViewModel.ts` — single story with lazy load
- `src/state/CommentViewModel.ts` — single comment with lazy load
- `src/state/*.spec.ts` — all view model tests
- `src/types/Story.ts`, `src/types/Comment.ts` — interfaces
- `src/utils/toError.ts`, `src/utils/time.ts` — utilities
- `src/styles/global.css` — all styling
- `src/components/routes.ts` — route definitions (uses @nano-router/router directly)
- `index.html` — Vite entry HTML

## What Changes

### Import Swap Rules

In React, hooks and utilities come from a single `"react"` import. In Preact, these must be split across modules:

| Source | Preact Module |
|---|---|
| `createContext` | `preact` |
| `FunctionComponent`, `ComponentChildren`, `JSX` (types) | `preact` |
| `useContext`, `useMemo`, `useEffect`, `useRef`, `useCallback` | `preact/hooks` |
| `memo`, `forwardRef` | `preact/compat` |
| `useModelState` | `@view-models/preact` (was `@view-models/react`) |
| `Router`, `useRouteName`, `useParams`, `useLink`, `useRouter` | `@nano-router/preact` (was `@nano-router/react`) |
| `render`, `screen`, `fireEvent`, `waitFor`, `act` (tests) | `@testing-library/preact` (was `@testing-library/react`) |

**Key import splitting rule:** A single `import { memo, useEffect, useRef } from "react"` must become two imports: `import { memo } from "preact/compat"` and `import { useEffect, useRef } from "preact/hooks"`.

### Type Replacements

| React Type | Preact Type |
|---|---|
| `ReactNode` | `ComponentChildren` from `preact` |
| `SVGProps<SVGSVGElement>` | `JSX.SVGAttributes<SVGSVGElement>` from `preact` |

### Files Requiring Changes

**Entry point:**
- `src/main.tsx` — `render` from `preact` instead of `createRoot`. Drop `StrictMode` (not available in native Preact).

**Context:**
- `src/context/HackerNewsContext.ts` — `createContext` from `preact` instead of `react`

**Hooks:**
- `src/hooks/useTopStories.ts` — `useContext` from `preact/hooks`, `useModelState` from `@view-models/preact`
- `src/hooks/useStory.ts` — same swaps
- `src/hooks/useComment.ts` — same swaps

**Components (all `.tsx` files in `src/components/`):**
- Route components (`App.tsx`, `RootRoute.tsx`, `StoriesRoute.tsx`, `CommentRoute.tsx`) — swap `@nano-router/react` → `@nano-router/preact`, hooks from `preact/hooks`
- Story components (`Story.tsx`, `StoryLayout.tsx`, `StoryLink.tsx`, `StoryByline.tsx`, etc.) — swap React imports per rules above
- Comment components (`Comment.tsx`, `CommentAndAnswers.tsx`, `Answers.tsx`, etc.)
- Navigation components (`TopBar.tsx`, `BackButton.tsx`, `LinkButton.tsx`, `HomeLink.tsx`, etc.)
- Utility components (`Html.tsx`, `Skeleton.tsx`, `icons.tsx`)
- `StoryLayout.tsx` uses `forwardRef` from `preact/compat`
- `icons.tsx` uses `JSX.SVGAttributes<SVGSVGElement>` instead of `SVGProps`
- `.displayName` on `memo()`-wrapped components works with `preact/compat`

**Component tests (all `.spec.tsx` files in `src/components/`):**
- `@testing-library/react` → `@testing-library/preact`
- `@nano-router/react` → `@nano-router/preact` (in tests that import Router)
- React type imports → Preact equivalents

**Test setup:**
- `src/test/setup.ts` — `@testing-library/react` → `@testing-library/preact`

**Config:**
- `src/vite-env.d.ts` — keep for Vite type declarations

## Dependencies

### Runtime
- `preact`: `^10.0.0`
- `@view-models/core`: `^6.0.0`
- `@view-models/preact`: `^1.1.0`
- `@nano-router/history`: `^4.0.4`
- `@nano-router/preact`: `^4.2.0` (latest available version for the Preact variant)

### Dev
- `vite`
- `@preact/preset-vite`
- `typescript`
- `vitest`
- `@testing-library/preact`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `jsdom`

## Build Config

### `vite.config.ts`
- Use `@preact/preset-vite` instead of `@vitejs/plugin-react`
- Preserve test configuration: `globals: true`, `environment: "jsdom"`, `setupFiles: "./src/test/setup.ts"`

### `tsconfig.json`
- Keep `"jsx": "react-jsx"`
- **Add** `"jsxImportSource": "preact"` — this is a new field that must be added so the JSX transform imports from Preact instead of React
- Same strict mode, ES2020 target

## File Structure

```
index.html
src/
├── api/HackerNewsApi.ts
├── components/          (all .tsx + .spec.tsx files, ported imports)
├── context/HackerNewsContext.ts
├── hooks/useTopStories.ts, useStory.ts, useComment.ts
├── state/               (unchanged .ts + .spec.ts)
├── test/setup.ts        (ported import)
├── types/               (unchanged)
├── utils/               (unchanged)
├── styles/global.css    (unchanged)
├── vite-env.d.ts
└── main.tsx             (preact render)
```

## Success Criteria

1. All view model tests pass
2. All component tests pass
3. App runs in browser with same UX as React version
4. Minimal `preact/compat` usage — only `memo` and `forwardRef`
