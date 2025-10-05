import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "./lib/serverInstance";

export async function middleware(request: NextRequest) {
  const matches = ["/auth/login", "/api/auth/callback", "/error"];
  const isPermitAllPage = matches.some((match) =>
    request.nextUrl.pathname.startsWith(match)
  );

  if (!isPermitAllPage) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken === undefined && refreshToken === undefined) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    } else if (accessToken === undefined) {
      try {
        const { data } = await serverInstance.post(`/auth/reissue`, undefined, {
          headers: {
            "Refresh-Token": `Bearer ${refreshToken}`,
          },
        });

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        cookieStore.set("accessToken", data.accessToken, {
          expires: new Date(data.accessTokenExpiredAt),
        });
        cookieStore.set("refreshToken", data.refreshToken, {
          expires: new Date(data.refreshTokenExpiredAt),
        });
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.log(e.response?.data);
        }

        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  }

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
