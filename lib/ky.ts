"use server";

import { JwtResponse } from "@/app/types/jwt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ky, { BeforeRetryHook } from "ky";
import { cookies } from "next/headers";

const DEFAULT_API_RETRY_LIMIT = 2;

const handleTokenRefresh: BeforeRetryHook = async ({ retryCount }) => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (retryCount === DEFAULT_API_RETRY_LIMIT - 1 || !refreshToken) {
    await ky.post("/api/auth/logout");
    return ky.stop;
  }

  try {
    const response = await ky.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reissue`,
      {
        headers: {
          "Refresh-Token": `${refreshToken}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      }
    );
    const data: JwtResponse = await response.json();

    dayjs.extend(utc);
    dayjs.extend(timezone);

    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: dayjs.tz(data.accessTokenExpiredAt, "Asia/Seoul").utc().toDate(),
    });
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: dayjs
        .tz(data.refreshTokenExpiredAt, "Asia/Seoul")
        .utc()
        .toDate(),
    });
  } catch (e) {
    await ky.post("/api/auth/logout");
    return ky.stop;
  }
};

export const serverInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
    beforeRetry: [handleTokenRefresh],
  },
  retry: {
    limit: DEFAULT_API_RETRY_LIMIT,
  },
});
