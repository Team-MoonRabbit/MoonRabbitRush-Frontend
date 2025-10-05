"use client";

import GoogleLoginButton from "@/components/google-login-button";
import { serverInstance } from "@/lib/serverInstance";
import axios from "axios";
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
    const { data } = await serverInstance(`/auth/google/url`);
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
