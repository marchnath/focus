"use client";

import { useEffect } from "react";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDataSync } from "@/lib/hooks/useDataSync";
import DataSyncProvider from "@/components/DataSyncProvider";
import TopBar from "@/components/TopBar";
import MenuSlider from "@/components/MenuSlider";

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

  // Close menu on Escape for quick keyboard dismissal
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isActionMenuOpen) {
        closeActionMenu();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActionMenuOpen, closeActionMenu]);

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

  // Tiny date label for subtle header
  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(today);

  // Animation variants for a gentle stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DataSyncProvider>
      <div
        className="relative min-h-screen bg-[var(--bg)] pb-32 overflow-hidden"
        onClick={handleBackgroundClick}
      >
        <TopBar />
        <MenuSlider />

        <main className="px-3 sm:px-4 py-3">
          <div className="max-w-xl sm:max-w-2xl mx-auto space-y-4">
            {/* Subtle page header */}
            <div className="px-1" onClick={(e) => e.stopPropagation()}>
              <p className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {dateLabel}
              </p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Your Focus
              </h1>
            </div>

            {/* Main Grid Layout with 4 permanent cards + dynamic notes */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-4 sm:gap-5"
            >
              {/* Todo Card */}
              <motion.div
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="h-[180px]"
              >
                <TodoCard />
              </motion.div>

              {/* Goals Card */}
              <motion.div
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="h-[180px]"
              >
                <GoalsCard />
              </motion.div>

              {/* Reminders Card */}
              <motion.div
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="h-[180px]"
              >
                <RemindersCard />
              </motion.div>

              {/* Keep Card */}
              <motion.div
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="h-[180px]"
              >
                <KeepCard />
              </motion.div>

              {/* Note Cards */}
              {noteCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  className="w-full h-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NoteCard card={card} index={index + 4} />
                </motion.div>
              ))}
            </motion.div>
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
