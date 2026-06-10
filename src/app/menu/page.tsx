import { getMenuLists } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = { title: "朋友菜单 · 小食粥记" };

export default async function MenuPage() {
  const menuLists = await getMenuLists();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">朋友菜单</h1>
        <p className="mt-2 text-muted-foreground">
          和朋友一起攒的清单，吃过一个就打个勾 ✅
        </p>
      </header>

      <div className="space-y-8">
        {menuLists.map((list) => {
          const doneCount = list.items.filter((i) => i.done).length;
          return (
            <Card key={list.title}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{list.title}</CardTitle>
                  <Badge>
                    {doneCount}/{list.items.length} 已打卡
                  </Badge>
                </div>
                <CardDescription>{list.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {list.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 py-3">
                      <span
                        className={
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs " +
                          (item.done
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 text-transparent")
                        }
                      >
                        ✓
                      </span>
                      <div className="flex-1">
                        <span
                          className={
                            item.done
                              ? "text-muted-foreground line-through"
                              : "font-medium"
                          }
                        >
                          {item.name}
                        </span>
                        {item.note && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            · {item.note}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.by} 加的
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
