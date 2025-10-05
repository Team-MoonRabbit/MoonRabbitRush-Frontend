import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { serverInstance } from "@/lib/serverInstance";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const cookieStore = await cookies();

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    try {
      const { data } = await serverInstance.post(
        `/auth/google/login?code=${code}`
      );

      cookieStore.set("accessToken", data.accessToken, {
        expires: new Date(data.accessTokenExpiredAt),
      });
      cookieStore.set("refreshToken", data.refreshToken, {
        expires: new Date(data.refreshTokenExpiredAt),
      });

      return NextResponse.redirect(`${origin}`);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
