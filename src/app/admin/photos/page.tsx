import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePhoto } from "./actions";
import { UploadForm } from "./upload-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "上传照片 · 小食粥记" };

export default async function AdminPhotosPage() {
  const supabase = await createClient();
  const [{ data: photoData }, { data: foodData }] = await Promise.all([
    supabase.from("photos").select("id, src, caption, food_slug, sort").order("sort"),
    supabase.from("foods").select("slug, title").order("date", { ascending: false }),
  ]);

  const photos = (photoData ?? []) as {
    id: string;
    src: string;
    caption: string;
    food_slug: string | null;
  }[];
  const foods = (foodData ?? []) as { slug: string; title: string }[];

  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
        ← 返回后台
      </Link>
      <h1 className="text-2xl font-bold">📷 照片墙管理</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">上传新照片</CardTitle>
          <CardDescription>从电脑选一张图，传到照片墙。</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm foods={foods} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          已有照片（{photos.length} 张）
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.caption}
                className="aspect-square w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="truncate text-xs text-white">{p.caption || "—"}</span>
                <form action={deletePhoto}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="src" value={p.src} />
                  <button
                    type="submit"
                    className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 text-xs text-white hover:bg-destructive"
                  >
                    删除
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
