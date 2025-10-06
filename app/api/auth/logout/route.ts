import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  try {
    if (refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Refresh-Token": `${refreshToken}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
    }
  } finally {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return new NextResponse();
  }
}
