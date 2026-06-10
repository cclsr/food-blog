import Link from "next/link";
import { notFound } from "next/navigation";
import { getFood } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { CommentForm } from "./comment-form";
import { deleteComment } from "./comment-actions";

type Comment = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

// 读评论（评论表还没建时返回空，不让页面崩）
async function getComments(slug: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, author, body, created_at")
    .eq("food_slug", slug)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Comment[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = await getFood(slug);
  return { title: food ? `${food.title} · 小食粥记` : "未找到" };
}

export default async function FoodDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = await getFood(slug);
  if (!food) notFound();

  const comments = await getComments(slug);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = Boolean(user);

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/food"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回美食列表
      </Link>

      <div className="mt-4 mb-2 flex flex-wrap gap-1.5">
        {food.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <h1 className="text-3xl font-bold sm:text-4xl">{food.title}</h1>
      <time className="mt-2 block text-sm text-muted-foreground">{food.date}</time>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={food.cover}
        alt={food.title}
        className="mt-6 aspect-[16/9] w-full rounded-xl bg-muted object-cover"
      />

      <div className="mt-8 space-y-4 text-[15px] leading-7">
        {food.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {food.ingredients && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">🧺 食材</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {food.ingredients.map((ing, i) => (
              <li
                key={i}
                className="rounded-md bg-muted px-3 py-2 text-sm"
              >
                {ing}
              </li>
            ))}
          </ul>
        </section>
      )}

      {food.steps && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">👨‍🍳 做法</h2>
          <ol className="space-y-3">
            {food.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[15px] leading-7">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 评论区 */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 text-xl font-semibold">
          💬 评论
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {comments.length}
            </span>
          )}
        </h2>

        <ul className="mb-8 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.author}</span>
                <time className="text-xs text-muted-foreground">
                  {fmtTime(c.created_at)}
                </time>
                {isAdmin && (
                  <form action={deleteComment} className="ml-auto">
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <button
                      type="submit"
                      className="text-xs text-destructive hover:underline"
                    >
                      删除
                    </button>
                  </form>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap leading-6">{c.body}</p>
            </li>
          ))}
          {comments.length === 0 && (
            <li className="text-sm text-muted-foreground">还没有评论，来抢个沙发 🛋️</li>
          )}
        </ul>

        <CommentForm slug={slug} />
      </section>
    </article>
  );
}
