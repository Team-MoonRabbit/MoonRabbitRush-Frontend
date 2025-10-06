"use server";

import crypto from "crypto";

export async function encryptText(text: string) {
  try {
    const keyBase64 = process.env.GAME_AES_KEY as string;
    const key = Buffer.from(keyBase64, "base64");
    if (key.length !== 32)
      throw new Error("Invalid key length, must be 32 bytes");

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    return encrypted;
  } catch (e) {
    console.log(e);
  }
}
