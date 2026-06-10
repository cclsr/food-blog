-- ============================================================
-- 照片存储桶（第 4c 步）：建一个公开可读的 photos 桶，存上传的图片。
-- 用法：复制本文件 → Supabase SQL Editor → Run（跑一次即可）
-- ============================================================

-- 建桶（public = true：图片有公开访问链接，方便前台直接显示）
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- 存储对象的访问策略
drop policy if exists "public read photos bucket"  on storage.objects;
drop policy if exists "auth upload photos bucket"  on storage.objects;
drop policy if exists "auth update photos bucket"  on storage.objects;
drop policy if exists "auth delete photos bucket"  on storage.objects;

-- 任何人都能读（公开图片）
create policy "public read photos bucket" on storage.objects
  for select using (bucket_id = 'photos');

-- 只有登录用户能上传 / 改 / 删
create policy "auth upload photos bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');
create policy "auth update photos bucket" on storage.objects
  for update to authenticated using (bucket_id = 'photos');
create policy "auth delete photos bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');
