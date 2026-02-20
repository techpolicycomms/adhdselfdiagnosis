-- Submissions table: stores questionnaire responses (anonymous or linked to user)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text not null,
  diva5_responses jsonb,
  asrs_responses jsonb,
  impairment_domains text[] default '{}',
  age_of_onset text,
  cookie_data jsonb,
  created_at timestamptz default now()
);

-- RLS: users can read only their own submissions
alter table public.submissions enable row level security;

create policy "Users can read own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

-- Insert: allow own user_id or anonymous (user_id null)
create policy "Users can insert own or anonymous submissions"
  on public.submissions for insert
  with check (user_id is null or auth.uid() = user_id);

-- Index for user lookups
create index if not exists submissions_user_id_idx on public.submissions(user_id);
create index if not exists submissions_anonymous_id_idx on public.submissions(anonymous_id);
create index if not exists submissions_created_at_idx on public.submissions(created_at desc);
