"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { detectReminderIntent, parseSmartReminder } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";

export default function InputField() {
  const {
    addTodo,
    addReminder,
    addKeepItem,
    addNoteItem,
    activeCard,
    clearActiveCard,
    isActionMenuOpen,
    todos,
    noteCards,
  } = useEnhancedStore();
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    if (activeCard) {
      switch (activeCard) {
        case "todos":
          if (todos.length < 3) {
            addTodo(trimmedValue);
          } else {
            alert("You can only have 3 todos at a time!");
            return;
          }
          break;
        case "reminders":
          // For reminder card, use the improved smart reminder parsing
          const parsedReminder = parseSmartReminder(trimmedValue);
          await addReminder({
            text: parsedReminder.text,
            date: parsedReminder.date,
            time: parsedReminder.time,
          });
          break;
        case "keep":
          await addKeepItem(trimmedValue);
          break;
        default:
          // It's a note card ID
          const noteCard = noteCards.find((card) => card.id === activeCard);
          if (noteCard) {
            await addNoteItem(noteCard.id, trimmedValue);
          }
          break;
      }
    } else {
      // No active card - use smart detection
      const reminderIntent = detectReminderIntent(trimmedValue);

      if (reminderIntent.isReminder) {
        await addReminder({
          text: reminderIntent.text,
          date: reminderIntent.date,
          time: reminderIntent.time,
        });
      } else {
        // Add to keep by default
        await addKeepItem(trimmedValue);
      }
    }

    setInputValue("");
    clearActiveCard();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  if (isActionMenuOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--gray)] p-4 z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleFormSubmit}
            className="flex items-end space-x-3"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeCard === "briefing"
                  ? "Add a todo..."
                  : activeCard === "reminders"
                  ? "Add a reminder..."
                  : activeCard === "keep"
                  ? "Add to keep..."
                  : activeCard
                  ? `Add to ${
                      noteCards.find((c) => c.id === activeCard)?.name || "note"
                    }...`
                  : "Type something..."
              }
              className="flex-1 p-3 bg-[var(--bg)] rounded-full border border-[var(--gray)] focus:border-[var(--primary)] focus:outline-none text-gray-900  placeholder-gray-500 resize-none overflow-y-auto min-h-[48px] max-h-[144px]"
              rows={1}
              style={{
                height: "auto",
                minHeight: "48px",
                maxHeight: "144px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 144) + "px";
              }}
            />
            <motion.button
              type="submit"
              className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!inputValue.trim()}
            >
              <PlusIcon className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
