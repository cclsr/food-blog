import Link from "next/link";
import { getPhotos } from "@/lib/queries";

export const metadata = { title: "照片墙 · 小食粥记" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getPhotos();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">照片墙</h1>
        <p className="mt-2 text-muted-foreground">
          那些让人食指大动的瞬间，点击带链接的图可跳到对应食记。
        </p>
      </header>

      {/* 瀑布流：用 CSS columns 实现 */}
      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {photos.map((photo, i) => {
          const figure = (
            <figure className="group relative overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                {photo.caption}
                {photo.foodSlug && <span className="ml-1">· 查看食记 →</span>}
              </figcaption>
            </figure>
          );
          return photo.foodSlug ? (
            <Link key={i} href={`/food/${photo.foodSlug}`} className="block break-inside-avoid">
              {figure}
            </Link>
          ) : (
            <div key={i} className="break-inside-avoid">
              {figure}
            </div>
          );
        })}
      </div>
    </div>
  );
}
