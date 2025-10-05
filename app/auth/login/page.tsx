"use client";

import GoogleLoginButton from "@/components/google-login-button";
import { redirect } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  useEffect(() => {
    const validateEmail = async () => {
      if ((await searchParams).error === "invalid-email") {
        toast.error("학교 이메일로 로그인을 시도해주세요.");
      }
    };

    validateEmail();
  }, [searchParams]);

  const onLogin = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google/url`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    const data = await response.json();
    redirect(data);
  }, []);

  return (
    <div className="grid h-full">
      <div className="m-auto">
        <GoogleLoginButton onClick={onLogin} />
      </div>
    </div>
  );
}
