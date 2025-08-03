## 📝 App Name

Nottifly

---

## 💡 App Description

Nottifly is a personal coaching app designed to encourage users through motivational notifications based on their goals, manage daily to-do lists, provide timely reminders, and facilitate practice of note items.

---

## ✨ Key Features

- **Reminders:** Users can add and be notified about upcoming reminders.
- **To-Dos:** Users can add up to 3 daily "must-dos" to a briefing card.
<!-- - **Goals:** Users can set up to 3 personal goals, which trigger encouraging notification messages. -->
- **Notes:** Users can create and manage multiple note cards, each containing a list of items. The app helps users practice their note items.

---

## 📱 User Interface & Navigation

- **Home Page:**

  - **Top Bar:** Menu icon (left), "Nottifly" app name (center), pencil edit icon (right) for adding new Notes cards.
  - **Middle Section (Masonry Layout):**
    - **Briefing Card:** Displays daily to-dos (max 3) and the closest upcoming reminder.
    - **Reminder Card:** Contains all reminders.
    - **Note Cards:** Display a snapshot preview of content and the card name.
  - **Bottom:** Input field for adding new note card items.

- **Note Card Page (Expanded View):**
  - Displays the note card name at the top.
  - Body content with each item separated by a thin line.
  - items can be reordered by dragging and dropping.
  - items can be slided left or right to archive it
  - Input field at the bottom to add new items.
- **Action Menu (Long Press):**
  - Replaces the bottom input component when a user long-presses a card or card item.
  - Allows multi-selection of items using radio circle buttons in the top corner of each item.
  - **Actions:** Duplicate, Share, Delete, Rename.
- **Menu Slider:**
  - Accessible from the home page menu icon.
  - slides from left to right.
  - Contains app settings (Upgrade to Plus, Feedback, About, Dark Mode).
  - Displays user profile information (e.g., Ishaku March, ishakumarch@gmail.com).

---

## 💻 Technologies & Libraries

- **Framework:** Next.js 15 (app router)
- **PWA:** Yes, with service worker support.
- **State Management:** Zustand
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **UI Components:** shadcn
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Language:** JavaScript
- **Icons:** radix ui Icons

---

## 🎨 Design Guidelines

- **Corner Radius:** 16px for all card elements.
- **Colors:**
  - **Background (bg):** `#F6F6F6`
  - **Gray:** `#E7E7E7`
  - **Primary Color:** `#FE5D26`
- light and dark theme support

---
