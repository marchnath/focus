"use client";

import { useUserProfile } from "@/lib/hooks/useUserProfile";

export default function WelcomeMessage() {
  const { isAuthenticated, displayName } = useUserProfile();

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white p-4 rounded-2xl mb-4">
        <h2 className="text-lg font-semibold mb-1">Welcome to Nottifly!</h2>
        <p className="text-sm opacity-90">
          Sign in to sync your notes and reminders across all your devices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white p-4 rounded-2xl mb-4">
      <h2 className="text-lg font-semibold mb-1">
        Welcome back, {displayName}!
      </h2>
      <p className="text-sm opacity-90">
        Your personal coaching app for motivation and productivity.
      </p>
    </div>
  );
}
