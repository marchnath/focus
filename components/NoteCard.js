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

  return (
    <motion.div
      onClick={handleCardClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`bg-white  rounded-2xl border cursor-pointer hover:shadow-md transition-all overflow-hidden relative h-full flex flex-col ${
        isSelected ? "border-orange-500 bg-orange-50 " : "border-[var(--gray)]"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActionMenuOpen && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              isSelected ? "bg-orange-500 border-orange-500" : "border-gray-300"
            }`}
          >
            {isSelected && (
              <motion.div
                className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={`p-4 flex-1 overflow-hidden ${
          isActionMenuOpen ? "pr-8" : ""
        }`}
      >
        {previewItems.length === 0 ? (
          <p className="text-gray-500 text-sm">No items yet</p>
        ) : (
          <div className="space-y-2 h-full">
            {previewItems.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                className="text-sm text-gray-700 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: itemIndex * 0.05 }}
              >
                {truncateText(item.text, 60)}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gray-100 px-4 py-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 ">
          {card.name || "Untitled"}
        </h3>
      </div>
    </motion.div>
  );
}
