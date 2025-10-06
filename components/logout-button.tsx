"use client";

import { DoorClosed } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <div
      onClick={logout}
      className="border bg-white py-2 px-4 rounded-full opacity-50 cursor-pointer flex gap-x-2 items-center"
    >
      <DoorClosed />
      <p className="text-sm">로그아웃</p>
    </div>
  );
}
