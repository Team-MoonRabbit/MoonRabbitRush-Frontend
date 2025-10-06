import { NextResponse } from "next/server";
import { JwtResponse } from "@/app/types/jwt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google/login?code=${code}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data: JwtResponse = await response.json();

      const nextResponse = NextResponse.redirect(new URL("/", request.url));
      dayjs.extend(utc);
      dayjs.extend(timezone);

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
    } catch (e) {
      console.log(e);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
