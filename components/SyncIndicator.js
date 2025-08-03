"use client";

import { useUserData } from "@/lib/hooks/useUserData";
import { CheckIcon } from "@radix-ui/react-icons";

export default function SyncIndicator() {
  const { syncing, lastSyncTime } = useUserData();

  if (!syncing && !lastSyncTime) return null;

  return (
    <div className="fixed bottom-4 left-4 z-30">
      <div className="bg-white  rounded-full px-3 py-2 shadow-lg border border-gray-200  flex items-center space-x-2">
        {syncing ? (
          <>
            <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-600 ">Syncing...</span>
          </>
        ) : (
          <>
            <CheckIcon className="w-3 h-3 text-green-600" />
            <span className="text-xs text-gray-600 ">
              Synced{" "}
              {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : ""}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
