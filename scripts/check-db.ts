// 检查 Supabase 是否连通、数据是否灌好。
// 运行：npx tsx scripts/check-db.ts
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// 手动读 .env.local（脚本不经过 Next，所以自己解析）
function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ .env.local 里的 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY 还没填。");
  process.exit(1);
}

async function main() {
  const supabase = createClient(url!, key!);
  const tables = ["foods", "menu_lists", "menu_items", "photos"];
  let ok = true;
  let empty = false;
  for (const t of tables) {
    // 用真实 select（带 count）而不是 head，这样表不存在会明确报错
    const { data, count, error } = await supabase
      .from(t)
      .select("*", { count: "exact" })
      .limit(1);
    if (error) {
      console.error(`❌ ${t}: ${error.message}`);
      ok = false;
    } else {
      const n = count ?? data?.length ?? 0;
      console.log(`${n > 0 ? "✅" : "⚠️ "} ${t}: ${n} 行`);
      if (n === 0) empty = true;
    }
  }
  if (!ok) {
    console.log("\n❌ 有表读不到 —— 请先在 Supabase SQL Editor 跑 supabase/schema.sql 建表。");
  } else if (empty) {
    console.log("\n⚠️  表建好了但没数据 —— 再跑一次 supabase/seed.sql 灌入示例数据。");
  } else {
    console.log("\n🎉 数据库连通，数据已就绪！");
  }
  process.exit(ok && !empty ? 0 : 1);
}

main();
