"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function refresh() {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  revalidatePath("/admin");
}

// 新建一份菜单清单
export async function addMenuList(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const description = String(formData.get("description") ?? "").trim();

  const supabase = await requireUser();
  const { count } = await supabase
    .from("menu_lists")
    .select("*", { count: "exact", head: true });
  await supabase
    .from("menu_lists")
    .insert({ title, description, sort: count ?? 0 });
  refresh();
}

// 删除整份清单（连带条目）
export async function deleteMenuList(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await requireUser();
  await supabase.from("menu_lists").delete().eq("id", id);
  refresh();
}

// 往某份清单里加一条
export async function addMenuItem(formData: FormData) {
  const list_id = String(formData.get("list_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!list_id || !name) return;
  const note = String(formData.get("note") ?? "").trim();
  const by_who = String(formData.get("by_who") ?? "").trim() || "我";

  const supabase = await requireUser();
  const { count } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("list_id", list_id);
  await supabase.from("menu_items").insert({
    list_id,
    name,
    note: note || null,
    by_who,
    done: false,
    sort: count ?? 0,
  });
  refresh();
}

// 打勾 / 取消打勾
export async function toggleMenuItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const done = String(formData.get("done") ?? "") === "true";
  const supabase = await requireUser();
  await supabase.from("menu_items").update({ done: !done }).eq("id", id);
  refresh();
}

// 删除一条
export async function deleteMenuItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await requireUser();
  await supabase.from("menu_items").delete().eq("id", id);
  refresh();
}
