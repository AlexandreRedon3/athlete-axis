import { headers } from "next/headers";

import { CoachProfile } from "@/components/coach/profile/coach-profile";
import { User } from "@/db";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "@/lib/theme-provider";

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