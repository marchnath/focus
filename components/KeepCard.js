"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { truncateText } from "@/lib/utils";
import { AiOutlineBulb } from "react-icons/ai";

export default function KeepCard() {
  const { keepItems, setActiveNoteCard } = useEnhancedStore();

  const activeItems = keepItems.filter((item) => !item.archived);
  const previewItems = activeItems.slice(-3);
  const itemCount = activeItems.length;

  const handleCardClick = () => {
    // Always open keep view directly
    const keepCardData = {
      id: "keep",
      name: "Keep",
      items: keepItems,
    };
    setActiveNoteCard(keepCardData);
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
      {/* Idea Icon */}
      <div className="absolute top-2 right-2">
        <AiOutlineBulb className="w-4 h-4 text-gray-400 " />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {previewItems.length === 0 ? (
          <p className="text-gray-500 text-sm">No items yet</p>
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
        <h3 className="font-medium text-gray-900 truncate">Keep</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </motion.div>
  );
}
