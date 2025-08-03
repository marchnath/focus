"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { formatDate } from "@/lib/utils";
import { ClockIcon, BellIcon } from "@radix-ui/react-icons";

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

  return (
    <motion.div
      onClick={handleCardClick}
      className={`bg-white  rounded-2xl border cursor-pointer  transition-all h-full flex flex-col overflow-hidden border-[var(--gray)] relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Reminder Icon */}
      <div className="absolute top-3 right-3 ">
        <ClockIcon className="w-4 h-4 text-gray-400 " />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-sm">No reminders</p>
        ) : (
          <div className="space-y-3 h-full">
            {reminders.slice(-3).map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-gray-900  mb-1">{reminder.text}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
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
      <div className="border-t border-[var(--gray)] bg-gray-100  px-4 py-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 ">Schedules</h3>
      </div>
    </motion.div>
  );
}
