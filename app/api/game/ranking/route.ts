import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (accessToken) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/game/ranking`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await response.json();

      return NextResponse.json(data);
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.json({ success: true });
}
