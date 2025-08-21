import "./globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next";
import { extractRouterConfig } from "uploadthing/server";

import Providers from "../src/context/providers";
import { ourFileRouter } from "../src/lib/uploadthing/core";
import { cn } from "../src/lib/utils";

// Define the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Athlete-Axis",
  description: "Plateforme pour les athlètes et les coachs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", inter.variable)}>
        <Providers>
            <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <NuqsAdapter>
              <NextTopLoader
                height={3}
                color="#A594FF"
                showSpinner={false}
              />
              {children}
            </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}