import Link from "next/link";
import { getFoods, getPhotos } from "@/lib/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 每次访问都读实时数据库，站长改了内容立刻生效（不走构建时快照）
export const dynamic = "force-dynamic";

export default async function Home() {
  const [foods, photos] = await Promise.all([getFoods(), getPhotos()]);
  const latest = foods.slice(0, 3);
  const photoStrip = photos.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center py-20 text-center">
        <span className="mb-4 rounded-full bg-accent px-4 py-1.5 text-sm text-accent-foreground">
          🍜 一个关于吃的小博客
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          好好吃饭，<span className="text-primary">认真生活</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          分享美食、和朋友攒菜单、晒下厨的照片墙。慢慢更新，欢迎常来逛逛。
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link href="/food">逛逛美食 →</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/gallery">看照片墙</Link>
          </Button>
        </div>
      </section>

      {/* 最新食记 */}
      <section className="pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">最新食记</h2>
          <Link href="/food" className="text-sm text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {latest.map((food) => (
            <Link key={food.slug} href={`/food/${food.slug}`} className="group">
              <Card className="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={food.cover}
                  alt={food.title}
                  className="aspect-[4/3] w-full bg-muted object-cover"
                />
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {food.tags.slice(0, 2).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-base transition-colors group-hover:text-primary">
                    {food.title}
                  </CardTitle>
                  <CardDescription>{food.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 照片墙预览 */}
      <section className="pb-24">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">照片墙</h2>
          <Link href="/gallery" className="text-sm text-primary hover:underline">
            全部照片 →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photoStrip.map((photo, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
