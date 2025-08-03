"use client";

import { useAuth } from "@/lib/auth/AuthProvider";

export const useUserProfile = () => {
  const { user, loading } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return null;

    // Try to get full name from user metadata
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }

    // Try to get name from user metadata (some OAuth providers use 'name')
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }

    // Fallback to email username
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  const getUserAvatar = () => {
    if (!user) return null;

    // Try different avatar URL properties
    return (
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    );
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (!displayName) return "U";

    const nameParts = displayName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  };

  return {
    user,
    loading,
    displayName: getUserDisplayName(),
    avatar: getUserAvatar(),
    initials: getUserInitials(),
    email: user?.email || null,
    isAuthenticated: !!user,
  };
};
