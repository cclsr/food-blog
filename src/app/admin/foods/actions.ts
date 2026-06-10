"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string } | null;

// 把多行文本拆成数组（每行一项，去掉空行）
function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// 把「逗号/空格分隔」拆成标签数组
function tags(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createFood(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  // 二次确认已登录（middleware 已挡过一道，这里再保险）
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "未登录，请重新登录。" };

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  let cover = String(formData.get("cover") ?? "").trim();
  const date =
    String(formData.get("date") ?? "").trim() ||
    new Date().toISOString().slice(0, 10);

  if (!title) return { error: "标题不能为空。" };
  if (!slug) return { error: "网址别名（slug）不能为空，用英文或拼音。" };
  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: "网址别名只能用小写字母、数字和连字符（-）。" };

  if (!cover) cover = `https://loremflickr.com/640/480/food?lock=${slug.length}`;

  const body = lines(formData.get("body"));
  const ingredients = lines(formData.get("ingredients"));
  const steps = lines(formData.get("steps"));

  const { error } = await supabase.from("foods").insert({
    slug,
    title,
    excerpt: excerpt || title,
    cover,
    date,
    tags: tags(formData.get("tags")),
    body: body.length ? body : [excerpt || title],
    ingredients: ingredients.length ? ingredients : null,
    steps: steps.length ? steps : null,
  });

  if (error) {
    if (error.code === "23505")
      return { error: `网址别名「${slug}」已被占用，换一个。` };
    return { error: "保存失败：" + error.message };
  }

  // 刷新相关页面缓存，让新食记立刻出现在前台
  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath(`/food/${slug}`);
  redirect(`/food/${slug}`);
}

export async function deleteFood(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  await supabase.from("foods").delete().eq("slug", slug);

  revalidatePath("/");
  revalidatePath("/food");
  revalidatePath("/admin");
}
