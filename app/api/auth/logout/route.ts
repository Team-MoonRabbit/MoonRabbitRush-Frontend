import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { serverInstance } from "@/lib/serverInstance";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    if (refreshToken) {
      await serverInstance.post(
        `/auth/logout`,
        {},
        {
          headers: {
            "Refresh-Token": `Bearer ${refreshToken}`,
          },
        }
      );
    }
  } finally {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return new NextResponse();
  }
}
