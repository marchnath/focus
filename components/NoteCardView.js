"use client";

import { useState, useEffect, useRef } from "react";
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

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

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
      } else {
        // Auto-activate new item input when opening a note
        setIsAddingNewItem(true);
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

  const handleAddItem = async (text) => {
    if (text.trim()) {
      if (isKeepCard) {
        await addKeepItem(text.trim());
      } else if (isRemindersCard) {
        // Use smart reminder parsing for reminders
        const parsed = parseSmartReminder(text.trim());
        await addReminder({
          text: parsed.text,
          date: parsed.date,
          time: parsed.time,
        });
      } else if (isTodosCard) {
        await addTodo(text.trim());
      } else if (isGoalsCard) {
        await addGoal(text.trim());
      } else {
        await addNoteItem(activeNoteCard.id, text.trim());
      }
      setIsAddingNewItem(false);
    }
  };

  const handleStartNewItem = () => {
    if (!isAddingNewItem) {
      setIsAddingNewItem(true);
    }
  };

  const handleCancelNewItem = () => {
    setIsAddingNewItem(false);
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
        className="fixed inset-0 z-50 flex flex-col bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={handleBackgroundClick}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-gray-100/70 bg-gray-100/90 border-b border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto max-w-2xl px-2 py-2 flex items-center justify-between">
            <button
              onClick={() => {
                closeActionMenu();
                clearActiveNoteCard();
              }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Back"
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
                className="text-base font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-[var(--primary)] outline-none text-center px-2 py-0.5 rounded"
                placeholder="Enter card name"
                autoFocus
              />
            ) : (
              <h1
                className={`text-base font-medium text-gray-900 transition-colors ${
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

            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="More options"
            >
              <DotsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hide bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-h-full">
            {activeItems.length === 0 && !isAddingNewItem ? (
              <div className="text-center text-gray-500 py-16 px-4">
                <p className="font-medium">No items yet</p>
                <p className="text-sm mt-1">
                  Start typing below to add your first item
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Existing items */}
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

                {/* New item being added at the bottom */}
                {isAddingNewItem && (
                  <NewItemEditor
                    onSave={handleAddItem}
                    onCancel={handleCancelNewItem}
                    placeholder={
                      isRemindersCard
                        ? "e.g Chemistry test tomorrow at 2pm"
                        : "Type your item here..."
                    }
                    index={activeItems.length}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Add Button - Always visible */}
        {!isActionMenuOpen && (
          <motion.button
            onClick={handleStartNewItem}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.25)] ring-4 ring-[var(--primary)]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            aria-label="Add item"
          >
            <PlusIcon className="w-6 h-6" />
          </motion.button>
        )}

        {/* Action Menu */}
        <ActionMenu />
      </motion.div>
    </AnimatePresence>
  );
}

// Component for editing new items inline
function NewItemEditor({ onSave, onCancel, placeholder, index }) {
  const [text, setText] = useState("");
  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Scroll to bottom to show the new item input
      setTimeout(() => {
        textareaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 100);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        onSave(text);
        setText("");
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      setText("");
    } else {
      onCancel();
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <motion.div
      className="relative transition-colors bg-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex items-start text-gray-900 p-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          onInput={handleInput}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none overflow-hidden p-0"
          style={{
            height: "auto",
            minHeight: "20px",
          }}
        />
      </div>
    </motion.div>
  );
}
