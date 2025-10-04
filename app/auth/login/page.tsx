"use client";

import GoogleLoginButton from "@/components/google-login-button";
import { createClient } from "@/lib/supabase/client";
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
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/api/auth/callback`,
      },
    });

    redirect("/protected");
  }, []);

  return (
    <div className="grid h-screen">
      <div className="m-auto">
        <GoogleLoginButton onClick={onLogin} />
      </div>
    </div>
  );
}
