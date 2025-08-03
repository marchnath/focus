"use client";

import { useAuth } from "@/lib/auth/AuthProvider";

export const useUserData = () => {
  const { user } = useAuth();

  // Simple hook that just returns user authentication status
  // All data persistence is handled by Zustand's built-in persistence
  const isAuthenticated = !!user;
  const userId = user?.id || null;

  return {
    isAuthenticated,
    userId,
    // For backward compatibility, provide empty sync functions
    saveUserData: async () => {},
    loadUserData: async () => null,
    syncing: false,
    lastSyncTime: null,
  };
};
