"use client";

import GoogleLoginButton from "@/components/google-login-button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next");
    if (next) {
      router.push(next);
    }
  }, [searchParams, router]);

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
    const data = await response.text();
    router.push(data);
  }, []);

  return (
    <div className="grid h-full">
      <div className="m-auto">
        <GoogleLoginButton onClick={onLogin} />
      </div>
    </div>
  );
}
