import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "./lib/serverInstance";

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
    } else if (!accessToken && refreshToken) {
      try {
        const { data } = await serverInstance.post(`/auth/reissue`, undefined, {
          headers: {
            "Refresh-Token": `Bearer ${refreshToken}`,
          },
        });

        const response = NextResponse.next();

        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(data.accessTokenExpiredAt),
        });
        response.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(data.refreshTokenExpiredAt),
        });

        return response;
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
