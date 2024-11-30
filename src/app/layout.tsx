import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { twMerge } from "tailwind-merge";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <TRPCReactProvider>
        <body className="flex min-h-screen flex-col">
          <Navigation className="flex-shrink-0" />
          <div className="grid flex-1">{children}</div>
        </body>
      </TRPCReactProvider>
    </html>
  );
}

function Navigation(props: { className?: string }) {
  return (
    <header
      className={twMerge(
        "flex h-16 flex-row items-center justify-center border-b border-gray-200",
        props.className,
      )}
    >
      Navigagion
    </header>
  );
}
