import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // 只在 /admin 后台跑鉴权 middleware；公开页面不付这次网络往返，跳转更快
  matcher: ["/admin/:path*"],
};
