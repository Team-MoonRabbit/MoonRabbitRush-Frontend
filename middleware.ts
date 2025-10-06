import { NextRequest, NextResponse } from "next/server";
import { JwtResponse } from "./app/types/jwt";

function applySetCookie(req: NextRequest, res: NextResponse) {
  const setCookies = res.cookies.getAll();
  const newReqHeaders = new Headers(req.headers);

  for (const cookie of setCookies) {
    newReqHeaders.append("cookie", `${cookie.name}=${cookie.value}`);
  }

  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  dummyRes.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.rewrite(new URL("/auth/login", request.url));
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
      const data: JwtResponse = await response.json();
      const nextResponse = NextResponse.next();

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

      applySetCookie(request, nextResponse);

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
