import { createClient } from "@/lib/supabase/client";

class DataService {
  constructor() {
    this.supabase = createClient();
  }

  // Note Cards operations
  async getNoteCards(userId) {
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
