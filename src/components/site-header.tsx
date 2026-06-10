import Link from "next/link";

const nav = [
  { href: "/food", label: "美食分享" },
  { href: "/menu", label: "朋友菜单" },
  { href: "/gallery", label: "照片墙" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🍜</span>
          <span>小食粥记</span>
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/search" method="get" className="relative ml-1 hidden sm:block">
            <input
              type="search"
              name="q"
              placeholder="搜食记…"
              aria-label="搜索食记"
              className="h-9 w-32 rounded-full border border-input bg-background pl-8 pr-3 text-sm transition-all focus:w-44 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              🔍
            </span>
          </form>
        </div>
      </div>
    </header>
  );
}
