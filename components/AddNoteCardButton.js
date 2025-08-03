"use client";

import { motion } from "framer-motion";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";

export default function AddNoteCardButton() {
  const { addNoteCard, setActiveNoteCard } = useEnhancedStore();

  const handleCreate = async () => {
    const newCard = await addNoteCard("");
    setActiveNoteCard(newCard);
  };

  return (
    <motion.button
      onClick={handleCreate}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Pencil2Icon className="w-6 h-6 text-gray-600 group-hover:text-[var(--primary)] transition-colors" />
    </motion.button>
  );
}
