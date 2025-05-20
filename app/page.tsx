// app/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import LandingPage from "./(landing)/page";

export default async function Page() {
  const session = await getSession();

  if (session?.data?.user) {
    if (session.data.user.isPro) redirect("/dashboard/coach");
    else redirect("/dashboard/coache");
  }

  // Sinon, afficher la landing page
  return <LandingPage />;
}