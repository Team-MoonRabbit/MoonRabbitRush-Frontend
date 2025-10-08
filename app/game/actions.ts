"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

export async function encryptText(text: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const keyBase64 = process.env.GAME_AES_KEY as string;
    const key = Buffer.from(keyBase64, "base64");
    if (key.length !== 32)
      throw new Error("Invalid key length, must be 32 bytes");

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/game/score`, {
        method: "POST",
        body: JSON.stringify({
          score: encrypted,
          iv: iv.toString("base64"),
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}
