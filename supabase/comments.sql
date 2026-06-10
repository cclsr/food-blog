-- ============================================================
-- 新功能迁移：① 评论表（访客可留言）② 给照片加时间字段（时间线展示）
-- 用法：复制本文件 → Supabase SQL Editor → Run（跑一次即可；可重复运行）
-- ============================================================

-- ② 照片加上传时间字段，用于照片墙时间线显示日期
alter table photos add column if not exists created_at timestamptz not null default now();

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

-- ============================================================
-- ③ 评论管理增强：站长可回复、隐藏评论
-- ============================================================

-- 隐藏标记：隐藏后访客看不到，但站长后台仍能看到与恢复
alter table comments add column if not exists hidden boolean not null default false;
-- 站长回复内容与回复时间
alter table comments add column if not exists reply text;
alter table comments add column if not exists reply_at timestamptz;

-- 只有登录的站长能改评论（用于回复 / 隐藏 / 恢复）
drop policy if exists "auth update comments" on comments;
create policy "auth update comments" on comments
  for update to authenticated using (true) with check (true);
