# Preact Hacker News Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the React Hacker News demo to Preact using `@view-models/preact` and `@nano-router/preact`.

**Architecture:** Copy the React version's layered architecture (API → ViewModels → Hooks → Components) with import swaps from React to native Preact modules. View models and business logic are framework-agnostic and copy unchanged.

**Tech Stack:** Preact 10, @view-models/core ^6.0.0, @view-models/preact ^1.1.0, @nano-router/preact ^4.2.0, Vite, TypeScript, Vitest, @testing-library/preact

**Reference project:** `/Users/ssimonsen/Code/view-models-react-hackernews/`

---

### Task 1: Project scaffolding and config

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/vite-env.d.ts`
- Create: `src/test/setup.ts`
- Copy: `src/images/y18.gif` (binary asset from reference project)

- [ ] **Step 1: Create `.gitignore`**

```
node_modules
dist
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "view-models-preact-hackernews",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@nano-router/history": "^4.0.4",
    "@nano-router/preact": "^4.2.0",
    "@view-models/core": "^6.0.0",
    "@view-models/preact": "^1.1.0",
    "preact": "^10.0.0"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.9.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/preact": "^3.2.4",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.3",
    "vite": "^6.0.11",
    "vitest": "^3.1.2"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

- [ ] **Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hacker News</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.gif" {
  const src: string;
  export default src;
}
```

- [ ] **Step 7: Create `src/test/setup.ts`**

```typescript
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/preact";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 8: Copy image asset**

```bash
mkdir -p src/images
cp /Users/ssimonsen/Code/view-models-react-hackernews/src/images/y18.gif src/images/y18.gif
```

- [ ] **Step 9: Install dependencies**

```bash
npm install
```

- [ ] **Step 10: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.json vite.config.ts index.html src/vite-env.d.ts src/test/setup.ts src/images/y18.gif
git commit -m "feat: scaffold project with Preact, Vite, and test config"
```

---

### Task 2: Copy framework-agnostic layers (types, API, utils, styles)

**Files:**
- Create: `src/types/Story.ts` (copy unchanged)
- Create: `src/types/Comment.ts` (copy unchanged)
- Create: `src/api/HackerNewsApi.ts` (copy unchanged)
- Create: `src/utils/toError.ts` (copy unchanged)
- Create: `src/utils/time.ts` (copy unchanged)
- Create: `src/styles/global.css` (copy unchanged)

- [ ] **Step 1: Copy type definitions**

`src/types/Story.ts`:
```typescript
export interface Story {
  id: string;
  title: string;
  score: number;
  by: string;
  time: number;
  url: string;
  descendants: number;
  comments: string[];
}
```

`src/types/Comment.ts`:
```typescript
export interface Comment {
  id: string;
  text: string;
  by: string;
  time: number;
  parentId: string;
  answers: string[];
}
```

- [ ] **Step 2: Copy API layer**

`src/api/HackerNewsApi.ts` — copy unchanged from reference project. Contains `IHackerNewsApi` interface and `HackerNewsApi` class.

- [ ] **Step 3: Copy utilities**

`src/utils/toError.ts`:
```typescript
export const toError = (err: unknown): Error =>
  err instanceof Error ? err : new Error(String(err));
```

`src/utils/time.ts`:
```typescript
const relativeTimeFormat = new Intl.RelativeTimeFormat();

