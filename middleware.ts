import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (!accessToken && refreshToken) {
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
      const data = await response.json();

      dayjs.extend(utc);
      dayjs.extend(timezone);

      const nextResponse = NextResponse.redirect(new URL("/", request.url));

      nextResponse.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: dayjs
          .tz(data.accessTokenExpiredAt, "Asia/Seoul")
          .utc()
          .toDate(),
      });
      nextResponse.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: dayjs
          .tz(data.refreshTokenExpiredAt, "Asia/Seoul")
          .utc()
          .toDate(),
      });

      return nextResponse;
    }
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!error|api/auth/callback|auth/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
