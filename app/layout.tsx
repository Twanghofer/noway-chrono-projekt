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
    <html lang="de">
      <body
        className={`${inter.className} dark mx-auto w-full max-w-screen-lg p-4`}
      >
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
  );
}
