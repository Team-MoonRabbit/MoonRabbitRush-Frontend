"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="grid h-full px-4">
      <footer className="text-center py-2 mt-auto">
        <Link href={"/game"}>
          <button className="w-full py-3 bg-amber-900 text-white rounded-md">
            게임 시작하기
          </button>
        </Link>
        <p className="text-xs text-neutral-200 mt-4">
          © 2025. Team MoonRabbit All rights reserved.
        </p>
      </footer>
    </main>
  );
}
