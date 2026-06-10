import Link from "next/link";
import { getPhotos, getFoods } from "@/lib/queries";

export const metadata = { title: "照片墙 · 小食粥记" };
export const dynamic = "force-dynamic";

function fmtDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default async function GalleryPage() {
  const [photosAsc, foods] = await Promise.all([getPhotos(), getFoods()]);
  // 最新的在最上面
  const photos = [...photosAsc].reverse();
  // 现存食记的 slug 集合：只有食记还在，照片才可点击跳转
  const existingSlugs = new Set(foods.map((f) => f.slug));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">照片墙</h1>
        <p className="mt-2 text-muted-foreground">
          那些让人食指大动的瞬间，按时间从新到旧排下来。点带链接的图可跳到对应食记。
        </p>
      </header>

      {photos.length === 0 ? (
        <p className="text-muted-foreground">还没有照片，去后台传几张吧 📷</p>
      ) : (
        <ol className="relative ml-3 border-l-2 border-border">
          {photos.map((photo, i) => {
            const date = fmtDate(photo.createdAt);
            const linkable = Boolean(photo.foodSlug && existingSlugs.has(photo.foodSlug));
            const img = (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={photo.src}
                alt={photo.caption}
                className="aspect-[4/3] w-full rounded-xl bg-muted object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            );
            return (
              <li key={i} className="relative pb-12 pl-8 last:pb-0">
                {/* 时间线圆点 */}
                <span className="absolute top-1.5 -left-[9px] h-4 w-4 rounded-full border-2 border-background bg-primary" />
                {/* 圆点旁的日期 */}
                {date && (
                  <time className="mb-2 block text-xs font-medium text-muted-foreground">
                    {date}
                  </time>
                )}
                <figure className="group">
                  {linkable ? (
                    <Link href={`/food/${photo.foodSlug}`} className="block overflow-hidden rounded-xl">
                      {img}
                    </Link>
                  ) : (
                    <div className="overflow-hidden rounded-xl">{img}</div>
                  )}
                  <figcaption className="mt-2.5 flex items-center gap-2 text-sm">
                    <span className="font-medium">{photo.caption || "未命名"}</span>
                    {linkable && (
                      <Link
                        href={`/food/${photo.foodSlug}`}
                        className="text-primary hover:underline"
                      >
                        查看食记 →
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
