"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "../types/user";

export default function Page() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const supabaseClient = createClient();

    const fetchUser = async () => {
      const { data } = await supabaseClient.auth.getUser();
      setUser(data.user as User);
    };

    fetchUser();
  }, []);

  return <div className="px-4 pt-28 text-white text-center">{user?.email}</div>;
}
