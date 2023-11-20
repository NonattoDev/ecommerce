import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Exceção para a rota /api/vendas/notificacao
  if (request.nextUrl.pathname === "/api/vendas/notificacao") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/admin/")) {
    if (token && !token.admin) {
      return new Response("Não autorizado", { status: 401 });
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/vendas/") || request.nextUrl.pathname.startsWith("/api/meuperfil/")) {
    if (!token) {
      return new Response("Não autorizado", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
