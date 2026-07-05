-- attempts: 每次练习记录
create table if not exists public.attempts (
  id text primary key,
  user_id text not null default 'default',
  date text not null,
  kind text not null,
  minutes integer not null default 10,
  detail text,
  question_id text,
  correct boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_attempts_user_date on public.attempts(user_id, date desc);

-- vocabulary: 词库学习记录
create table if not exists public.vocabulary (
  id text primary key,
  user_id text not null default 'default',
  phrase text not null,
  meaning text not null,
  example text,
  mastery integer not null default 0,
  due text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- question_history: 题目作答记录，用于防重复
create table if not exists public.question_history (
  id text primary key,
  user_id text not null default 'default',
  question_id text not null,
  skill text not null,
  correct boolean,
  answered_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_qh_user_skill on public.question_history(user_id, skill);

-- Enable realtime for attempts
alter publication supabase_realtime add table public.attempts;
