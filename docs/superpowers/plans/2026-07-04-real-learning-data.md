# Real Learning Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the IELTS PWA start as Senthee's empty, real learning log rather than a demo dashboard.

**Architecture:** Keep the production backend on Vercel via Next.js API routes and keep learning records in browser `localStorage` for tonight's usable MVP. Replace fixed contribution display data with calculations from recorded attempts, and let dashboard, practice, and vocabulary pages write to the same local repository.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Vitest, Testing Library, Playwright, Vercel.

---

### Task 1: Domain data calculations

**Files:**
- Modify: `src/lib/domain/learning.ts`
- Test: `src/lib/domain/domain.test.ts`

- [x] Add tests for daily aggregation, today's points, and real streak calculation.
- [x] Implement pure functions that deduplicate attempts by id and group points by local ISO date.
- [x] Verify domain tests pass.

### Task 2: Local repository starts as Senthee's fresh real log

**Files:**
- Modify: `src/lib/storage/seed.ts`
- Modify: `src/lib/storage/local-repository.ts`
- Test: `src/lib/storage/local-repository.test.ts`

- [x] Add tests that a fresh repository starts with profile name `Senthee`, no attempts, and no completed tasks.
- [x] Bump the storage key to a fresh version so the deployed app starts cleanly.
- [x] Keep starter tasks and vocabulary content, but treat them as prompts/resources rather than fake progress.

### Task 3: Dashboard uses only real records

**Files:**
- Modify: `src/features/dashboard/dashboard.tsx`
- Modify: `src/features/dashboard/contribution-grid.tsx`
- Test: `src/features/dashboard/dashboard.test.tsx`

- [x] Add tests that the dashboard greets Senthee, shows zero streak/points on first run, and updates after a real action.
- [x] Remove the fixed contribution heatmap pattern and fixed 12-day streak.
- [x] Show today's attempts in the diff from real records only.

### Task 4: Practice and vocabulary actions write real attempts

**Files:**
- Modify: `src/features/practice/practice-hub.tsx`
- Modify: `src/features/practice/practice-hub.test.tsx`
- Modify: `src/features/vocabulary/vocabulary-review.tsx`
- Modify: `src/features/vocabulary/vocabulary-review.test.tsx`

- [x] Add injectable repository props for tests and production local storage.
- [x] Record reading answer checks, writing submissions, and vocabulary reviews as real attempts.
- [x] Keep UI usable if recording fails by preserving visible feedback.

### Task 5: Documentation, verification, deployment

**Files:**
- Modify: `README.md`
- Modify: Obsidian project notes

- [x] Document that Supabase is not required for tonight; Vercel hosts the backend API; learning data is local until multi-device sync is added.
- [x] Run tests, typecheck, lint, build, and E2E.
- [x] Deploy to Vercel production and smoke test the live app.
