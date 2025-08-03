"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { truncateText } from "@/lib/utils";

export default function GoalsCard() {
  const { goals, setActiveNoteCard } = useEnhancedStore();

  const activeGoals = goals?.filter((goal) => !goal.archived) || [];
  const previewGoals = activeGoals.slice(-3);

  const handleCardClick = () => {
    // Always open goals view directly
    const goalsCardData = {
      id: "goals",
      name: "Goals",
      items: goals || [],
    };
    setActiveNoteCard(goalsCardData);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border cursor-pointer hover:shadow-md transition-all overflow-hidden h-full flex flex-col border-[var(--gray)] relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Goal Icon */}
      <div className="absolute top-3 right-3  text-gray-400">!</div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {previewGoals.length === 0 ? (
          <p className="text-gray-500 text-sm">No goals set</p>
        ) : (
          <div className="space-y-2 h-full">
            {previewGoals.map((goal, goalIndex) => (
              <motion.div
                key={goal.id}
                className="text-sm text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: goalIndex * 0.1 }}
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
      <div className="border-t border-[var(--gray)] bg-gray-100  px-4 py-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 ">Goals</h3>
      </div>
    </motion.div>
  );
}
