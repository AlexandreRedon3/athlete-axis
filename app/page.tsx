// app/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import LandingPage from "./(landing)/page";

export default async function Page() {
  return <LandingPage />;
}