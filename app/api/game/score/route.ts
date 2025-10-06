import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const body = await request.json();

    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/game/score`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
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
