# Supabase sync setup

Current production works without Supabase: learning records are real, local, and exportable as JSON.

Use Supabase when a new project exists and multi-device sync is worth turning on.

## Why a new project is needed

The visible Supabase project `Sentheecode's Project` / `xitslotqqmxakthbvurd` is `INACTIVE`. Supabase reported that it has been paused for more than 90 days and cannot be restored.

## Setup steps

1. Create a new Supabase project in the Dashboard.
2. Open SQL Editor and run [`schema.sql`](./schema.sql).
3. Copy the Project URL and anon/publishable key.
4. Add these to Vercel Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. Redeploy Vercel.

## Data model

The first sync target is intentionally simple: one row in `public.learner_snapshots` with `id = 'senthee'` and the current local `LearnerState` JSON as `payload`.

This keeps the current UI and local repository stable. Later, if analytics or multi-user auth matters, split `attempts`, `tasks`, and `vocabulary` into normalized tables.
