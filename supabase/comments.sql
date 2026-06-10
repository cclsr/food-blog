-- ============================================================
-- 评论表（新功能）：访客无需登录即可在食记下留言。
-- 用法：复制本文件 → Supabase SQL Editor → Run（跑一次即可）
-- ============================================================

create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  food_slug  text not null references foods(slug) on delete cascade,
  author     text not null default '匿名',
  body       text not null,
  created_at timestamptz not null default now()
);

-- 按食记查评论时加速
create index if not exists comments_food_slug_idx on comments(food_slug, created_at);

alter table comments enable row level security;

-- 任何人都能读评论
drop policy if exists "public read comments" on comments;
create policy "public read comments" on comments
  for select using (true);

-- 任何人都能发评论（公开博客）
drop policy if exists "public insert comments" on comments;
create policy "public insert comments" on comments
  for insert with check (true);

-- 只有登录的站长能删评论（用于清理垃圾留言）
drop policy if exists "auth delete comments" on comments;
create policy "auth delete comments" on comments
  for delete to authenticated using (true);
