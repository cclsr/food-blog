import Link from "next/link";
import { getFoods } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = { title: "搜索 · 小食粥记" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  // 在标题、简介、标签、正文里做不区分大小写的关键词匹配
  const all = await getFoods();
  const kw = query.toLowerCase();
  const results = query
    ? all.filter((f) => {
        const hay = [
          f.title,
          f.excerpt,
          ...f.tags,
          ...(f.body ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(kw);
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">搜索</h1>
        {query ? (
          <p className="mt-2 text-muted-foreground">
            关键词「{query}」找到 {results.length} 篇食记
          </p>
        ) : (
          <p className="mt-2 text-muted-foreground">在上方搜索框输入关键词试试。</p>
        )}
      </header>

      {query && results.length === 0 && (
        <p className="text-muted-foreground">
          没找到相关食记，换个词试试？或去{" "}
          <Link href="/food" className="text-primary hover:underline">
            浏览全部
          </Link>
          。
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((food) => (
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
                  {food.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <CardTitle className="transition-colors group-hover:text-primary">
                  {food.title}
                </CardTitle>
                <CardDescription>{food.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <time className="text-xs text-muted-foreground">{food.date}</time>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
