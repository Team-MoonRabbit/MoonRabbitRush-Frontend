import type { Metadata } from "next";
import LocalFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Home, User2 } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const pretendard = LocalFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoonRabbitRush",
  description: "끝없이 이어지는 계단을 올라 달까지 닿는 토끼의 여정",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} antialiased flex bg-gray-400`}>
        <div className="max-w-[480px] relative w-full mx-auto bg-[#101c3e] bg-[url(/image.png)] bg-cover h-[100dvh] flex flex-col">
          <Toaster position="top-right" />
          <div className="flex mb-auto p-2 h-min absolute w-full z-10">
            <div className="mr-auto flex items-center gap-x-1">
              <Link
                href={"/"}
                className="border bg-white p-2 rounded-full opacity-50 cursor-pointer"
              >
                <Home />
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-x-1">
              <LogoutButton />
            </div>
          </div>
          <div className="h-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
