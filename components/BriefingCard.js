"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getUpcomingReminder } from "@/lib/utils";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DrawingPinIcon,
} from "@radix-ui/react-icons";

export default function BriefingCard() {
  const { todos, reminders, addTodo, toggleTodo } = useStore();

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const upcomingReminder = getUpcomingReminder(reminders);
  const canAddTodos = todos.length < 3;
  const shouldShowExpansion = todos.length > 3;
  const displayTodos = isExpanded ? todos : todos.slice(0, 3);

  const handleCardClick = () => {
    if (canAddTodos && !isAddingTodo) {
      setIsAddingTodo(true);
    } else if (shouldShowExpansion) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim() && todos.length < 3) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
      // Keep adding mode active if there's still space for more todos
      if (todos.length + 1 >= 3) {
        setIsAddingTodo(false);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsAddingTodo(false);
      setNewTodoText("");
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={` rounded-xl relative bg-white cursor-pointer hover:shadow-md transition-all `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: "16px", marginBottom: "12px" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pin Icon */}
      <div className="absolute top-3 right-3">
        <DrawingPinIcon className="w-4 h-4 text-gray-400 " />
      </div>
      <div className="flex items-center justify-between mb-3">
        {shouldShowExpansion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            )}
          </motion.div>
        )}
      </div>

      {/* Todos Section */}
      <div className="space-y-2 mb-4">
        {displayTodos.length === 0 && !isAddingTodo ? (
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingTodo(true);
            }}
          >
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            <span className="text-sm text-gray-400">Add a must do...</span>
          </motion.div>
        ) : (
          <>
            {displayTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTodo(todo.id);
                }}
              >
                <button
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-[var(--primary)] border-[var(--primary)]"
                      : "border-gray-300 hover:border-[var(--primary)]"
                  }`}
                >
                  {todo.completed && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
                <span
                  className={`text-sm ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900 "
                  }`}
                >
                  {todo.text}
                </span>
              </motion.div>
            ))}

            {/* Add new todo input */}
            {isAddingTodo && canAddTodos && (
              <motion.form
                onSubmit={handleAddTodo}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  onBlur={() => {
                    if (!newTodoText.trim()) {
                      setIsAddingTodo(false);
                    }
                  }}
                  placeholder="Add a must do..."
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900  placeholder-gray-400"
                  autoFocus
                />
              </motion.form>
            )}

            {!isExpanded && todos.length > 3 && (
              <p className="text-xs text-gray-500 mt-2">
                +{todos.length - 3} more todos
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
