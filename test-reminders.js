// Test script for the new reminder parsing system (chrono-node only)
const chrono = require("chrono-node");

// Simulate the new detectReminderIntent function
function testDetectReminderIntent(text) {
  console.log(`\n🧪 Testing: "${text}"`);

  const lowerText = text.toLowerCase();

  // First, check if this looks like a reminder based on keywords or patterns
  const reminderKeywords =
    /\b(remind|reminder|meeting|appointment|call|exam|test|due|deadline|schedule|at|on|in|tomorrow|today|next|this|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|night|am|pm|o'clock)\b/i;

  const hasReminderContext = reminderKeywords.test(text);

  if (!hasReminderContext) {
    console.log("❌ Not detected as reminder");
    return { isReminder: false };
  }

  // Check for non-standard time formats that chrono might miss
  const customTimeMatch = text.match(/\b(\d{1,2})(pm|am)\b/i);
  let customTime = null;
  if (customTimeMatch) {
    const hour = parseInt(customTimeMatch[1]);
    const ampm = customTimeMatch[2].toLowerCase();
    if (ampm === "pm" && hour > 12) {
      // Handle cases like "14pm" - treat as 2pm
      customTime = `${hour - 12}:00 PM`;
    } else {
      customTime = `${hour}:00 ${ampm.toUpperCase()}`;
    }
    console.log("⏰ Custom time detected:", customTime);
  }

  // Use chrono-node to parse the date/time
  const parsedDates = chrono.parse(text, new Date(), { forwardDate: true });
  console.log(
    "📅 chrono-node results:",
    parsedDates.map((d) => ({
      text: d.text,
      date: d.start.date(),
      hour: d.start.get("hour"),
      minute: d.start.get("minute"),
    }))
  );

  let detectedDate = null;
  let detectedTime = customTime || "07:00 AM"; // Use custom time if found, otherwise default
  let reminderText = text;

  if (parsedDates.length > 0) {
    const chronoResult = parsedDates[0];
    const startDate = chronoResult.start.date();

    // Extract date
    detectedDate = startDate.toISOString().split("T")[0];

    // Extract time if available (only if we didn't find a custom time)
    if (!customTime && chronoResult.start.get("hour") !== null) {
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

  // Remove custom time patterns from the text if we found one
  if (customTime) {
    reminderText = reminderText.replace(/\b\d{1,2}(pm|am)\b/i, "").trim();
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

  const result = {
    isReminder: true,
    text: reminderText,
    date: detectedDate,
    time: detectedTime,
  };

  console.log("✅ Final result:", result);
  return result;
}

// Test cases
const testCases = [
  "chemistry test on Tuesday 14pm", // Your specific example
  "chemistry test in a month",
  "chemistry test on the 20th of August",
  "dentist appointment tomorrow at 2pm",
  "call mom next Friday",
  "meeting on Monday morning",
  "submit report by Thursday",
  "pick up dry cleaning at 5:30pm",
  "yoga class next Tuesday at 6am",
  "birthday party on Saturday evening",
  "conference call in 3 days at 10:30am",
];

console.log("🚀 Testing Enhanced Reminder Detection System");
console.log("============================================");

testCases.forEach((testCase) => {
  testDetectReminderIntent(testCase);
});
