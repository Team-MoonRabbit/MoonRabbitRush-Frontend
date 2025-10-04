"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DoorClosed } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <DoorClosed onClick={logout}>Logout</DoorClosed>;
}
