"use client";

import { redirect } from "next/navigation";
import { DoorClosed } from "lucide-react";

export function LogoutButton() {
  const logout = async () => {
    fetch("/api/auth/logout", { method: "POST" });
    redirect("/auth/login");
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
