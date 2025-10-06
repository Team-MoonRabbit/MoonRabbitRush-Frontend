import { NextRequest, NextResponse } from "next/server";
import { JwtResponse } from "./app/types/jwt";
import { ResponseCookies } from "@edge-runtime/cookies";

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
            "Refresh-Token": `Bearer ${refreshToken}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      const data: JwtResponse = await response.json();

      console.log(data);

      const headers = new Headers();
      const responseCookies = new ResponseCookies(headers);

      responseCookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(data.accessTokenExpiredAt),
      });
      responseCookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(data.refreshTokenExpiredAt),
      });

      console.log(
        NextResponse.next({
          headers: headers,
        })
      );

      return NextResponse.next({
        headers: headers,
      });
    } catch (e) {
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
