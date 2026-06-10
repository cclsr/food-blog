-- ============================================================
-- 写权限策略（第 4 步）：只有「已登录用户」能增删改，匿名访客仍只能读。
-- 用法：复制本文件 → Supabase SQL Editor → Run（跑一次即可，覆盖 4b/4c/4d）
-- ============================================================

-- foods
drop policy if exists "auth write foods" on foods;
create policy "auth write foods" on foods
  for all to authenticated using (true) with check (true);

-- photos
drop policy if exists "auth write photos" on photos;
create policy "auth write photos" on photos
  for all to authenticated using (true) with check (true);

-- menu_lists
drop policy if exists "auth write menu_lists" on menu_lists;
create policy "auth write menu_lists" on menu_lists
  for all to authenticated using (true) with check (true);

-- menu_items
drop policy if exists "auth write menu_items" on menu_items;
create policy "auth write menu_items" on menu_items
  for all to authenticated using (true) with check (true);
