"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { truncateText } from "@/lib/utils";
import { useRef } from "react";

export default function NoteCard({ card, index }) {
  const {
    setActiveNoteCard,
    toggleActionMenu,
    toggleItemSelection,
    isActionMenuOpen,
    selectedItems,
  } = useStore();

  const activeItems = card.items.filter((item) => !item.archived);
  const previewItems = activeItems.slice(-3);
  const longPressTimer = useRef();
  const isSelected = selectedItems.includes(card.id);
  const itemCount = activeItems.length;

  const handleCardClick = () => {
    if (isActionMenuOpen) {
      toggleItemSelection(card.id);
    } else {
      // Always open the note card view directly
      setActiveNoteCard(card);
    }
  };

  const handleLongPress = () => {
    // Open selection mode and select this card
    if (!isActionMenuOpen) {
      toggleActionMenu();
    }
    toggleItemSelection(card.id);
  };

  const handlePointerDown = (e) => {
    // Only start long press timer for touch events or when not already in selection mode
    if (e.pointerType === "touch" || !isActionMenuOpen) {
      longPressTimer.current = setTimeout(() => {
        handleLongPress();
      }, 500);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleKeyDown = (e) => {
    // Accessible interactions for keyboard users
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      className={`group relative h-full flex flex-col overflow-hidden cursor-pointer rounded-2xl border transition-all select-none outline-none bg-gradient-to-br from-white to-gray-50 ${
        isSelected
          ? "ring-2 ring-orange-400/60 ring-offset-1 ring-offset-orange-50 border-orange-300 bg-orange-50"
          : "border-[var(--gray)]"
      }  hover:shadow-lg focus-visible:ring-2 focus-visible:ring-orange-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActionMenuOpen && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shadow-sm transition-colors ${
              isSelected
                ? "bg-orange-500 border-orange-500"
                : "bg-white/70 backdrop-blur border-gray-300"
            }`}
          >
            {isSelected ? (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                className="h-3.5 w-3.5 text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <path
                  d="M5 10.5l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <span className="block h-1.5 w-1.5 rounded-full bg-gray-300" />
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`p-4 flex-1 overflow-hidden ${
          isActionMenuOpen ? "pr-10" : ""
        }`}
      >
        {previewItems.length === 0 ? (
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-gray-400"
            >
              <path
                d="M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 9h8M8 12h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>No items yet</p>
          </div>
        ) : (
          <div className="space-y-2 h-full">
            {previewItems.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                className="text-sm text-gray-800 flex items-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: itemIndex * 0.05 }}
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="truncate">{truncateText(item.text, 60)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gradient-to-r from-gray-50 to-gray-100/80 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 truncate">
          {card.name || "Untitled"}
        </h3>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </motion.div>
  );
}