export const formatRelativeHours = (timestamp: number): string => {
  const seconds = timestamp - Date.now() / 1000;
  const hours = seconds / 60 / 60;
  return relativeTimeFormat.format(Math.round(hours), "hours");
};
```

- [ ] **Step 4: Copy styles**

`src/styles/global.css` — copy unchanged from reference project (326 lines).

- [ ] **Step 5: Commit**

```bash
git add src/types src/api src/utils src/styles
git commit -m "feat: add types, API, utilities, and styles (unchanged from React)"
```

---

### Task 3: Copy view models and their tests

**Files:**
- Create: `src/state/TopStoriesViewModel.ts` (copy unchanged)
- Create: `src/state/StoryViewModel.ts` (copy unchanged)
- Create: `src/state/CommentViewModel.ts` (copy unchanged)
- Create: `src/state/HackerNewsModel.ts` (copy unchanged)
- Create: `src/state/TopStoriesViewModel.spec.ts` (copy unchanged)
- Create: `src/state/StoryViewModel.spec.ts` (copy unchanged)
- Create: `src/state/CommentViewModel.spec.ts` (copy unchanged)
- Create: `src/state/HackerNewsModel.spec.ts` (copy unchanged)

- [ ] **Step 1: Copy all view model files unchanged from reference**

These files import only from `@view-models/core` and local modules — no React imports. Copy all 4 `.ts` files and 4 `.spec.ts` files from `/Users/ssimonsen/Code/view-models-react-hackernews/src/state/` to `src/state/`.

- [ ] **Step 2: Run view model tests to verify they pass**

```bash
npx vitest run src/state/
```

Expected: All 4 test suites pass (HackerNewsModel, TopStoriesViewModel, StoryViewModel, CommentViewModel).

- [ ] **Step 3: Commit**

```bash
git add src/state
git commit -m "feat: add view models and tests (unchanged from React)"
```

---

### Task 4: Port hooks and context to Preact

**Files:**
- Create: `src/context/HackerNewsContext.ts` (port: `createContext` from `preact`)
- Create: `src/hooks/useTopStories.ts` (port: hooks from `preact/hooks`, `useModelState` from `@view-models/preact`)
- Create: `src/hooks/useStory.ts` (port: same swaps)
- Create: `src/hooks/useComment.ts` (port: same swaps)

- [ ] **Step 1: Create context**

`src/context/HackerNewsContext.ts`:
```typescript
import { createContext } from "preact";
import { HackerNewsModel } from "../state/HackerNewsModel";
import { HackerNewsApi } from "../api/HackerNewsApi";

