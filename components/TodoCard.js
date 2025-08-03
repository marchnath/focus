"use client";

import { motion } from "framer-motion";
import { useEnhancedStore } from "@/lib/hooks/useEnhancedStore";
import { CheckIcon } from "@radix-ui/react-icons";
import { AiOutlineCheckSquare } from "react-icons/ai";

export default function TodoCard() {
  const { todos, setActiveNoteCard } = useEnhancedStore();

  const previewTodos = todos.slice(-3);

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

  return (
    <motion.div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border cursor-pointer hover:shadow-md transition-all overflow-hidden h-full flex flex-col border-[var(--gray)] relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Todo Icon */}
      <div className="absolute top-3 right-3">
        <AiOutlineCheckSquare className="w-4 h-4 text-gray-400" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {previewTodos.length === 0 ? (
          <p className="text-gray-500 text-sm">No todos yet</p>
        ) : (
          <div className="space-y-2 h-full">
            {previewTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                className={`text-sm flex items-center space-x-2 ${
                  todo.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                    todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {todo.completed && (
                    <CheckIcon className="w-2 h-2 text-white" />
                  )}
                </div>
                <span className="flex-1 truncate">{todo.text}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--gray)] bg-gray-100  px-4 py-3 flex-shrink-0">
        <h3 className="font-medium text-gray-900 ">Todos</h3>
      </div>
    </motion.div>
  );
}
