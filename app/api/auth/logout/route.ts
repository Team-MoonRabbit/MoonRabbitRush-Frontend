import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    if (refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Refresh-Token": `Bearer ${refreshToken}`,
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
