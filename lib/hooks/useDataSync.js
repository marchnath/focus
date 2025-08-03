"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useStore } from "@/lib/store";
import { dataService } from "@/lib/services/dataService";

export const useDataSync = () => {
  const { user } = useAuth();
  const {
    setNoteCards,
    setKeepItems,
    setReminders,
    noteCards,
    keepItems,
    reminders,
  } = useStore();

  // Load all data from Supabase when user is authenticated
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [noteCardsData, keepItemsData, remindersData] = await Promise.all([
        dataService.getNoteCards(user.id),
        dataService.getKeepItems(user.id),
        dataService.getReminders(user.id),
      ]);

      setNoteCards(noteCardsData);
      setKeepItems(keepItemsData);
      setReminders(remindersData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [user?.id, setNoteCards, setKeepItems, setReminders]);

  // Load data when user logs in
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id, loadUserData]);

  // Sync functions for individual operations
  const syncNoteCard = useCallback(
    async (operation, data) => {
      if (!user?.id) return null;

      try {
        switch (operation) {
          case "create":
            return await dataService.createNoteCard(user.id, data.name);
          case "update":
            return await dataService.updateNoteCard(data.id, data.name);
          case "delete":
            return await dataService.deleteNoteCard(data.id);
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Error syncing note card (${operation}):`, error);
        throw error;
      }
    },
    [user?.id]
  );

  const syncNoteItem = useCallback(
    async (operation, data) => {
      if (!user?.id) return null;

      try {
        switch (operation) {
          case "create":
            return await dataService.createNoteItem(data.noteId, data.content);
          case "update":
            return await dataService.updateNoteItem(data.id, data.content);
          case "delete":
            return await dataService.deleteNoteItem(data.id);
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Error syncing note item (${operation}):`, error);
        throw error;
      }
    },
    [user?.id]
  );

  const syncKeepItem = useCallback(
    async (operation, data) => {
      if (!user?.id) return null;

      try {
        switch (operation) {
          case "create":
            return await dataService.createKeepItem(user.id, data.content);
          case "update":
            return await dataService.updateNoteItem(data.id, data.content);
          case "delete":
            return await dataService.deleteNoteItem(data.id);
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Error syncing keep item (${operation}):`, error);
        throw error;
      }
    },
    [user?.id]
  );

  const syncReminder = useCallback(
    async (operation, data) => {
      if (!user?.id) return null;

      try {
        switch (operation) {
          case "create":
            return await dataService.createReminder(user.id, data);
          case "update":
            return await dataService.updateReminder(data.id, data);
          case "delete":
            return await dataService.deleteNoteItem(data.id);
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Error syncing reminder (${operation}):`, error);
        throw error;
      }
    },
    [user?.id]
  );

  return {
    loadUserData,
    syncNoteCard,
    syncNoteItem,
    syncKeepItem,
    syncReminder,
    isOnline: !!user?.id,
  };
};
