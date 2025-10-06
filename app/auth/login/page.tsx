"use client";

import LoginComponent from "@/components/login-component";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <LoginComponent />
    </Suspense>
  );
}
