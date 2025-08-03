import clsx from "clsx";
import * as chrono from "chrono-node";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(date) {
  const today = new Date();
  const targetDate = new Date(date);

  if (targetDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (targetDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function getUpcomingReminder(reminders) {
  const now = new Date();
  const upcoming = reminders
    .filter((reminder) => {
      const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
      return reminderDate > now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

  return upcoming[0] || null;
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Smart reminder detection using chrono-node with custom text extraction
export function detectReminderIntent(text) {
  const lowerText = text.toLowerCase();

  // First, check if this looks like a reminder based on keywords or patterns
  const reminderKeywords =
    /\b(remind|reminder|meeting|appointment|call|exam|test|due|deadline|schedule|at|on|in|tomorrow|today|next|this|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|night|am|pm|o'clock)\b/i;

  const hasReminderContext = reminderKeywords.test(text);

  if (!hasReminderContext) {
    return { isReminder: false };
  }

  // Use chrono-node to parse the date/time
  const parsedDates = chrono.parse(text, new Date(), { forwardDate: true });

  let detectedDate = null;
  let detectedTime = "07:00 AM"; // Default morning time
  let reminderText = text;

  if (parsedDates.length > 0) {
    const chronoResult = parsedDates[0];
    const startDate = chronoResult.start.date();

    // Extract date
    detectedDate = startDate.toISOString().split("T")[0];

    // Extract time if available
    if (chronoResult.start.get("hour") !== null) {
      const hour = chronoResult.start.get("hour");
      const minute = chronoResult.start.get("minute") || 0;

      // Format time properly
      if (hour === 0) {
        detectedTime = `12:${minute.toString().padStart(2, "0")} AM`;
      } else if (hour < 12) {
        detectedTime = `${hour}:${minute.toString().padStart(2, "0")} AM`;
      } else if (hour === 12) {
        detectedTime = `12:${minute.toString().padStart(2, "0")} PM`;
      } else {
        detectedTime = `${hour - 12}:${minute.toString().padStart(2, "0")} PM`;
      }
    }

    // Remove the date/time part that chrono detected from the original text
    const chronoText = chronoResult.text;
    reminderText = text.replace(chronoText, "").trim();

    // Also remove common prepositions that might be left behind
    reminderText = reminderText.replace(/^(on|at|for|by|in)\s+/i, "");
    reminderText = reminderText.replace(/\s+(on|at|for|by|in)$/i, "");
  } else {
    // Fallback to today if no date could be parsed
    detectedDate = new Date().toISOString().split("T")[0];
  }

  // Additional cleanup for common reminder patterns
  reminderText = reminderText
    .replace(/^(remind me to|reminder to|remember to)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // Ensure we have some meaningful text
  if (!reminderText || reminderText.length < 2) {
    reminderText = text.replace(/\s+/g, " ").trim();
  }

  return {
    isReminder: true,
    text: reminderText,
    date: detectedDate,
    time: detectedTime,
  };
}

// Smart reminder parsing for reminder cards using chrono-node with custom text extraction
export function parseSmartReminder(text) {
  // Use chrono-node to parse the date/time with forward date preference
  const parsedDates = chrono.parse(text, new Date(), { forwardDate: true });

  let detectedDate = new Date().toISOString().split("T")[0]; // Default to today
  let detectedTime = "09:00 AM"; // Default morning time
  let reminderText = text;

  if (parsedDates.length > 0) {
    const chronoResult = parsedDates[0];
    const startDate = chronoResult.start.date();

    // Extract date
    detectedDate = startDate.toISOString().split("T")[0];

    // Extract time if available
    if (chronoResult.start.get("hour") !== null) {
      const hour = chronoResult.start.get("hour");
      const minute = chronoResult.start.get("minute") || 0;

      // Format time properly
      if (hour === 0) {
        detectedTime = `12:${minute.toString().padStart(2, "0")} AM`;
      } else if (hour < 12) {
        detectedTime = `${hour}:${minute.toString().padStart(2, "0")} AM`;
      } else if (hour === 12) {
        detectedTime = `12:${minute.toString().padStart(2, "0")} PM`;
      } else {
        detectedTime = `${hour - 12}:${minute.toString().padStart(2, "0")} PM`;
      }
    } else {
      // If no specific time, try to infer from context
      const lowerText = text.toLowerCase();
      if (lowerText.includes("morning")) {
        detectedTime = "09:00 AM";
      } else if (lowerText.includes("afternoon")) {
        detectedTime = "02:00 PM";
      } else if (lowerText.includes("evening")) {
        detectedTime = "06:00 PM";
      } else if (lowerText.includes("night")) {
        detectedTime = "08:00 PM";
      }
    }

    // Remove the date/time part that chrono detected from the original text
    const chronoText = chronoResult.text;
    reminderText = text.replace(chronoText, "").trim();

    // Also remove common prepositions that might be left behind
    reminderText = reminderText.replace(/^(on|at|for|by|in)\s+/i, "");
    reminderText = reminderText.replace(/\s+(on|at|for|by|in)$/i, "");
  }

  // Additional cleanup for common reminder patterns
  reminderText = reminderText
    .replace(/^(remind me to|reminder to|remember to)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // Ensure we have some meaningful text
  if (!reminderText || reminderText.length < 2) {
    reminderText = text.replace(/\s+/g, " ").trim();
  }

  return {
    text: reminderText,
    date: detectedDate,
    time: detectedTime,
  };
}
