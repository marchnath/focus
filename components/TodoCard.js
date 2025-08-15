"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { CheckIcon } from "@radix-ui/react-icons";
import { AiOutlineCheckSquare } from "react-icons/ai";

export default function TodoCard() {
  const { todos, setActiveNoteCard } = useEnhancedStore();

  const previewTodos = todos.slice(-3);
  const itemCount = todos.length;

  const handleCardClick = () => {
    // Always open todo view directly
    const todoCardData = {
      id: "todos",
      name: "Todos",
      items: todos.map((todo) => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        archived: false,
      })),
    };
    setActiveNoteCard(todoCardData);
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
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Todo Icon */}
      {/* <div className="absolute top-2 right-2  text-gray-400">
        <AiOutlineCheckSquare className="w-4 h-4" />
      </div> */}

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {previewTodos.length === 0 ? (
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <AiOutlineCheckSquare className="w-4 h-4 text-gray-400" />
            <p>No todos yet</p>
          </div>
        ) : (
          <div className="space-y-2 h-full">
            {previewTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                className="text-sm text-gray-800 flex items-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                <div
                  className={`mt-0.5 h-3 w-3 rounded-sm border flex items-center justify-center ${
                    todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {todo.completed && (
                    <CheckIcon className="w-2 h-2 text-white" />
                  )}
                </div>
                <span
                  className={`flex-1 truncate ${
                    todo.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gradient-to-r from-gray-50 to-gray-100/80 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 truncate">Todos</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </motion.div>
  );
}
