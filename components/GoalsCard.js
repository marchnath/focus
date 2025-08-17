"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { truncateText } from "@/lib/utils";

export default function GoalsCard() {
  const { goals, setActiveNoteCard } = useEnhancedStore();

  const activeGoals = goals?.filter((goal) => !goal.archived) || [];
  const previewGoals = activeGoals.slice(-3);
  const itemCount = activeGoals.length;

  const handleCardClick = () => {
    // Always open goals view directly
    const goalsCardData = {
      id: "goals",
      name: "Goals",
      items: goals || [],
    };
    setActiveNoteCard(goalsCardData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`group relative h-full flex flex-col overflow-hidden cursor-pointer rounded-2xl border transition-all select-none outline-none bg-gradient-to-br from-white to-gray-50 border-[var(--gray)] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-orange-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Goal Icon */}
      <div className="absolute top-2 right-2  text-gray-400">!</div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {previewGoals.length === 0 ? (
          <p className="text-gray-500 text-sm">No goals set</p>
        ) : (
          <div className="h-full divide-y divide-gray-200/70">
            {previewGoals.map((goal, goalIndex) => (
              <motion.div
                key={goal.id}
                className="text-sm text-gray-800 py-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: goalIndex * 0.08 }}
              >
                <div
                  className={`font-medium truncate ${
                    goal.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {truncateText(goal.text, 40)}
                </div>
                {goal.deadline && (
                  <div className="text-xs text-gray-500 mt-1">
                    Due: {goal.deadline}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gradient-to-r from-gray-50 to-gray-100/80 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 truncate">Goals</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </motion.div>
  );
}
