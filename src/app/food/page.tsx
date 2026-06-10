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

export const metadata = { title: "美食分享 · 小食粥记" };
export const dynamic = "force-dynamic";

export default async function FoodPage() {
  const foods = await getFoods();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">美食分享</h1>
        <p className="mt-2 text-muted-foreground">
          做过、吃过的每一道，附上菜谱和心得。共 {foods.length} 篇。
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
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
