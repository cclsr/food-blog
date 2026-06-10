import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  addMenuList,
  deleteMenuList,
  addMenuItem,
  toggleMenuItem,
  deleteMenuItem,
} from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmSubmit } from "@/components/confirm-submit";

export const metadata = { title: "编辑菜单 · 小食粥记" };

type Item = {
  id: string;
  name: string;
  note: string | null;
  done: boolean;
  by_who: string;
};
type List = { id: string; title: string; description: string; menu_items: Item[] };

export default async function AdminMenuPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_lists")
    .select("id, title, description, sort, menu_items(id, name, note, done, by_who, sort)")
    .order("sort")
    .order("sort", { foreignTable: "menu_items" });

  const lists = (data ?? []) as List[];

  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
        ← 返回后台
      </Link>
      <h1 className="text-2xl font-bold">📋 编辑菜单</h1>

      {lists.map((list) => (
        <Card key={list.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>{list.title}</CardTitle>
                <CardDescription>{list.description}</CardDescription>
              </div>
              <form action={deleteMenuList}>
                <input type="hidden" name="id" value={list.id} />
                <ConfirmSubmit
                  message={`确定删除整份清单「${list.title}」吗？里面的条目会一起删掉，且不可撤销。`}
                  className="text-xs text-destructive hover:underline"
                >
                  删除整份
                </ConfirmSubmit>
              </form>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 条目列表 */}
            <ul className="divide-y divide-border">
              {list.menu_items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  {/* 打勾 / 取消 */}
                  <form action={toggleMenuItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="done" value={String(item.done)} />
                    <button
                      type="submit"
                      title={item.done ? "点击取消打卡" : "点击标记已打卡"}
                      className={
                        "flex h-5 w-5 items-center justify-center rounded-full border text-xs " +
                        (item.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 text-transparent hover:border-primary")
                      }
                    >
                      ✓
                    </button>
                  </form>
                  <span className={item.done ? "text-muted-foreground line-through" : "font-medium"}>
                    {item.name}
                  </span>
                  {item.note && (
                    <span className="text-sm text-muted-foreground">· {item.note}</span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">{item.by_who}</span>
                  <form action={deleteMenuItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      message={`确定删除「${item.name}」这一条吗？`}
                      className="text-xs text-destructive hover:underline"
                    >
                      删
                    </ConfirmSubmit>
                  </form>
                </li>
              ))}
              {list.menu_items.length === 0 && (
                <li className="py-2.5 text-sm text-muted-foreground">还没有条目，加一个吧 👇</li>
              )}
            </ul>

            {/* 加新条目 */}
            <form action={addMenuItem} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="list_id" value={list.id} />
              <Input name="name" required placeholder="菜名 / 店名" className="h-9 w-40" />
              <Input name="note" placeholder="备注（选填）" className="h-9 w-40" />
              <Input name="by_who" placeholder="谁加的" className="h-9 w-24" />
              <Button type="submit" size="sm" variant="outline">
                + 添加
              </Button>
            </form>
          </CardContent>
        </Card>
      ))}

      {/* 新建清单 */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">+ 新建一份清单</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addMenuList} className="flex flex-wrap items-center gap-2">
            <Input name="title" required placeholder="清单标题，如：露营带的吃的" className="h-9 w-56" />
            <Input name="description" placeholder="一句话描述（选填）" className="h-9 w-56" />
            <Button type="submit" size="sm">
              创建
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
