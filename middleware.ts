import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { JwtResponse } from "./app/types/jwt";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reissue`,
        {
          method: "POST",
          headers: {
            "Refresh-Token": `${refreshToken}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      const data: JwtResponse = await response.json();

      const nextResponse = NextResponse.next();

      nextResponse.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        expires: new Date(data.accessTokenExpiredAt),
      });
      nextResponse.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        expires: new Date(data.refreshTokenExpiredAt),
      });

      return nextResponse;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!error|api/auth/callback|auth/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
