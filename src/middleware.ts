import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/files")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/cnpj")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return new Response("Não autorizado", { status: 401 });
  }

  // Se o token existir ou a rota não for '/api/files', permita a requisição
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