export const HackerNewsContext = createContext(
  new HackerNewsModel(new HackerNewsApi()),
);
```

- [ ] **Step 2: Create hooks**

`src/hooks/useTopStories.ts`:
```typescript
import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useTopStories = () => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.topStories;
  const state = useModelState(model);
  return { ...state, reload: model.reload, loadMore: model.loadMore };
};
```

`src/hooks/useStory.ts`:
```typescript
import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useStory = (id: string) => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.getStory(id);
  return useModelState(model);
};
```

`src/hooks/useComment.ts`:
```typescript
import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useComment = (id: string) => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.getComment(id);
  return useModelState(model);
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors (may have errors for missing components — that's OK at this stage, just verify the hooks and context compile).

- [ ] **Step 4: Commit**

```bash
git add src/context src/hooks
git commit -m "feat: port hooks and context to Preact"
```

---

### Task 5: Port utility components (no router deps)

**Files:**
- Create: `src/components/Html.tsx`
- Create: `src/components/Skeleton.tsx`
- Create: `src/components/icons.tsx`

- [ ] **Step 1: Create utility components**

`src/components/Html.tsx`:
```typescript
import { memo } from "preact/compat";

interface HtmlProps {
  html: string;
}

export const Html = memo(({ html }: HtmlProps) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
});

Html.displayName = "Html";
```

`src/components/Skeleton.tsx`:
```typescript
import { memo } from "preact/compat";
import { useMemo } from "preact/hooks";

export const Skeleton = memo(() => {
  const width = useMemo(() => `${Math.random() * 100 + 500}px`, []);

  return <div className="skeleton" style={{ width }} />;
});

Skeleton.displayName = "Skeleton";
```

`src/components/icons.tsx`:
```typescript
import { memo } from "preact/compat";
import type { JSX } from "preact";

export const ReloadIcon = memo((props: JSX.SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      focusable="false"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        d="M13.1 12c-1.2 1.5-3 2.5-5.1 2.5-3.6 0-6.5-2.9-6.5-6.5S4.4 1.5 8 1.5c2.2 0 4.1 1.1 5.3 2.7m.2-3.7V4c0 .3-.2.5-.5.5H9.5"
      />
    </svg>
  );
});

ReloadIcon.displayName = "ReloadIcon";
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Html.tsx src/components/Skeleton.tsx src/components/icons.tsx
git commit -m "feat: port utility components to Preact"
```

---

### Task 6: Port route definitions and layout components

**Files:**
- Create: `src/components/routes.ts` (copy unchanged — uses @nano-router/router directly)
- Create: `src/components/StoryLayout.tsx` (port: `forwardRef`, `memo` from `preact/compat`, `ComponentChildren` from `preact`)
- Create: `src/components/StoryLink.tsx` (port: `memo` from `preact/compat`)
- Create: `src/components/StoryByline.tsx` (port: `memo` from `preact/compat`)
- Create: `src/components/CommentsLink.tsx` (port: `memo` from `preact/compat`)

- [ ] **Step 1: Copy routes**

`src/components/routes.ts` — copy unchanged from reference. Uses `@nano-router/router` (not react-specific).

- [ ] **Step 2: Create StoryLayout**

`src/components/StoryLayout.tsx`:
```typescript
import { memo, forwardRef } from "preact/compat";
import type { ComponentChildren } from "preact";
import { Skeleton } from "./Skeleton";

interface StoryTitleProps {
  children: ComponentChildren;
}

export const StoryTitle = memo(({ children }: StoryTitleProps) => {
  return <div className="story-title">{children}</div>;
});

StoryTitle.displayName = "StoryTitle";

interface StoryCardProps {
  children: ComponentChildren;
}

export const StoryCard = memo(
  forwardRef<HTMLLIElement, StoryCardProps>(({ children }, ref) => {
    return (
      <li className="story-card" ref={ref}>
        {children}
      </li>
    );
  }),
);

StoryCard.displayName = "StoryCard";

export const StoryPlaceholder = memo(() => {
  return (
    <StoryCard>
      <StoryTitle>
        <Skeleton />
      </StoryTitle>
      <div>
        <Skeleton />
      </div>
    </StoryCard>
  );
});

StoryPlaceholder.displayName = "StoryPlaceholder";
```

- [ ] **Step 3: Create StoryLink, StoryByline, and CommentsLink**

Note: CommentsLink is created here because StoryByline depends on it.

`src/components/StoryLink.tsx`:
```typescript
import { memo } from "preact/compat";
import type { Story } from "../types/Story";

interface StoryLinkProps {
  story: Story;
}

export const StoryLink = memo(({ story }: StoryLinkProps) => {
  return (
    <a
      href={story.url}
      title={story.title}
      className="story-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {story.title}
    </a>
  );
});

StoryLink.displayName = "StoryLink";
```

`src/components/StoryByline.tsx`:
```typescript
import { memo } from "preact/compat";
import type { Story } from "../types/Story";
import { formatRelativeHours } from "../utils/time";
import { CommentsLink } from "./CommentsLink";

interface StoryBylineProps {
  story: Story;
  showCommentLink: boolean;
}

export const StoryByline = memo(
  ({ story, showCommentLink }: StoryBylineProps) => {
    return (
      <div className="story-byline">
        <span>
          {story.score} points by {story.by}
        </span>
        <span>{formatRelativeHours(story.time)}</span>
        {showCommentLink && <CommentsLink story={story} />}
      </div>
    );
  },
);

StoryByline.displayName = "StoryByline";
```

`src/components/CommentsLink.tsx`:
```typescript
import { memo } from "preact/compat";
import type { Story } from "../types/Story";
import { LinkButton } from "./LinkButton";

interface CommentsLinkProps {
  story: Story;
}

export const CommentsLink = memo(({ story }: CommentsLinkProps) => {
  if (story.descendants <= 0) {
    return null;
  }

  return (
    <LinkButton route="story" params={{ id: story.id }}>
      {story.descendants} comments
    </LinkButton>
  );
});

CommentsLink.displayName = "CommentsLink";
```

Note: CommentsLink depends on LinkButton (Task 7), but StoryByline depends on CommentsLink. These will compile together once Task 7 is complete. The commit for Task 6 includes CommentsLink so that Task 7 doesn't need to create it.

- [ ] **Step 4: Commit**

```bash
git add src/components/routes.ts src/components/StoryLayout.tsx src/components/StoryLink.tsx src/components/StoryByline.tsx src/components/CommentsLink.tsx
git commit -m "feat: port route definitions and story layout components"
```

---

### Task 7: Port navigation and link components

**Files:**
- Create: `src/components/LinkButton.tsx` (port: `@nano-router/preact`, `ComponentChildren`)
- Create: `src/components/CommentAndAnswersLink.tsx` (port: `memo` from `preact/compat`)
- Create: `src/components/HomeLink.tsx` (port: `@nano-router/preact`)
- Create: `src/components/BackButton.tsx` (port: `useCallback` from `preact/hooks`, `@nano-router/preact`)
- Create: `src/components/LoadMore.tsx` (port: `memo` from `preact/compat`)
- Create: `src/components/ReloadButton.tsx` (port: `memo` from `preact/compat`)

Note: `CommentsLink.tsx` was already created in Task 6 (dependency of StoryByline).

- [ ] **Step 1: Create LinkButton**

`src/components/LinkButton.tsx`:
```typescript
import { memo } from "preact/compat";
import type { ComponentChildren } from "preact";
import { useLink } from "@nano-router/preact";

interface LinkButtonProps {
  children: ComponentChildren;
  route: string;
  params?: Record<string, string>;
}

export const LinkButton = memo(({ children, route, params }: LinkButtonProps) => {
  const linkProps = useLink({ route, params });

  return (
    <a className="link-button" {...linkProps}>
      {children}
    </a>
  );
});

LinkButton.displayName = "LinkButton";
```

- [ ] **Step 2: Create CommentAndAnswersLink**

`src/components/CommentAndAnswersLink.tsx`:
```typescript
import { memo } from "preact/compat";
import type { Comment } from "../types/Comment";
import { LinkButton } from "./LinkButton";

interface CommentAndAnswersLinkProps {
  comment: Comment;
}

export const CommentAndAnswersLink = memo(
  ({ comment }: CommentAndAnswersLinkProps) => {
    if (comment.answers.length === 0) {
      return null;
    }

    return (
      <LinkButton route="comment" params={{ id: comment.id }}>
        {comment.answers.length} answers
      </LinkButton>
    );
  },
);

CommentAndAnswersLink.displayName = "CommentAndAnswersLink";
```

- [ ] **Step 3: Create HomeLink, BackButton, LoadMore, ReloadButton**

`src/components/HomeLink.tsx`:
```typescript
import { memo } from "preact/compat";
import { useLink } from "@nano-router/preact";
import logo from "../images/y18.gif";

export const HomeLink = memo(() => {
  const linkProps = useLink({ route: "home" });

  return (
    <a className="home-link" {...linkProps}>
      <img src={logo} className="home-link-logo" alt="Hacker News logo" />
      <span className="home-link-brand">Hacker News</span>
    </a>
  );
});

HomeLink.displayName = "HomeLink";
```

`src/components/BackButton.tsx`:
```typescript
import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";
import { useRouter } from "@nano-router/preact";

export const BackButton = memo(() => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button className="back-button" onClick={handleClick}>
      X
    </button>
  );
});

BackButton.displayName = "BackButton";
```

`src/components/LoadMore.tsx`:
```typescript
import { memo } from "preact/compat";
import { useTopStories } from "../hooks/useTopStories";

export const LoadMore = memo(() => {
  const { hasMore, loadMore } = useTopStories();

  if (!hasMore) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button onClick={loadMore} className="load-more-button">
        Load more
      </button>
    </div>
  );
});

LoadMore.displayName = "LoadMore";
```

`src/components/ReloadButton.tsx`:
```typescript
import { memo } from "preact/compat";
import { ReloadIcon } from "./icons";
import { useTopStories } from "../hooks/useTopStories";

export const ReloadButton = memo(() => {
  const { loading, reload } = useTopStories();

  const iconClassName = loading
    ? "reload-icon reload-icon-loading"
    : "reload-icon";

  return (
    <button onClick={reload} className="reload-button" title="refresh">
      <ReloadIcon className={iconClassName} />
    </button>
  );
});

ReloadButton.displayName = "ReloadButton";
```

- [ ] **Step 4: Commit**

```bash
git add src/components/LinkButton.tsx src/components/CommentAndAnswersLink.tsx src/components/HomeLink.tsx src/components/BackButton.tsx src/components/LoadMore.tsx src/components/ReloadButton.tsx
git commit -m "feat: port navigation and link components"
```

---

### Task 8: Port page-level components and entry point

**Files:**
- Create: `src/components/TopBar.tsx`
- Create: `src/components/DefaultLayout.tsx`
- Create: `src/components/Stories.tsx`
- Create: `src/components/Story.tsx`
- Create: `src/components/Details.tsx`
- Create: `src/components/Comment.tsx`
- Create: `src/components/Answers.tsx`
- Create: `src/components/CommentAndAnswers.tsx`
- Create: `src/components/StoriesRoute.tsx`
- Create: `src/components/CommentRoute.tsx`
- Create: `src/components/RootRoute.tsx`
- Create: `src/components/App.tsx`
- Create: `src/main.tsx`

- [ ] **Step 1: Create TopBar and DefaultLayout**

`src/components/TopBar.tsx`:
```typescript
import { memo } from "preact/compat";
import { HomeLink } from "./HomeLink";
import { ReloadButton } from "./ReloadButton";
import { useRouteName } from "@nano-router/preact";

export const TopBar = memo(() => {
  const route = useRouteName();

  return (
    <header>
      <HomeLink />
      {route === "home" && <ReloadButton />}
    </header>
  );
});

TopBar.displayName = "TopBar";
```

`src/components/DefaultLayout.tsx`:
```typescript
import { memo } from "preact/compat";
import type { ComponentChildren } from "preact";
import { TopBar } from "./TopBar";

type Props = {
  children: ComponentChildren;
};

export const DefaultLayout = memo(({ children }: Props) => {
  return (
    <main>
      <TopBar />
      <section className="content">{children}</section>
    </main>
  );
});
```

- [ ] **Step 2: Create story page components**

`src/components/Stories.tsx`:
```typescript
import { memo } from "preact/compat";
import { Story } from "./Story";
import { LoadMore } from "./LoadMore";
import { useTopStories } from "../hooks/useTopStories";

export const Stories = memo(() => {
  const { shownTopStoryIds } = useTopStories();

  return (
    <div className="stories-container">
      <ol className="stories-list">
        {shownTopStoryIds.map((id) => (
          <Story key={id} id={id} />
        ))}
      </ol>
      <LoadMore />
    </div>
  );
});

Stories.displayName = "Stories";
```

`src/components/Story.tsx`:
```typescript
import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { StoryCard, StoryTitle, StoryPlaceholder } from "./StoryLayout";
import { StoryLink } from "./StoryLink";
import { StoryByline } from "./StoryByline";
import { useParams } from "@nano-router/preact";
import { Details } from "./Details";
import { useStory } from "../hooks/useStory";

type Props = {
  id: string;
};

export const Story = memo(({ id }: Props) => {
  const { id: expandedId } = useParams();
  const ref = useRef<HTMLLIElement>(null);
  const { story } = useStory(id);
  const isExpanded = id === expandedId;

  useEffect(() => {
    if (story && ref.current && isExpanded) {
      ref.current.scrollIntoView(true);
      document.documentElement.scrollBy(0, -45);
    }
  }, [isExpanded, story]);

  if (!story) {
    return <StoryPlaceholder />;
  }

  return (
    <StoryCard ref={ref}>
      <StoryTitle>
        <StoryLink story={story} />
      </StoryTitle>
      <StoryByline story={story} showCommentLink={!isExpanded} />
      {isExpanded && <Details commentIds={story.comments} />}
    </StoryCard>
  );
});
```

`src/components/Details.tsx`:
```typescript
import { memo } from "preact/compat";
import { BackButton } from "./BackButton";
import { Comment } from "./Comment";

type Props = {
  commentIds: string[];
};

export const Details = memo(({ commentIds }: Props) => {
  return (
    <div className="details">
      <ul className="comments-list">
        {commentIds.map((id) => (
          <Comment key={id} id={id} showAnswersLink />
        ))}
      </ul>
      <BackButton />
    </div>
  );
});

Details.displayName = "Details";
```

- [ ] **Step 3: Create comment page components**

`src/components/Comment.tsx`:
```typescript
import { memo } from "preact/compat";
import { Skeleton } from "./Skeleton";
import { Html } from "./Html";
import { formatRelativeHours } from "../utils/time";
import { CommentAndAnswersLink } from "./CommentAndAnswersLink";
import { useComment } from "../hooks/useComment";

type Props = {
  showAnswersLink?: boolean;
  id: string;
};

export const Comment = memo(({ id, showAnswersLink }: Props) => {
  const { comment } = useComment(id);

  if (!comment) {
    return (
      <li className="comment">
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
      </li>
    );
  }

  return (
    <li className="comment">
      <div>
        <Html html={comment.text} />
      </div>
      <div className="comment-byline">
        <span>by {comment.by}</span>
        <span>{formatRelativeHours(comment.time)}</span>
        {showAnswersLink && <CommentAndAnswersLink comment={comment} />}
      </div>
    </li>
  );
});

Comment.displayName = "Comment";
```

`src/components/Answers.tsx`:
```typescript
import { memo } from "preact/compat";
import { Comment } from "./Comment";
import { useComment } from "../hooks/useComment";

type Props = {
  commentId: string;
};

export const Answers = memo(({ commentId }: Props) => {
  const { comment } = useComment(commentId);

  if (comment?.answers.length === 0) return null;

  return (
    <ul className="comments-list">
      {comment?.answers.map((id) => (
        <Comment key={id} id={id} showAnswersLink />
      ))}
    </ul>
  );
});

Answers.displayName = "Answers";
```

`src/components/CommentAndAnswers.tsx`:
```typescript
import { memo } from "preact/compat";
import { Comment } from "./Comment";
import { Answers } from "./Answers";
import { BackButton } from "./BackButton";

type Props = {
  id: string;
};

export const CommentAndAnswers = memo(({ id }: Props) => {
  return (
    <div className="comment-and-answers-container">
      <div className="comment-and-answers-item">
        <Comment id={id} />
        <div className="comment-and-answers-answers">
          <Answers commentId={id} />
        </div>
        <BackButton />
      </div>
    </div>
  );
});

CommentAndAnswers.displayName = "CommentAndAnswers";
```

- [ ] **Step 4: Create route components and App**

`src/components/StoriesRoute.tsx`:
```typescript
import { DefaultLayout } from "./DefaultLayout";
import { Stories } from "./Stories";

export const StoriesRoute = () => {
  return (
    <DefaultLayout>
      <Stories />
    </DefaultLayout>
  );
};
```

`src/components/CommentRoute.tsx`:
```typescript
import { DefaultLayout } from "./DefaultLayout";
import { CommentAndAnswers } from "./CommentAndAnswers";
import { useParams } from "@nano-router/preact";

export const CommentRoute = () => {
  const { id } = useParams();

  return (
    <DefaultLayout>
      <CommentAndAnswers id={id} />
    </DefaultLayout>
  );
};
```

`src/components/RootRoute.tsx`:
```typescript
import { useRouteName } from "@nano-router/preact";
import { StoriesRoute } from "./StoriesRoute";
import { CommentRoute } from "./CommentRoute";

export const RootRoute = () => {
  const route = useRouteName();

  switch (route) {
    case "comment":
      return <CommentRoute />;
    default:
      return <StoriesRoute />;
  }
};
```

`src/components/App.tsx`:
```typescript
import { useMemo } from "preact/hooks";
import { Router } from "@nano-router/preact";
import { createBrowserHistory } from "@nano-router/history";
import { RootRoute } from "./RootRoute";
import { routes } from "./routes";

export const App = () => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router history={history} routes={routes}>
      <RootRoute />
    </Router>
  );
};
```

- [ ] **Step 5: Create entry point**

`src/main.tsx`:
```typescript
import { render } from "preact";
import { App } from "./components/App";
import "./styles/global.css";

render(<App />, document.getElementById("app")!);
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Verify dev server starts**

```bash
npx vite --open
```

Expected: App loads in browser, shows Hacker News stories.

- [ ] **Step 8: Commit**

```bash
git add src/components src/main.tsx
git commit -m "feat: port all components, routes, and entry point to Preact"
```

---

### Task 9: Port component tests

**Files:**
- Create: All `src/components/*.spec.tsx` files (port: swap `@testing-library/react` → `@testing-library/preact`, `@nano-router/react` → `@nano-router/preact`)

The component tests follow one pattern: import from `@testing-library/react` and `@nano-router/react`, wrap in `<HackerNewsContext.Provider>` and `<Router>`. The port is mechanical import swaps.

- [ ] **Step 1: Copy all `.spec.tsx` files from reference project**

```bash
for f in /Users/ssimonsen/Code/view-models-react-hackernews/src/components/*.spec.tsx; do
  cp "$f" src/components/
done
```

- [ ] **Step 2: Replace `@testing-library/react` with `@testing-library/preact` in all spec files**

In every `src/components/*.spec.tsx` file, replace:
- `from "@testing-library/react"` → `from "@testing-library/preact"`
- `from "@nano-router/react"` → `from "@nano-router/preact"`

No other changes needed — the test APIs (`render`, `screen`, `waitFor`, `fireEvent`) are the same.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: All test suites pass (state tests + component tests).

- [ ] **Step 4: Commit**

```bash
git add src/components/*.spec.tsx
git commit -m "feat: port component tests to @testing-library/preact"
```

---

### Task 10: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Expected: App works in browser, matching React version behavior.

- [ ] **Step 4: Final commit (if any remaining changes)**

```bash
git status
```

If clean, done. Otherwise commit any remaining files.
