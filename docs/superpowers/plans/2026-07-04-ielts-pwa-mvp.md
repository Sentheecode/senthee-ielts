# IELTS PWA MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a deployable, Chinese-first IELTS General Training PWA with a contribution dashboard, adaptive tasks, practice/feedback loop, vocabulary review, and installable mobile experience.

**Architecture:** Use a Next.js App Router frontend with focused feature components and a tested domain layer. The first usable release stores one learner's data locally so it works immediately; a server-only coaching route uses an OpenAI key when configured and returns a transparent deterministic fallback otherwise. Persistence is isolated behind a repository interface so Supabase can replace local storage without changing UI workflows.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, Lucide icons, Vercel.

---

## File map

- `src/app/`: application shell, pages, manifest, service worker registration, coaching API.
- `src/features/dashboard/`: contribution heatmap, four-skill progress and daily diff.
- `src/features/tasks/`: duration-based task picker and completion workflow.
- `src/features/practice/`: listening/reading sample exercises, writing and speaking submissions.
- `src/features/vocabulary/`: personal phrase review.
- `src/features/coach/`: Chinese Agent feedback and weekly review UI.
- `src/lib/domain/`: tested scoring, contribution, scheduling and estimate rules.
- `src/lib/storage/`: repository contract, local implementation and seed data.
- `tests/`: unit/component tests; `e2e/`: mobile and desktop workflows.

### Task 1: Scaffold and quality gates

**Files:** `package.json`, `next.config.ts`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [x] Create a Next.js TypeScript App Router project in the existing repository without overwriting `docs/`.
- [x] Add Vitest, Testing Library, jsdom and Playwright; define `test`, `test:run`, `typecheck` and `e2e` scripts.
- [x] Write `src/app/page.test.tsx` expecting the heading `今天，继续靠近 7 分`.
- [x] Run `npm test -- src/app/page.test.tsx` and verify it fails because the page does not yet render that heading.
- [x] Implement the minimal app shell and heading; rerun the test and verify it passes.
- [x] Commit with `chore: scaffold IELTS learning PWA`.

### Task 2: Learning domain rules

**Files:** `src/lib/domain/types.ts`, `src/lib/domain/contribution.ts`, `src/lib/domain/task-selector.ts`, `src/lib/domain/domain.test.ts`

- [x] Write failing tests proving that passive time earns no points, corrections outweigh basic completion, duplicate attempt IDs do not earn points twice, and the task selector returns the highest-priority task within a 3/10/25/60-minute budget.
- [x] Run `npm test -- src/lib/domain/domain.test.ts` and verify missing exports cause the expected failure.
- [x] Implement typed attempts, tasks and pure `calculateDailyContribution()` / `selectNextTask()` functions.
- [x] Rerun the domain tests and the full test suite; verify all pass.
- [x] Commit with `feat: add tested learning contribution rules`.

### Task 3: Local-first learner repository

**Files:** `src/lib/storage/repository.ts`, `src/lib/storage/local-repository.ts`, `src/lib/storage/seed.ts`, `src/lib/storage/local-repository.test.ts`, `src/providers/learner-provider.tsx`

- [x] Write failing tests for loading seed data once, recording an attempt idempotently, recording a correction, and exporting all learner data as JSON.
- [x] Run the repository test and verify failure because the implementation is absent.
- [x] Implement a `LearnerRepository` contract and browser local-storage adapter, with an in-memory storage object injected for tests.
- [x] Add a client provider that exposes tasks, attempts, vocabulary, estimates and mutation methods.
- [x] Rerun tests and commit with `feat: persist personal learning activity locally`.

### Task 4: Complete primary dashboard concept before UI code

**Files:** `docs/design/ielts-dashboard-concept.png`, `docs/design/design-system.md`

- [x] Generate a complete desktop dashboard concept matching the approved contribution heatmap, daily diff, four-skill path and Chinese-first copy.
- [x] Generate a matching iPhone 16 Pro portrait concept for the same primary workflow.
- [x] Inspect both concept images and write exact palette, typography, spacing, component, icon and responsive rules to `docs/design/design-system.md`.
- [x] Commit with `docs: define IELTS dashboard visual system`.

### Task 5: Dashboard and task workflow

**Files:** `src/components/app-shell.tsx`, `src/features/dashboard/*.tsx`, `src/features/tasks/*.tsx`, `src/app/page.tsx`, relevant component tests

- [x] Write failing component tests for changing the time budget, selecting a fitting task, completing it, and seeing the contribution total and daily diff update.
- [x] Run those tests and verify they fail for missing UI behavior.
- [x] Implement the desktop and mobile app shell, heatmap, skill progress, today summary, task budget selector and completion drawer from the accepted concepts.
- [x] Rerun tests and commit with `feat: build adaptive dashboard and task flow`.

### Task 6: Practice, vocabulary and Agent coach

**Files:** `src/app/practice/page.tsx`, `src/app/vocabulary/page.tsx`, `src/app/coach/page.tsx`, `src/app/api/coach/route.ts`, `src/features/practice/*.tsx`, `src/features/vocabulary/*.tsx`, `src/features/coach/*.tsx`, relevant tests

- [x] Write failing tests for answering a reading question, submitting a writing paragraph, saving feedback, correcting an answer, and reviewing a phrase.
- [x] Run tests and verify expected behavioral failures.
- [x] Implement a clearly sourced official-sample starter exercise plus AI-original practice labels, writing input, browser audio recording where available, vocabulary review and Chinese feedback.
- [x] Implement `/api/coach` with server-side `OPENAI_API_KEY` support and a labeled offline fallback; validate request and response structures.
- [x] Rerun tests and commit with `feat: add practice vocabulary and agent coaching`.

### Task 7: PWA and resilient mobile behavior

**Files:** `src/app/manifest.ts`, `public/sw.js`, `public/icons/*`, `src/components/pwa-register.tsx`, `next.config.ts`, relevant tests

- [x] Write a failing manifest test requiring standalone display, Chinese name, theme colors and 192/512 icons.
- [x] Implement the manifest, generated icons, service worker registration, offline app-shell caching and install guidance.
- [x] Verify touch targets, safe-area insets, recording fallback, draft preservation and no horizontal overflow at 393×852.
- [x] Commit with `feat: make IELTS dashboard installable as a PWA`.

### Task 8: Full verification and deployment

**Files:** `e2e/core-flow.spec.ts`, `README.md`, `.env.example`, Vault project records

- [x] Add Playwright tests covering: open dashboard → choose 10 minutes → complete task → inspect daily diff → submit practice → view Agent feedback → export data.
- [x] Run unit tests, typecheck, lint, production build and E2E; fix every failure.
- [x] Start the production server and verify desktop plus iPhone 16 Pro viewport in the in-app browser.
- [x] Capture implementation screenshots and inspect them beside both accepted concepts; fix copy, hierarchy, spacing, palette, responsive and interaction mismatches.
- [x] Update README with local run, optional AI key, PWA install and Vercel deployment instructions.
- [x] Update the Obsidian decision, issue and daily overview records with final state and remaining limits.
- [x] Deploy to Vercel; if authentication is required, open the login page for the user and resume after login.
- [x] Commit with `release: ship usable IELTS learning PWA`.

