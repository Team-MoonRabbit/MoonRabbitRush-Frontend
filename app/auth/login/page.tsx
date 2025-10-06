"use client";

import GoogleLoginButton from "@/components/google-login-button";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ next?: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const { next } = await params;
      if (next) {
        router.push(next);
      }
    };

    fetchParams();
  }, []);

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
