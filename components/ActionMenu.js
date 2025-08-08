"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { CopyIcon, TrashIcon } from "@radix-ui/react-icons";

export default function ActionMenu() {
  const {
    isActionMenuOpen,
    selectedItems,
    closeActionMenu,
    deleteNoteItem,
    deleteNoteCard,
    deleteKeepItem,
    deleteReminder,
    deleteTodo,
    deleteGoal,
    activeNoteCard,
    noteCards,
    copySelectedItems,
  } = useEnhancedStore();

  if (!isActionMenuOpen || selectedItems.length === 0) return null;

  // Determine if we're in note card view or home page
  const isInNoteCardView = !!activeNoteCard;

  // Check if selected items are note cards (from home page) or note items
  const selectedNoteCards = noteCards.filter((card) =>
    selectedItems.includes(card.id)
  );
  const isSelectingNoteCards =
    selectedNoteCards.length > 0 && !isInNoteCardView;

  const isKeepCard = activeNoteCard?.id === "keep";
  const isRemindersCard = activeNoteCard?.id === "reminders";
  const isTodosCard = activeNoteCard?.id === "todos";
  const isGoalsCard = activeNoteCard?.id === "goals";

  const actions = [
    { icon: CopyIcon, label: "Copy", action: "copy" },
    { icon: TrashIcon, label: "Delete", action: "delete" },
  ];

  const handleAction = async (action) => {
    switch (action) {
      case "copy":
        copySelectedItems();
        break;
      case "delete":
        if (isSelectingNoteCards) {
          // Delete note cards
          for (const cardId of selectedItems) {
            await deleteNoteCard(cardId);
          }
        } else if (isKeepCard) {
          // Delete keep items
          for (const itemId of selectedItems) {
            await deleteKeepItem(itemId);
          }
        } else if (isRemindersCard) {
          // Delete reminders
          for (const itemId of selectedItems) {
            await deleteReminder(itemId);
          }
        } else if (isTodosCard) {
          // Delete todos
          for (const itemId of selectedItems) {
            await deleteTodo(itemId);
          }
        } else if (isGoalsCard) {
          // Delete goals
          for (const itemId of selectedItems) {
            await deleteGoal(itemId);
          }
        } else if (activeNoteCard) {
          // Delete note items
          for (const itemId of selectedItems) {
            await deleteNoteItem(activeNoteCard.id, itemId);
          }
        }
        break;
    }
    closeActionMenu();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0  right-0 bg-white pt-4 pb-2   z-60"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex justify-around">
            {actions.map((action, index) => (
              <motion.button
                key={action.action}
                onClick={() => handleAction(action.action)}
                className="flex flex-col items-center space-y-1  rounded-xl hover:bg-[var(--gray)] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <action.icon className="w-6 h-6 text-gray-600 " />
                <span className="text-xs text-gray-600 ">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
