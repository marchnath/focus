"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { formatDate } from "@/lib/utils";
import { ClockIcon } from "@radix-ui/react-icons";

export default function RemindersCard() {
  const { reminders, setActiveNoteCard } = useEnhancedStore();

  const handleCardClick = () => {
    // Always open reminders view directly
    const remindersCardData = {
      id: "reminders",
      name: "Reminders",
      items: reminders.map((reminder) => ({
        id: reminder.id,
        text: reminder.text,
        date: reminder.date,
        time: reminder.time,
        archived: false,
      })),
    };
    setActiveNoteCard(remindersCardData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const itemCount = reminders.length;

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`group relative h-full flex flex-col overflow-hidden cursor-pointer rounded-2xl border transition-all select-none outline-none bg-gradient-to-br from-white to-gray-50 border-[var(--gray)] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-orange-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Reminder Icon */}
      <div className="absolute top-2 right-2 ">
        <ClockIcon className="w-4 h-4 text-gray-400 " />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-sm">No reminders</p>
        ) : (
          <div className="h-full divide-y divide-gray-200/70">
            {reminders.slice(-3).map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-800 py-1.5"
              >
                <p className="truncate">{reminder.text}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <span>
                    {formatDate(reminder.date)} at {reminder.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gradient-to-r from-gray-50 to-gray-100/80 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 truncate">Schedules</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </motion.div>
  );
}
