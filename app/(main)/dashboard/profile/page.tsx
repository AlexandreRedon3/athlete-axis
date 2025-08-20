// app/(main)/dashboard/profile/page.tsx
import { headers } from "next/headers";

import { CoachProfile } from "@/components/coach/profile/coach-profile";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "@/lib/theme-provider";
import { User } from "@/db";

export default async function ProfilePage() {
  const data = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  const user = data.data?.user ?? null;
  console.log(user);

  return (
    <ThemeProvider>
      <div className="p-6">
        <CoachProfile user={user as User} />
      </div>
    </ThemeProvider>
  );
} 