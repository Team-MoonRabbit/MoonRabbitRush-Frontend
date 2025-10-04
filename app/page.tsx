"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "./types/user";
import { createClient } from "@/lib/supabase/client";
import { TableDemo } from "@/components/table-demo";

function TestFirst() {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-yellow-500 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">1</p>
      </div>
      <p className="text-base">s23037@gsm.hs.kr</p>
      <p className="text-sm text-neutral-400">21점</p>
    </div>
  );
}

function TestSecond() {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-neutral-500 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">2</p>
      </div>
      <p className="text-base">s23037@gsm.hs.kr</p>
      <p className="text-sm text-neutral-400">21점</p>
    </div>
  );
}

function TestThird() {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-amber-800 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">3</p>
      </div>
      <p className="text-base">s23037@gsm.hs.kr</p>
      <p className="text-sm text-neutral-400">21점</p>
    </div>
  );
}

function Test({ index }: { index: number }) {
  return (
    <div className="grid grid-flow-col">
      <div className="flex gap-x-4 items-center">
        <p className="size-7 text-center">{index}</p>
        <p>s23037@gsm.hs.kr</p>
      </div>
      <p className="text-end">21</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="grid h-full px-4">
      <div className="mt-24 text-white space-y-5 overflow-y-auto">
        <div className="flex">
          <div className="mx-auto">
            <TestFirst />
          </div>
        </div>
        <div className="grid grid-cols-2 mb-12">
          <TestSecond />
          <TestThird />
        </div>
        <Test index={4} />
        <Test index={5} />
        <Test index={6} />
        <Test index={7} />
        <Test index={8} />
        <Test index={9} />
        <Test index={10} />
        <Test index={11} />
        <Test index={12} />
        <Test index={13} />
      </div>
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
