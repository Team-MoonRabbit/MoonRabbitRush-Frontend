import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { JwtResponse } from "@/app/types/jwt";

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

      const nextResponse = NextResponse.redirect(origin);

      nextResponse.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(data.accessTokenExpiredAt),
      });
      nextResponse.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(data.refreshTokenExpiredAt),
      });

      return nextResponse;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
