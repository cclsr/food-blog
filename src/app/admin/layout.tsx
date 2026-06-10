import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 登录页不套后台外壳
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">🛠️ 站长后台</span>
          <nav className="flex gap-3 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground">
              概览
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{user.email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              退出登录
            </Button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
