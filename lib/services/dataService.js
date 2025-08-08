import { createClient } from "@/lib/supabase/client";

class DataService {
  constructor() {
    try {
      this.supabase = createClient();
      this.isAvailable = true;
    } catch (error) {
      console.warn(
        "DataService: Supabase client not available:",
        error.message
      );
      this.supabase = null;
      this.isAvailable = false;
    }
  }

  // Check if Supabase is available before operations
  checkAvailability() {
    if (!this.isAvailable || !this.supabase) {
      console.warn("DataService: Supabase not available, skipping operation");
      return false;
    }
    return true;
  }

  // Note Cards operations
  async getNoteCards(userId) {
    if (!this.checkAvailability()) return [];

    try {
      const { data: notes, error } = await this.supabase
        .from("notes")
        .select(
          `
          id,
          name,
          type,
          created_at,
          updated_at,
          note_items (
            id,
            content,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", userId)
        .eq("type", "note")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform to match your local store format
      return notes.map((note) => ({
        id: note.id,
        name: note.name,
        items: note.note_items.map((item) => ({
          id: item.id,
          text: item.content,
          archived: false, // Add archived logic if needed
        })),
      }));
    } catch (error) {
      console.error("Error fetching note cards:", error);
      return [];
    }
  }

  async createNoteCard(userId, name) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      const { data, error } = await this.supabase
        .from("notes")
        .insert({
          user_id: userId,
          name: name,
          type: "note",
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        items: [],
      };
    } catch (error) {
      console.error("Error creating note card:", error);
      throw error;
    }
  }

  async updateNoteCard(noteId, name) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      const { data, error } = await this.supabase
        .from("notes")
        .update({
          name: name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note card:", error);
      throw error;
    }
  }

  async deleteNoteCard(noteId) {
    if (!this.checkAvailability()) return;

    try {
      // First delete all note items
      await this.supabase.from("note_items").delete().eq("note_id", noteId);

      // Then delete the note
      const { error } = await this.supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting note card:", error);
      throw error;
    }
  }

  // Note Items operations
  async createNoteItem(noteId, content) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      const { data, error } = await this.supabase
        .from("note_items")
        .insert({
          note_id: noteId,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        text: data.content,
        archived: false,
      };
    } catch (error) {
      console.error("Error creating note item:", error);
      throw error;
    }
  }

  async updateNoteItem(itemId, content) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      const { data, error } = await this.supabase
        .from("note_items")
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating note item:", error);
      throw error;
    }
  }

  async deleteNoteItem(itemId) {
    if (!this.checkAvailability()) return;

    try {
      const { error } = await this.supabase
        .from("note_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting note item:", error);
      throw error;
    }
  }

  // Keep Items operations
  async getKeepItems(userId) {
    if (!this.checkAvailability()) return [];

    try {
      const { data: notes, error } = await this.supabase
        .from("notes")
        .select(
          `
          id,
          name,
          created_at,
          updated_at,
          note_items (
            id,
            content,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", userId)
        .eq("type", "keep")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Flatten keep items since they don't have cards
      const keepItems = [];
      notes.forEach((note) => {
        note.note_items.forEach((item) => {
          keepItems.push({
            id: item.id,
            text: item.content,
            archived: false,
          });
        });
      });

      return keepItems;
    } catch (error) {
      console.error("Error fetching keep items:", error);
      return [];
    }
  }

  async createKeepItem(userId, content) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      // First, get or create a keep note for this user
      let { data: keepNote, error: keepError } = await this.supabase
        .from("notes")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "keep")
        .single();

      if (keepError && keepError.code === "PGRST116") {
        // No keep note exists, create one
        const { data: newKeepNote, error: createError } = await this.supabase
          .from("notes")
          .insert({
            user_id: userId,
            name: "Keep Items",
            type: "keep",
          })
          .select()
          .single();

        if (createError) throw createError;
        keepNote = newKeepNote;
      } else if (keepError) {
        throw keepError;
      }

      // Create the keep item
      const { data, error } = await this.supabase
        .from("note_items")
        .insert({
          note_id: keepNote.id,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        text: data.content,
        archived: false,
      };
    } catch (error) {
      console.error("Error creating keep item:", error);
      throw error;
    }
  }

  // Reminders operations
  async getReminders(userId) {
    if (!this.checkAvailability()) return [];

    try {
      const { data: notes, error } = await this.supabase
        .from("notes")
        .select(
          `
          id,
          name,
          created_at,
          updated_at,
          note_items (
            id,
            content,
            created_at,
            updated_at
          )
        `
        )
        .eq("user_id", userId)
        .eq("type", "reminder")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform reminders - parse content for date/time info
      const reminders = [];
      notes.forEach((note) => {
        note.note_items.forEach((item) => {
          const reminderData = this.parseReminderContent(item.content);
          reminders.push({
            id: item.id,
            text: reminderData.text,
            date: reminderData.date,
            time: reminderData.time,
          });
        });
      });

      return reminders;
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return [];
    }
  }

  async createReminder(userId, reminderData) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      // Get or create a reminder note for this user
      let { data: reminderNote, error: reminderError } = await this.supabase
        .from("notes")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "reminder")
        .single();

      if (reminderError && reminderError.code === "PGRST116") {
        // No reminder note exists, create one
        const { data: newReminderNote, error: createError } =
          await this.supabase
            .from("notes")
            .insert({
              user_id: userId,
              name: "Reminders",
              type: "reminder",
            })
            .select()
            .single();

        if (createError) throw createError;
        reminderNote = newReminderNote;
      } else if (reminderError) {
        throw reminderError;
      }

      // Create reminder content with date/time
      const content = this.formatReminderContent(reminderData);

      const { data, error } = await this.supabase
        .from("note_items")
        .insert({
          note_id: reminderNote.id,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        text: reminderData.text,
        date: reminderData.date,
        time: reminderData.time,
      };
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  }

  async updateReminder(itemId, reminderData) {
    if (!this.checkAvailability()) throw new Error("Supabase not available");

    try {
      const content = this.formatReminderContent(reminderData);

      const { data, error } = await this.supabase
        .from("note_items")
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating reminder:", error);
      throw error;
    }
  }

  // Helper methods for reminder formatting
  formatReminderContent(reminderData) {
    let content = reminderData.text;
    if (reminderData.date || reminderData.time) {
      content += ` [REMINDER_DATA:${JSON.stringify({
        date: reminderData.date,
        time: reminderData.time,
      })}]`;
    }
    return content;
  }

  parseReminderContent(content) {
    const reminderMatch = content.match(/\[REMINDER_DATA:(.+?)\]$/);
    if (reminderMatch) {
      try {
        const reminderData = JSON.parse(reminderMatch[1]);
        return {
          text: content.replace(/\[REMINDER_DATA:.+?\]$/, "").trim(),
          date: reminderData.date,
          time: reminderData.time,
        };
      } catch (e) {
        console.error("Error parsing reminder data:", e);
      }
    }

    return {
      text: content,
      date: null,
      time: null,
    };
  }
}

export const dataService = new DataService();
