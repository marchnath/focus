"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import ActionMenu from "./ActionMenu";
import { parseSmartReminder } from "@/lib/utils";
import NoteItem from "./noteItem";
import {
  ArrowLeftIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export default function NoteCardView() {
  const {
    activeNoteCard,
    clearActiveNoteCard,
    addNoteItem,
    deleteNoteItem,
    editNoteItem,
    renameNoteCard,
    addKeepItem,
    editKeepItem,
    deleteKeepItem,
    addReminder,
    editReminder,
    deleteReminder,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    addGoal,
    editGoal,
    deleteGoal,
    toggleGoal,
    archiveGoal,
    editingItemId,
    setEditingItemId,
    clearEditingItemId,
    toggleItemSelection,
    isActionMenuOpen,
    toggleActionMenu,
    closeActionMenu,
    openSelectionMode,
    selectedItems,
    keepItems,
    reminders,
    todos,
    goals,
  } = useEnhancedStore();

  const [inputValue, setInputValue] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddItem(e);
    }
  };

  // Handle background clicks to close action menu
  const handleBackgroundClick = () => {
    if (isActionMenuOpen) {
      closeActionMenu();
    }
  };

  useEffect(() => {
    if (activeNoteCard) {
      setTitleValue(activeNoteCard.name);
      // Auto-focus title if it's empty (new card)
      if (!activeNoteCard.name) {
        setIsEditingTitle(true);
      }
    }
  }, [activeNoteCard]);

  if (!activeNoteCard) return null;

  const isKeepCard = activeNoteCard.id === "keep";
  const isRemindersCard = activeNoteCard.id === "reminders";
  const isTodosCard = activeNoteCard.id === "todos";
  const isGoalsCard = activeNoteCard.id === "goals";

  // Use actual data from store for special cards
  let activeItems;
  if (isKeepCard) {
    activeItems = keepItems.filter((item) => !item.archived);
  } else if (isRemindersCard) {
    activeItems = reminders;
  } else if (isTodosCard) {
    activeItems = todos;
  } else if (isGoalsCard) {
    activeItems = goals?.filter((goal) => !goal.archived) || [];
  } else {
    activeItems = activeNoteCard.items.filter((item) => !item.archived);
  }

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (isKeepCard) {
        await addKeepItem(inputValue.trim());
      } else if (isRemindersCard) {
        // Use smart reminder parsing for reminders
        const parsed = parseSmartReminder(inputValue.trim());
        await addReminder({
          text: parsed.text,
          date: parsed.date,
          time: parsed.time,
        });
      } else if (isTodosCard) {
        await addTodo(inputValue.trim());
      } else if (isGoalsCard) {
        await addGoal(inputValue.trim());
      } else {
        await addNoteItem(activeNoteCard.id, inputValue.trim());
      }
      setInputValue("");

      // Reset textarea height after clearing input
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "48px";
      }
    }
  };

  const handleTitleSave = async () => {
    if (
      titleValue.trim() &&
      !isKeepCard &&
      !isRemindersCard &&
      !isTodosCard &&
      !isGoalsCard
    ) {
      await renameNoteCard(activeNoteCard.id, titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }
    if (e.key === "Escape") {
      setTitleValue(activeNoteCard.name);
      setIsEditingTitle(false);
    }
  };

  const handleLongPress = (itemId) => {
    openSelectionMode(itemId);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-200  z-50 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={handleBackgroundClick}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              closeActionMenu();
              clearActiveNoteCard();
            }}
            className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {isEditingTitle && !isKeepCard && !isRemindersCard ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none text-center"
              placeholder="Enter card name"
              autoFocus
            />
          ) : (
            <h1
              className={`text-lg font-semibold text-gray-900  transition-colors ${
                !isKeepCard && !isRemindersCard
                  ? "cursor-pointer hover:text-[var(--primary)]"
                  : ""
              }`}
              onClick={() => {
                if (!isKeepCard && !isRemindersCard) {
                  setIsEditingTitle(true);
                }
              }}
            >
              {titleValue || "Untitled"}
            </h1>
          )}

          <button className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors">
            <DotsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hide bg-white m-2 rounded-2xl py-4 pb-24"
          onClick={(e) => e.stopPropagation()}
        >
          {activeItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No items yet</p>
              <p className="text-sm">Add your first item below</p>
            </div>
          ) : (
            <div className="space-y-0">
              {activeItems.map((item, index) => (
                <NoteItem
                  key={item.id}
                  item={item}
                  index={index}
                  onLongPress={handleLongPress}
                  isSelected={selectedItems.includes(item.id)}
                  showSelection={isActionMenuOpen}
                  totalItems={activeItems.length}
                  isReminder={isRemindersCard}
                  isKeep={isKeepCard}
                  isTodo={isTodosCard}
                  isGoal={isGoalsCard}
                  cardId={
                    !isKeepCard &&
                    !isRemindersCard &&
                    !isTodosCard &&
                    !isGoalsCard
                      ? activeNoteCard.id
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Input Field */}
        {!isActionMenuOpen && (
          <div
            className="p-2 border-t border-[var(--gray)]    "
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddItem} className="flex items-end space-x-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  isRemindersCard
                    ? "e.g Chemistry test tomorrow at 2pm"
                    : "Add new item..."
                }
                className="flex-1 p-3  bg-white  rounded-3xl border border-[var(--gray)]  focus:outline-none text-gray-900  placeholder-gray-500 resize-none overflow-y-auto min-h-[48px] max-h-[144px] scrollbar-hide"
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
                className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim()}
              >
                <PlusIcon className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        )}

        {/* Action Menu */}
        <ActionMenu />
      </motion.div>
    </AnimatePresence>
  );
}
