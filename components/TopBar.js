"use client";

import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import AddNoteCardButton from "@/components/AddNoteCardButton";

export default function TopBar() {
  const { toggleMenu } = useStore();

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-[var(--bg)] sticky top-0 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={toggleMenu}
        className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HamburgerMenuIcon className="w-6 h-6" />
      </motion.button>

      <motion.h1
        className="text-xl font-semibold text-gray-900 "
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Nottifly
      </motion.h1>

      {/* Add Note Card Button */}
      <motion.div
        className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AddNoteCardButton />
      </motion.div>
      {/* <motion.button
        className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MagnifyingGlassIcon className="w-6 h-6" />
      </motion.button> */}
    </motion.div>
  );
}
