"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CommentState = { error?: string; ok?: boolean } | null;

export async function addComment(
  _prev: CommentState,
  formData: FormData
): Promise<CommentState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "匿名";
  const body = String(formData.get("body") ?? "").trim();

  if (!slug) return { error: "缺少食记标识。" };
  if (!body) return { error: "评论内容不能为空。" };
  if (body.length > 1000) return { error: "评论太长了（最多 1000 字）。" };
  if (author.length > 40) return { error: "昵称太长了（最多 40 字）。" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ food_slug: slug, author, body });

  if (error) return { error: "发表失败：" + error.message };

  revalidatePath(`/food/${slug}`);
  return { ok: true };
}

// 站长删除评论（登录后才有权限，靠 RLS 保障）
export async function deleteComment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", id);
  revalidatePath(`/food/${slug}`);
}
