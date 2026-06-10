-- ============================================================
-- 小食粥记 · 数据库结构（第 3 步）
-- 用法：复制本文件全部内容 → Supabase 控制台 → SQL Editor → Run
-- 然后再跑一次 seed.sql 灌入示例数据
-- ============================================================

-- 干净重建（方便反复试验；正式上线后可删掉这几行 drop）
drop table if exists menu_items cascade;
drop table if exists menu_lists cascade;
drop table if exists photos cascade;
drop table if exists foods cascade;

-- 美食帖 ---------------------------------------------------------
create table foods (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text not null,
  cover       text not null,
  date        date not null,
  tags        text[] not null default '{}',
  body        text[] not null default '{}',
  ingredients text[],
  steps       text[],
  created_at  timestamptz not null default now()
);

-- 朋友菜单（清单） ----------------------------------------------
create table menu_lists (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  sort        int  not null default 0,
  created_at  timestamptz not null default now()
);

-- 菜单条目 ------------------------------------------------------
create table menu_items (
  id        uuid primary key default gen_random_uuid(),
  list_id   uuid not null references menu_lists(id) on delete cascade,
  name      text not null,
  note      text,
  done      boolean not null default false,
  by_who    text not null default '',
  sort      int not null default 0
);

-- 照片墙 --------------------------------------------------------
create table photos (
  id        uuid primary key default gen_random_uuid(),
  src       text not null,
  caption   text not null default '',
  food_slug text,
  sort      int not null default 0
);

-- ============================================================
-- 行级安全（RLS）：博客是公开的，允许任何人「读」，但不允许匿名「写」
-- 第 4 步加了站长登录后，再放开登录用户的写权限
-- ============================================================
alter table foods       enable row level security;
alter table menu_lists  enable row level security;
alter table menu_items  enable row level security;
alter table photos      enable row level security;

create policy "public read foods"      on foods      for select using (true);
create policy "public read menu_lists" on menu_lists for select using (true);
create policy "public read menu_items" on menu_items for select using (true);
create policy "public read photos"     on photos     for select using (true);
