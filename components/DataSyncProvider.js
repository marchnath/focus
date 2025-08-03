"use client";

import { useEffect } from "react";
import { useDataSync } from "@/lib/hooks/useDataSync";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * This component handles automatic data synchronization with Supabase
 * It should be included in the main app to ensure data is loaded when user logs in
 */
export default function DataSyncProvider({ children }) {
  const { loadUserData } = useDataSync();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Load user data when authentication completes and user is available
    if (!loading && user?.id) {
      loadUserData();
    }
  }, [loading, user?.id, loadUserData]);

  return children;
}
