import type { Metadata } from "next";
import "./globals.css";
import Providers from "../src/context/providers";
import { cn } from "../src/lib/utils";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { SidebarProvider } from "../components/ui/sidebar";
import { cookies } from "next/headers";
import { ourFileRouter } from "../app/api/uploadthing/core";
import { NuqsAdapter } from "nuqs/adapters/next";
import NextTopLoader from "nextjs-toploader";

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
      <body
        className={cn("min-h-screen font-sans antialiased bg-background text-foreground", inter.variable)}
      >
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <div vaul-drawer-wrapper="">
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
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}