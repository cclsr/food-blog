import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteFood } from "./foods/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/confirm-submit";

export const metadata = { title: "站长后台 · 小食粥记" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [foodsCount, photos, menus, foodList] = await Promise.all([
    supabase.from("foods").select("*", { count: "exact", head: true }),
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.from("menu_lists").select("*", { count: "exact", head: true }),
    supabase
      .from("foods")
      .select("slug, title, date")
      .order("date", { ascending: false }),
  ]);

  const stats = [
    { label: "食记", value: foodsCount.count ?? 0, emoji: "🍲" },
    { label: "照片", value: photos.count ?? 0, emoji: "📷" },
    { label: "菜单", value: menus.count ?? 0, emoji: "📋" },
  ];

  const foods = (foodList.data ?? []) as {
    slug: string;
    title: string;
    date: string;
  }[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">欢迎回来 👋</h1>
          <p className="mt-1 text-muted-foreground">在这里管理你的博客内容。</p>
        </div>
        <Button asChild>
          <Link href="/admin/foods/new">✍️ 发布新食记</Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>
                {s.emoji} {s.label}
              </CardDescription>
              <CardTitle className="text-3xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* 已发布的食记 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">已发布的食记</CardTitle>
          <CardDescription>共 {foods.length} 篇</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {foods.map((f) => (
              <li key={f.slug} className="flex items-center gap-3 py-2.5">
                <span className="flex-1 font-medium">{f.title}</span>
                <time className="text-xs text-muted-foreground">{f.date}</time>
                <Link
                  href={`/food/${f.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  查看
                </Link>
                <form action={deleteFood}>
                  <input type="hidden" name="slug" value={f.slug} />
                  <ConfirmSubmit
                    message={`确定删除食记「${f.title}」吗？此操作不可撤销。`}
                    className="text-sm text-destructive hover:underline"
                  >
                    删除
                  </ConfirmSubmit>
                </form>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/photos" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">📷 上传照片</CardTitle>
              <CardDescription>管理照片墙、上传新图</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/menu" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">📋 编辑菜单</CardTitle>
              <CardDescription>加条目、打勾、新建清单</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
