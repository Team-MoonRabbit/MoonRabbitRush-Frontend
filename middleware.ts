import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const matches = ["/auth/login", "/api/auth/callback", "/error"];
  const isPermitAllPage = matches.some((match) =>
    request.nextUrl.pathname.startsWith(match)
  );

  if (!isPermitAllPage) {
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
        const data = await response.json();

        const nextResponse = NextResponse.next();

        nextResponse.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(data.accessTokenExpiredAt),
        });
        nextResponse.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
