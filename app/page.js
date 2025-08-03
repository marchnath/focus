"use client";

import { useEffect } from "react";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDataSync } from "@/lib/hooks/useDataSync";
import DataSyncProvider from "@/components/DataSyncProvider";
import TopBar from "@/components/TopBar";
import MenuSlider from "@/components/MenuSlider";
import WelcomeMessage from "@/components/WelcomeMessage";
import TodoCard from "@/components/TodoCard";
import GoalsCard from "@/components/GoalsCard";
import RemindersCard from "@/components/RemindersCard";
import KeepCard from "@/components/KeepCard";
import NoteCard from "@/components/NoteCard";
import AuthLoading from "@/components/AuthLoading";
import ActionMenu from "@/components/ActionMenu";
import NoteCardView from "@/components/NoteCardView";
import { motion } from "framer-motion";

export default function Home() {
  const {
    noteCards,
    activeNoteCard,
    isDarkMode,
    isActionMenuOpen,
    closeActionMenu,
  } = useEnhancedStore();

  const { loading } = useAuth();

  // Enable data synchronization
  useDataSync();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Show loading screen while authentication is being checked
  if (loading) {
    return <AuthLoading />;
  }

  // Close action menu when clicking outside
  const handleBackgroundClick = (e) => {
    // Only close action menu if it's open
    if (e.target === e.currentTarget && isActionMenuOpen) {
      closeActionMenu();
    }
  };

  return (
    <DataSyncProvider>
      <div
        className="min-h-screen bg-[var(--bg)] pb-32"
        onClick={handleBackgroundClick}
      >
        <TopBar />
        <MenuSlider />

        <main className="px-4 py-2">
          {/* Simple Grid Layout */}
          <div className="max-w-md mx-auto space-y-4">
            {/* Welcome Message */}
            {/* <div onClick={(e) => e.stopPropagation()}>
            <WelcomeMessage />
          </div> */}

            {/* Main Grid Layout with 4 permanent cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Todo Card */}
              <div onClick={(e) => e.stopPropagation()} className="h-[180px]">
                <TodoCard />
              </div>

              {/* Goals Card */}
              <div onClick={(e) => e.stopPropagation()} className="h-[180px]">
                <GoalsCard />
              </div>

              {/* Reminders Card */}
              <div onClick={(e) => e.stopPropagation()} className="h-[180px]">
                <RemindersCard />
              </div>

              {/* Keep Card */}
              <div onClick={(e) => e.stopPropagation()} className="h-[180px]">
                <KeepCard />
              </div>

              {/* Note Cards */}
              {noteCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 4) * 0.1 }}
                  className="w-full h-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NoteCard card={card} index={index + 4} />
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Action Menu */}
        <ActionMenu />

        {/* Note Card View (Modal) */}
        {activeNoteCard && <NoteCardView />}
      </div>
    </DataSyncProvider>
  );
}
