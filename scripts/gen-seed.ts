// 从 src/lib/data.ts 生成 supabase/seed.sql，保证种子数据 = 现在页面看到的内容。
// 运行：npx tsx scripts/gen-seed.ts
import { writeFileSync } from "node:fs";
import { foods, menuLists, photos } from "../src/lib/data";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`; // 转义单引号
const arr = (xs: string[]) =>
  `ARRAY[${xs.map(q).join(", ")}]::text[]`;
const arrOrNull = (xs?: string[]) => (xs && xs.length ? arr(xs) : "NULL");

let sql = `-- ============================================================
-- 小食粥记 · 示例数据（由 scripts/gen-seed.ts 自动生成，请勿手改）
-- 用法：先跑 schema.sql 建表，再把本文件粘进 Supabase SQL Editor 运行
-- ============================================================

truncate menu_items, menu_lists, photos, foods restart identity cascade;

`;

// foods
sql += "-- 美食帖\n";
for (const f of foods) {
  sql += `insert into foods (slug, title, excerpt, cover, date, tags, body, ingredients, steps) values (\n`;
  sql += `  ${q(f.slug)}, ${q(f.title)}, ${q(f.excerpt)}, ${q(f.cover)}, ${q(f.date)},\n`;
  sql += `  ${arr(f.tags)}, ${arr(f.body)}, ${arrOrNull(f.ingredients)}, ${arrOrNull(f.steps)}\n);\n`;
}

// menu lists + items
sql += "\n-- 朋友菜单\n";
menuLists.forEach((list, li) => {
  sql += `with l as (\n  insert into menu_lists (title, description, sort) values (${q(list.title)}, ${q(list.desc)}, ${li}) returning id\n)\n`;
  const rows = list.items.map(
    (it, ii) =>
      `  (${q(it.name)}, ${it.note ? q(it.note) : "NULL"}, ${it.done}, ${q(it.by)}, ${ii})`
  );
  sql += `insert into menu_items (list_id, name, note, done, by_who, sort)\n`;
  sql += `select l.id, v.name, v.note, v.done, v.by_who, v.sort from l,\n`;
  sql += `(values\n${rows.join(",\n")}\n) as v(name, note, done, by_who, sort);\n\n`;
});

// photos
sql += "-- 照片墙\n";
photos.forEach((p, i) => {
  sql += `insert into photos (src, caption, food_slug, sort) values (${q(p.src)}, ${q(p.caption)}, ${p.foodSlug ? q(p.foodSlug) : "NULL"}, ${i});\n`;
});

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log("✅ 已生成 supabase/seed.sql");
