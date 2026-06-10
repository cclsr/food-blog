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

// 刷新所有会显示评论的页面
function refresh(slug?: string) {
  revalidatePath("/admin/comments");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/food/${slug}`);
}

export type ReplyState = { error?: string; ok?: boolean } | null;

// 站长回复某条评论（留空则视为撤回回复）
export async function replyComment(
  _prev: ReplyState,
  formData: FormData
): Promise<ReplyState> {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();

  if (!id) return { error: "缺少评论标识。" };
  if (reply.length > 1000) return { error: "回复太长了（最多 1000 字）。" };

  const supabase = await requireUser();
  const { error } = await supabase
    .from("comments")
    .update(
      reply
        ? { reply, reply_at: new Date().toISOString() }
        : { reply: null, reply_at: null }
    )
    .eq("id", id);

  if (error) return { error: "回复失败：" + error.message };

  refresh(slug);
  return { ok: true };
}

// 隐藏 / 恢复评论
export async function toggleHideComment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const hidden = String(formData.get("hidden") ?? "") === "true";
  const supabase = await requireUser();
  await supabase.from("comments").update({ hidden: !hidden }).eq("id", id);
  refresh(slug);
}

// 删除评论
export async function deleteComment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const supabase = await requireUser();
  await supabase.from("comments").delete().eq("id", id);
  refresh(slug);
}
