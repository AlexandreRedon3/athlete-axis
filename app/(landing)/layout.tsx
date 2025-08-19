"use client";

import "../globals.css";

import { Inter } from "next/font/google";

// Define the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen font-sans antialiased ${inter.variable}`}>
      {children}
    </div>
  );
} 