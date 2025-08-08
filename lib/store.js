import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultNoteCards } from "./data/noteCards";

// Function to get user-specific storage key
const getUserStorageKey = () => {
  // For now, use a default key. This can be enhanced later to be user-specific
  return "focus-app-storage";
};

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Menu state
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),

      // Action menu state
      isActionMenuOpen: false,
      selectedItems: [],
      toggleActionMenu: () =>
        set((state) => ({ isActionMenuOpen: !state.isActionMenuOpen })),
      closeActionMenu: () =>
        set({ isActionMenuOpen: false, selectedItems: [] }),
      toggleItemSelection: (id) =>
        set((state) => {
          const newSelectedItems = state.selectedItems.includes(id)
            ? state.selectedItems.filter((item) => item !== id)
            : [...state.selectedItems, id];

          // If no items selected, close action menu
          const shouldCloseMenu = newSelectedItems.length === 0;

          return {
            selectedItems: newSelectedItems,
            isActionMenuOpen: shouldCloseMenu ? false : state.isActionMenuOpen,
          };
        }),
      openSelectionMode: (id) =>
        set(() => ({
          isActionMenuOpen: true,
          selectedItems: [id],
        })),
      copySelectedItems: () => {
        const state = get();
        const {
          selectedItems,
          activeNoteCard,
          noteCards,
          keepItems,
          reminders,
        } = state;
        let textToCopy = [];

        if (activeNoteCard) {
          // In note card view - copy note items, keep items, or reminders
          if (activeNoteCard.id === "keep") {
            const selectedKeepItems = keepItems.filter((item) =>
              selectedItems.includes(item.id)
            );
            textToCopy = selectedKeepItems.map((item) => item.text);
          } else if (activeNoteCard.id === "reminders") {
            const selectedReminders = reminders.filter((reminder) =>
              selectedItems.includes(reminder.id)
            );
            textToCopy = selectedReminders.map((reminder) => {
              const dateTime =
                reminder.date && reminder.time
                  ? ` (${reminder.date} at ${reminder.time})`
                  : "";
              return reminder.text + dateTime;
            });
          } else {
            // Regular note card items
            const noteCard = noteCards.find(
              (card) => card.id === activeNoteCard.id
            );
            if (noteCard) {
              const selectedNoteItems = noteCard.items.filter((item) =>
                selectedItems.includes(item.id)
              );
              textToCopy = selectedNoteItems.map((item) => item.text);
            }
          }
        } else {
          // On home page - copy note cards
          const selectedNoteCards = noteCards.filter((card) =>
            selectedItems.includes(card.id)
          );
          textToCopy = selectedNoteCards.map((card) => {
            const cardItems = card.items
              .filter((item) => !item.archived)
              .map((item) => item.text);
            return cardItems.join("\n");
          });
        }

        if (textToCopy.length > 0) {
          const finalText = textToCopy.join("\n\n");
          navigator.clipboard.writeText(finalText).catch((err) => {
            console.error("Failed to copy text: ", err);
          });
        }
      },

      // Todos (unlimited)
      todos: [],
      addTodo: (todo) =>
        set((state) => {
          return {
            todos: [
              ...state.todos,
              { id: Date.now(), text: todo, completed: false },
            ],
          };
        }),
      toggleTodo: (id) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );

          // Remove completed todos immediately
          const filteredTodos = updatedTodos.filter((todo) => !todo.completed);

          return { todos: filteredTodos };
        }),
      editTodo: (id, newText) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      // Keep items (general notes)
      keepItems: [],
      setKeepItems: (items) => set({ keepItems: items }),
      addKeepItem: (text) =>
        set((state) => ({
          keepItems: [
            ...state.keepItems,
            { id: Date.now(), text, archived: false },
          ],
        })),
      deleteKeepItem: (id) =>
        set((state) => ({
          keepItems: state.keepItems.filter((item) => item.id !== id),
        })),
      editKeepItem: (id, newText) =>
        set((state) => ({
          keepItems: state.keepItems.map((item) =>
            item.id === id ? { ...item, text: newText } : item
          ),
        })),
      archiveKeepItem: (id) =>
        set((state) => ({
          keepItems: state.keepItems.map((item) =>
            item.id === id ? { ...item, archived: true } : item
          ),
        })),

      // Reminders
      reminders: [],
      setReminders: (reminders) => set({ reminders: reminders }),
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            {
              id: Date.now(),
              text: reminder.text,
              date: reminder.date,
              time: reminder.time,
            },
          ],
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        })),
      editReminder: (id, newText, newDate, newTime) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? {
                  ...reminder,
                  text: newText,
                  date: newDate || reminder.date,
                  time: newTime || reminder.time,
                }
              : reminder
          ),
        })),

      // Goals
      goals: [],
      setGoals: (goals) => set({ goals: goals }),
      addGoal: (text, deadline = null) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: Date.now(),
              text,
              deadline,
              archived: false,
              completed: false,
            },
          ],
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      editGoal: (id, newText, newDeadline) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  text: newText,
                  deadline:
                    newDeadline !== undefined ? newDeadline : goal.deadline,
                }
              : goal
          ),
        })),
      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
          ),
        })),
      archiveGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, archived: true } : goal
          ),
        })),

      // Deep-clone defaults to avoid mutating the shared module export
      noteCards: JSON.parse(JSON.stringify(defaultNoteCards)),
      setNoteCards: (noteCards) => set({ noteCards: noteCards }),
      addNoteCard: (name) => {
        const newCard = { id: Date.now(), name, items: [] };
        set((state) => ({
          noteCards: [...state.noteCards, newCard],
        }));
        return newCard;
      },
      deleteNoteCard: (id) =>
        set((state) => ({
          noteCards: state.noteCards.filter((card) => card.id !== id),
        })),
      renameNoteCard: (id, newName) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) =>
            card.id === id ? { ...card, name: newName } : card
          );

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === id
              ? updatedNoteCards.find((card) => card.id === id)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),
      addNoteItem: (cardId, text) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  items: [
                    ...card.items,
                    { id: Date.now(), text, archived: false },
                  ],
                }
              : card
          );

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === cardId
              ? updatedNoteCards.find((card) => card.id === cardId)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),
      deleteNoteItem: (cardId, itemId) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  items: card.items.filter((item) => item.id !== itemId),
                }
              : card
          );

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === cardId
              ? updatedNoteCards.find((card) => card.id === cardId)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),
      editNoteItem: (cardId, itemId, newText) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  items: card.items.map((item) =>
                    item.id === itemId ? { ...item, text: newText } : item
                  ),
                }
              : card
          );

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === cardId
              ? updatedNoteCards.find((card) => card.id === cardId)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),
      archiveNoteItem: (cardId, itemId) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  items: card.items.map((item) =>
                    item.id === itemId ? { ...item, archived: true } : item
                  ),
                }
              : card
          );

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === cardId
              ? updatedNoteCards.find((card) => card.id === cardId)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),
      reorderNoteItems: (cardId, startIndex, endIndex) =>
        set((state) => {
          const updatedNoteCards = state.noteCards.map((card) => {
            if (card.id === cardId) {
              const items = [...card.items];
              const [reorderedItem] = items.splice(startIndex, 1);
              items.splice(endIndex, 0, reorderedItem);
              return { ...card, items };
            }
            return card;
          });

          // Update activeNoteCard if it matches the card being modified
          const updatedActiveNoteCard =
            state.activeNoteCard?.id === cardId
              ? updatedNoteCards.find((card) => card.id === cardId)
              : state.activeNoteCard;

          return {
            noteCards: updatedNoteCards,
            activeNoteCard: updatedActiveNoteCard,
          };
        }),

      // Active note card
      activeNoteCard: null,
      setActiveNoteCard: (card) => set({ activeNoteCard: card }),
      clearActiveNoteCard: () => set({ activeNoteCard: null }),

      // Editing state for items
      editingItemId: null,
      setEditingItemId: (id) => set({ editingItemId: id }),
      clearEditingItemId: () => set({ editingItemId: null }),

      // Smart reminder parsing
      parseSmartReminder: (text) => {
        // This will be implemented in utils.js
        return { text, date: null, time: null };
      },
    }),
    {
      name: getUserStorageKey(),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        noteCards: state.noteCards,
        keepItems: state.keepItems,
        reminders: state.reminders,
        todos: state.todos,
        goals: state.goals,
        briefingText: state.briefingText,
      }),
    }
  )
);
