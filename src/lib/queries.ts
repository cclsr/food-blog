// 数据访问层：页面只调用这里的函数，不直接碰 Supabase 或假数据。
// - 配好 Supabase（.env.local 里填了密钥）→ 读数据库
// - 没配 → 回退到 src/lib/data.ts 的假数据，网站照常显示
//
// 好处：第 3 步切到数据库时，页面代码改动极小；第 4 步加写功能也在这一层扩展。

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  foods as mockFoods,
  menuLists as mockMenuLists,
  photos as mockPhotos,
  type Food,
  type MenuList,
  type Photo,
} from "@/lib/data";

export async function getFoods(): Promise<Food[]> {
  if (!isSupabaseConfigured || !supabase) return mockFoods;

  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("getFoods 失败，回退假数据：", error.message);
    return mockFoods;
  }
  return (data ?? []) as Food[];
}

export async function getFood(slug: string): Promise<Food | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockFoods.find((f) => f.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getFood 失败，回退假数据：", error.message);
    return mockFoods.find((f) => f.slug === slug) ?? null;
  }
  return (data as Food) ?? null;
}

export async function getMenuLists(): Promise<MenuList[]> {
  if (!isSupabaseConfigured || !supabase) return mockMenuLists;

  const { data, error } = await supabase
    .from("menu_lists")
    .select("title, description, sort, menu_items(name, note, done, by_who, sort)")
    .order("sort", { ascending: true })
    .order("sort", { foreignTable: "menu_items", ascending: true });

  if (error) {
    console.error("getMenuLists 失败，回退假数据：", error.message);
    return mockMenuLists;
  }

  // 把数据库字段（snake_case）映射成页面用的形状
  type Row = {
    title: string;
    description: string;
    menu_items: { name: string; note: string | null; done: boolean; by_who: string }[];
  };
  return (data as Row[]).map((row) => ({
    title: row.title,
    desc: row.description,
    items: row.menu_items.map((it) => ({
      name: it.name,
      note: it.note ?? undefined,
      done: it.done,
      by: it.by_who,
    })),
  }));
}

export async function getPhotos(): Promise<Photo[]> {
  if (!isSupabaseConfigured || !supabase) return mockPhotos;

  const { data, error } = await supabase
    .from("photos")
    .select("src, caption, food_slug, sort")
    .order("sort", { ascending: true });

  if (error) {
    console.error("getPhotos 失败，回退假数据：", error.message);
    return mockPhotos;
  }

  type Row = { src: string; caption: string; food_slug: string | null };
  return (data as Row[]).map((p) => ({
    src: p.src,
    caption: p.caption,
    foodSlug: p.food_slug ?? undefined,
  }));
}
