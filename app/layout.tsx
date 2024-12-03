import { PHProvider } from "@/_analytics/provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import Link from "next/link";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noway's Chrono Projekt",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PHProvider>
      <html lang="de">
        <body
          className={`${inter.className} dark mx-auto w-full max-w-screen-xl p-4`}
        >
          <header className="flex flex-row items-center justify-center gap-2 md:gap-2.5 mb-6 md:mb-12 border-b py-2 sm:py-3.5 md:py-5">
            <img
              src="/relaxo.jpg"
              alt="Noway"
              className="aspect-square size-16 sm:size-20 md:size-24 rounded-full border-4"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium">
              Chrono Projekt
            </h1>
          </header>

          <ConvexClientProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ConvexClientProvider>

          <hr className="mt-6 mb-3" />

          <footer className="text-sm text-center">
            Made with ❤️ by{" "}
            <Link
              href="https://bsky.app/profile/tobeeee.bsky.social"
              target="_blank"
              className="font-bold"
            >
              Tobito
            </Link>
          </footer>
        </body>
      </html>
    </PHProvider>
  );
}
