"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScoreUser } from "./types/user";

function TestFirst({ user }: { user: ScoreUser }) {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-yellow-500 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">1</p>
      </div>
      <p className="text-base">{user.email}</p>
      <p className="text-sm text-neutral-400">{user.score}점</p>
    </div>
  );
}

function TestSecond({ user }: { user: ScoreUser }) {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-neutral-500 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">2</p>
      </div>
      <p className="text-base">{user.email}</p>
      <p className="text-sm text-neutral-400">{user.score}점</p>
    </div>
  );
}

function TestThird({ user }: { user: ScoreUser }) {
  return (
    <div className="text-center flex flex-col">
      <div className="size-9 bg-amber-800 grid border rounded-full mx-auto mb-2">
        <p className="m-auto">3</p>
      </div>
      <p className="text-base">{user.email}</p>
      <p className="text-sm text-neutral-400">{user.score}점</p>
    </div>
  );
}

function Test({ user }: { user: ScoreUser }) {
  return (
    <div className="grid grid-flow-col">
      <div className="flex gap-x-4 items-center">
        <p className="size-7 text-center">{user.rank}</p>
        <p>{user.email}</p>
      </div>
      <p className="text-end">{user.score}</p>
    </div>
  );
}

export default function Home() {
  const [users, setUsers] = useState<ScoreUser[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/game/ranking", {
        method: "GET",
      });
      const data = await response.json();

      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <main className="grid h-full">
      {users && (
        <div className="mt-16 text-white space-y-5 overflow-y-auto">
          <div className="bg-[#26262699] py-8">
            <div className="flex">
              <div className="mx-auto">
                {users.length > 0 && (
                  <TestFirst user={users?.at(0) as ScoreUser} />
                )}
              </div>
            </div>
            {users.length > 2 && (
              <div className="grid grid-cols-2">
                <TestSecond user={users.at(1) as ScoreUser} />
                <TestThird user={users.at(2) as ScoreUser} />
              </div>
            )}
          </div>
          <div className="space-y-4 px-4">
            {users.length > 3 &&
              users.slice(3).map((user) => <Test user={user as ScoreUser} />)}
          </div>
        </div>
      )}
      <footer className="text-center py-2 mt-auto px-4">
        <Link href={"/game"} prefetch={false}>
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
