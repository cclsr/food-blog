"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PhotoFormState = { error?: string; ok?: boolean } | null;

export async function uploadPhoto(
  _prev: PhotoFormState,
  formData: FormData
): Promise<PhotoFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "未登录，请重新登录。" };

  const file = formData.get("file") as File | null;
  const caption = String(formData.get("caption") ?? "").trim();
  const foodSlug = String(formData.get("food_slug") ?? "").trim();

  if (!file || file.size === 0) return { error: "请选择一张图片。" };
  if (!file.type.startsWith("image/")) return { error: "只能上传图片文件。" };
  if (file.size > 8 * 1024 * 1024) return { error: "图片太大了（压缩后仍超 8MB），请换张小一点的。" };

  // 生成唯一文件名
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // 上传到 Storage
  const { error: upErr } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return { error: "上传失败：" + upErr.message };

  // 取公开访问链接
  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(path);

  // 算一个排序值（放到最后）
  const { count } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true });

  const { error: insErr } = await supabase.from("photos").insert({
    src: publicUrl,
    caption,
    food_slug: foodSlug || null,
    sort: count ?? 0,
  });
  if (insErr) {
    // 入库失败就把刚上传的文件删掉，避免产生孤儿文件
    await supabase.storage.from("photos").remove([path]);
    return { error: "保存失败：" + insErr.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/photos");
  return { ok: true };
}

export async function deletePhoto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const src = String(formData.get("src") ?? "");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // 删数据库记录
  await supabase.from("photos").delete().eq("id", id);

  // 顺便删 Storage 里的文件（仅当是我们桶里的图）
  const marker = "/photos/";
  const idx = src.indexOf(marker);
  if (idx !== -1) {
    const path = src.slice(idx + marker.length);
    await supabase.storage.from("photos").remove([path]);
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/photos");
}
