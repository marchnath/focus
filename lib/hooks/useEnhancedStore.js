import { useStore } from "@/lib/store";
import { useDataSync } from "@/lib/hooks/useDataSync";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Enhanced store hook that automatically syncs with Supabase
 * Use this instead of useStore directly for operations that need to sync with the database
 */
export const useEnhancedStore = () => {
  const store = useStore();
  const { syncNoteCard, syncNoteItem, syncKeepItem, syncReminder, isOnline } =
    useDataSync();
  const { user } = useAuth();

  // Enhanced note card operations
  const addNoteCard = async (name) => {
    try {
      // If user is authenticated, create directly in database
      if (user?.id) {
        const dbCard = await syncNoteCard("create", { name });

        // Add to local store with database ID
        if (dbCard) {
          store.setNoteCards([...store.noteCards, dbCard]);
          return dbCard;
        }
      }

      // Fallback to local only if not authenticated
      return store.addNoteCard(name);
    } catch (error) {
      console.error("Error adding note card:", error);
      // Fallback to local storage
      return store.addNoteCard(name);
    }
  };

  const deleteNoteCard = async (id) => {
    try {
      // Remove from local store first
      store.deleteNoteCard(id);

      // If user is authenticated, sync with database
      if (user?.id) {
        await syncNoteCard("delete", { id });
      }
    } catch (error) {
      console.error("Error deleting note card:", error);
      // Revert local change if sync fails
      throw error;
    }
  };

  const renameNoteCard = async (id, newName) => {
    try {
      // Only sync if it's a valid UUID (from database)
      if (user?.id && typeof id === "string" && id.includes("-")) {
        await syncNoteCard("update", { id, name: newName });
      }

      // Always update local store
      store.renameNoteCard(id, newName);
    } catch (error) {
      console.error("Error renaming note card:", error);
      // Keep local change even if sync fails
      store.renameNoteCard(id, newName);
    }
  };

  // Enhanced note item operations
  const addNoteItem = async (cardId, text) => {
    try {
      // If user is authenticated and cardId is a UUID, sync with database
      if (user?.id && typeof cardId === "string" && cardId.includes("-")) {
        const dbItem = await syncNoteItem("create", {
          noteId: cardId,
          content: text,
        });

        if (dbItem) {
          // Update local store with the database item
          const updatedNoteCards = store.noteCards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                items: [...card.items, dbItem],
              };
            }
            return card;
          });
          store.setNoteCards(updatedNoteCards);

          // Update activeNoteCard if it matches the current card
          if (store.activeNoteCard?.id === cardId) {
            const updatedActiveCard = updatedNoteCards.find(
              (card) => card.id === cardId
            );
            if (updatedActiveCard) {
              store.setActiveNoteCard(updatedActiveCard);
            }
          }
          return;
        }
      }

      // Fallback to local only
      store.addNoteItem(cardId, text);
    } catch (error) {
      console.error("Error adding note item:", error);
      // Keep local change even if sync fails
      store.addNoteItem(cardId, text);
    }
  };

  const editNoteItem = async (cardId, itemId, newText) => {
    try {
      // Update local store first
      store.editNoteItem(cardId, itemId, newText);

      // If user is authenticated and itemId is a UUID, sync with database
      if (user?.id && typeof itemId === "string" && itemId.includes("-")) {
        await syncNoteItem("update", { id: itemId, content: newText });
      }

      // Update activeNoteCard if it matches the current card
      if (store.activeNoteCard?.id === cardId) {
        const updatedCard = store.noteCards.find((card) => card.id === cardId);
        if (updatedCard) {
          store.setActiveNoteCard(updatedCard);
        }
      }
    } catch (error) {
      console.error("Error editing note item:", error);
      // Keep local change even if sync fails
    }
  };

  const deleteNoteItem = async (cardId, itemId) => {
    try {
      // Remove from local store first
      store.deleteNoteItem(cardId, itemId);

      // If user is authenticated and itemId is a UUID, sync with database
      if (user?.id && typeof itemId === "string" && itemId.includes("-")) {
        await syncNoteItem("delete", { id: itemId });
      }

      // Update activeNoteCard if it matches the current card
      if (store.activeNoteCard?.id === cardId) {
        const updatedCard = store.noteCards.find((card) => card.id === cardId);
        if (updatedCard) {
          store.setActiveNoteCard(updatedCard);
        }
      }
    } catch (error) {
      console.error("Error deleting note item:", error);
      // Keep local change even if sync fails
    }
  };

  // Enhanced keep item operations
  const addKeepItem = async (text) => {
    try {
      // If user is authenticated, create directly in database
      if (user?.id) {
        const dbItem = await syncKeepItem("create", { content: text });

        if (dbItem) {
          // Add to local store with database item
          const updatedKeepItems = [...store.keepItems, dbItem];
          store.setKeepItems(updatedKeepItems);

          // Update activeNoteCard if it's the keep card
          if (store.activeNoteCard?.id === "keep") {
            store.setActiveNoteCard({
              ...store.activeNoteCard,
              items: updatedKeepItems,
            });
          }
          return;
        }
      }

      // Fallback to local only
      store.addKeepItem(text);
    } catch (error) {
      console.error("Error adding keep item:", error);
      // Keep local change even if sync fails
      store.addKeepItem(text);
    }
  };

  const editKeepItem = async (id, newText) => {
    try {
      // Update local store first
      store.editKeepItem(id, newText);

      // If user is authenticated and id is a UUID, sync with database
      if (user?.id && typeof id === "string" && id.includes("-")) {
        await syncKeepItem("update", { id, content: newText });
      }

      // Update activeNoteCard if it's the keep card
      if (store.activeNoteCard?.id === "keep") {
        store.setActiveNoteCard({
          ...store.activeNoteCard,
          items: store.keepItems,
        });
      }
    } catch (error) {
      console.error("Error editing keep item:", error);
      // Keep local change even if sync fails
    }
  };

  const deleteKeepItem = async (id) => {
    try {
      // Remove from local store first
      store.deleteKeepItem(id);

      // If user is authenticated and id is a UUID, sync with database
      if (user?.id && typeof id === "string" && id.includes("-")) {
        await syncKeepItem("delete", { id });
      }

      // Update activeNoteCard if it's the keep card
      if (store.activeNoteCard?.id === "keep") {
        store.setActiveNoteCard({
          ...store.activeNoteCard,
          items: store.keepItems,
        });
      }
    } catch (error) {
      console.error("Error deleting keep item:", error);
      // Keep local change even if sync fails
    }
  };

  // Enhanced reminder operations
  const addReminder = async (reminderData) => {
    try {
      // If user is authenticated, create directly in database
      if (user?.id) {
        const dbReminder = await syncReminder("create", reminderData);

        if (dbReminder) {
          // Add to local store with database item
          const updatedReminders = [...store.reminders, dbReminder];
          store.setReminders(updatedReminders);

          // Update activeNoteCard if it's the reminders card
          if (store.activeNoteCard?.id === "reminders") {
            store.setActiveNoteCard({
              ...store.activeNoteCard,
              items: updatedReminders,
            });
          }
          return;
        }
      }

      // Fallback to local only
      store.addReminder(reminderData);
    } catch (error) {
      console.error("Error adding reminder:", error);
      // Keep local change even if sync fails
      store.addReminder(reminderData);
    }
  };

  const editReminder = async (id, newText, newDate, newTime) => {
    try {
      // Update local store first
      store.editReminder(id, newText, newDate, newTime);

      // If user is authenticated and id is a UUID, sync with database
      if (user?.id && typeof id === "string" && id.includes("-")) {
        await syncReminder("update", {
          id,
          text: newText,
          date: newDate,
          time: newTime,
        });
      }

      // Update activeNoteCard if it's the reminders card
      if (store.activeNoteCard?.id === "reminders") {
        store.setActiveNoteCard({
          ...store.activeNoteCard,
          items: store.reminders,
        });
      }
    } catch (error) {
      console.error("Error editing reminder:", error);
      // Keep local change even if sync fails
    }
  };

  const deleteReminder = async (id) => {
    try {
      // Remove from local store first
      store.deleteReminder(id);

      // If user is authenticated and id is a UUID, sync with database
      if (user?.id && typeof id === "string" && id.includes("-")) {
        await syncReminder("delete", { id });
      }

      // Update activeNoteCard if it's the reminders card
      if (store.activeNoteCard?.id === "reminders") {
        store.setActiveNoteCard({
          ...store.activeNoteCard,
          items: store.reminders,
        });
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      // Keep local change even if sync fails
    }
  };

  // Enhanced todo operations (no sync needed as they're local-only for now)
  const addTodo = (text) => {
    return store.addTodo(text);
  };

  const editTodo = (id, newText) => {
    return store.editTodo(id, newText);
  };

  const toggleTodo = (id) => {
    return store.toggleTodo(id);
  };

  const deleteTodo = (id) => {
    return store.deleteTodo(id);
  };

  // Enhanced goal operations (no sync needed as they're local-only for now)
  const addGoal = (text, deadline = null) => {
    return store.addGoal(text, deadline);
  };

  const editGoal = (id, newText, newDeadline) => {
    return store.editGoal(id, newText, newDeadline);
  };

  const deleteGoal = (id) => {
    return store.deleteGoal(id);
  };

  const toggleGoal = (id) => {
    return store.toggleGoal(id);
  };

  const archiveGoal = (id) => {
    return store.archiveGoal(id);
  };

  return {
    // Expose all original store properties and methods
    ...store,

    // Override with enhanced sync-enabled methods
    addNoteCard,
    deleteNoteCard,
    renameNoteCard,
    addNoteItem,
    editNoteItem,
    deleteNoteItem,
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

    // Additional properties
    isOnline,
    user,
  };
};
