"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { truncateText } from "@/lib/utils";
import { AiOutlineBulb } from "react-icons/ai";

export default function KeepCard() {
  const { keepItems, setActiveNoteCard } = useEnhancedStore();

  const activeItems = keepItems.filter((item) => !item.archived);
  const previewItems = activeItems.slice(-3);

  const handleCardClick = () => {
    // Always open keep view directly
    const keepCardData = {
      id: "keep",
      name: "Keep",
      items: keepItems,
    };
    setActiveNoteCard(keepCardData);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`bg-white  rounded-2xl border cursor-pointer hover:shadow-md transition-all overflow-hidden h-full flex flex-col border-[var(--gray)] relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Idea Icon */}
      <div className="absolute top-3 right-3">
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
      <div className="border-t border-[var(--gray)] bg-gray-100  px-4 py-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 ">Keep</h3>
      </div>
    </motion.div>
  );
}
