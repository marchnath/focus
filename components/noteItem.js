"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { parseSmartReminder, formatDate } from "@/lib/utils";

export default function NoteItem({
  item,
  index,
  onLongPress,
  isSelected,
  showSelection,
  totalItems,
  isReminder = false,
  cardId,
  isKeep = false,
  isTodo = false,
  isGoal = false,
}) {
  const {
    editingItemId,
    setEditingItemId,
    clearEditingItemId,
    editNoteItem,
    editKeepItem,
    editReminder,
    editTodo,
    toggleTodo,
    editGoal,
    toggleGoal,
    toggleItemSelection,
  } = useEnhancedStore();
  const longPressTimer = useRef();
  const [editText, setEditText] = useState(item.text);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef();
  // Remove the require since we imported at the top

  const isCurrentlyEditing = editingItemId === item.id || isEditing;

  // Auto-resize textarea when editing starts
  useEffect(() => {
    if (isCurrentlyEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
      // Set cursor to end of text
      const textLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(textLength, textLength);
      textareaRef.current.focus();
    }
  }, [isCurrentlyEditing]);

  const handlePointerDown = (e) => {
    if (showSelection || isCurrentlyEditing) return;

    // Only start long press timer for touch events
    if (e.pointerType === "touch") {
      longPressTimer.current = setTimeout(() => {
        onLongPress(item.id);
      }, 500);
    }
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (showSelection) {
      // In selection mode, clicking should toggle selection
      toggleItemSelection(item.id);
      return;
    }

    if (!isCurrentlyEditing) {
      // For touch devices, only start editing on long press
      // For pointer devices, single click starts editing
      if (e.pointerType !== "touch") {
        setIsEditing(true);
        setEditingItemId(item.id);
      }
    }
  };

  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== item.text) {
      if (isKeep) {
        await editKeepItem(item.id, trimmedText);
      } else if (isReminder) {
        // For reminders, parse the text for smart updates
        const parsed = parseSmartReminder(trimmedText);
        await editReminder(item.id, parsed.text, parsed.date, parsed.time);
      } else if (isTodo) {
        await editTodo(item.id, trimmedText);
      } else if (isGoal) {
        await editGoal(item.id, trimmedText);
      } else if (cardId) {
        await editNoteItem(cardId, item.id, trimmedText);
      }
    }
    setIsEditing(false);
    clearEditingItemId();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    clearEditingItemId();
    setEditText(item.text); // Reset to original text
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <motion.div
      className={`relative transition-colors select-none ${
        isSelected
          ? "bg-orange-50 "
          : index % 2 === 0
          ? "bg-white "
          : "bg-gray-50 "
      } ${showSelection ? "cursor-pointer" : "cursor-text"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onClick={handleClick}
    >
      {showSelection && (
        <div className="absolute top-2 right-6">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? "bg-gray-800 border-gray-800"
                : "border-gray-300 bg-white "
            }`}
          >
            {isSelected && (
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        </div>
      )}

      {isReminder ? (
        <div
          className={`flex items-start justify-between p-4 ${
            showSelection ? "pr-12" : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            {isCurrentlyEditing ? (
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-gray-900  mb-1 resize-none overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  height: "auto",
                  minHeight: "20px",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            ) : (
              <p className="text-gray-900  mb-1 cursor-text break-words whitespace-pre-wrap">
                {item.text}
              </p>
            )}
            {item.date && item.time && (
              <p className="text-xs text-gray-500 break-words">
                {formatDate(item.date)} at {item.time}
              </p>
            )}
          </div>
        </div>
      ) : isTodo ? (
        <div className={`flex items-start p-4 ${showSelection ? "pr-12" : ""}`}>
          <div
            className={`w-4 h-4 rounded border-2 mr-3 mt-0.5 flex items-center justify-center cursor-pointer ${
              item.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTodo(item.id);
            }}
          >
            {item.completed && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isCurrentlyEditing ? (
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-gray-900  resize-none overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  height: "auto",
                  minHeight: "20px",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            ) : (
              <p
                className={`cursor-text break-words whitespace-pre-wrap w-full ${
                  item.completed
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {item.text}
              </p>
            )}
          </div>
        </div>
      ) : isGoal ? (
        <div className={`flex items-start p-4 ${showSelection ? "pr-12" : ""}`}>
          <div
            className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center cursor-pointer ${
              item.completed ? "bg-gray-800 border-gray-800" : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleGoal(item.id);
            }}
          >
            {item.completed && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isCurrentlyEditing ? (
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-gray-900  resize-none overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                  height: "auto",
                  minHeight: "20px",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            ) : (
              <div>
                <p
                  className={`cursor-text break-words whitespace-pre-wrap w-full ${
                    item.completed
                      ? "line-through text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {item.text}
                </p>
                {item.deadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {item.deadline}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`flex items-start text-gray-900 p-4 ${
            showSelection ? "pr-12" : ""
          }`}
        >
          {isCurrentlyEditing ? (
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-gray-900  resize-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                height: "auto",
                minHeight: "20px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          ) : (
            <p className="cursor-text break-words whitespace-pre-wrap w-full">
              {item.text}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
