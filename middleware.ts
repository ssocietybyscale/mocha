import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-auth")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/ssociety_login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/ssociety_login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
