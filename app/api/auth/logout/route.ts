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
    const response = new NextResponse(undefined, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }
}
