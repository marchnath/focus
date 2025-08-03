import { dataService } from "@/lib/services/dataService";

// Simple test to verify Supabase integration is working
// You can run this test after logging in to see if data persists

export async function testSupabaseIntegration(userId) {
  try {
    console.log("Testing Supabase integration...");

    // Test 1: Create a note card
    console.log("1. Creating a test note card...");
    const testCard = await dataService.createNoteCard(userId, "Test Card");
    console.log("Created note card:", testCard);

    // Test 2: Add an item to the note card
    console.log("2. Adding a test item...");
    const testItem = await dataService.createNoteItem(
      testCard.id,
      "Test note item content"
    );
    console.log("Created note item:", testItem);

    // Test 3: Create a keep item
    console.log("3. Creating a test keep item...");
    const testKeepItem = await dataService.createKeepItem(
      userId,
      "Test keep item"
    );
    console.log("Created keep item:", testKeepItem);

    // Test 4: Create a reminder
    console.log("4. Creating a test reminder...");
    const testReminder = await dataService.createReminder(userId, {
      text: "Test reminder",
      date: "2025-01-30",
      time: "10:00",
    });
    console.log("Created reminder:", testReminder);

    // Test 5: Fetch all data
    console.log("5. Fetching all user data...");
    const [noteCards, keepItems, reminders] = await Promise.all([
      dataService.getNoteCards(userId),
      dataService.getKeepItems(userId),
      dataService.getReminders(userId),
    ]);

    console.log("Fetched note cards:", noteCards);
    console.log("Fetched keep items:", keepItems);
    console.log("Fetched reminders:", reminders);

    // Test 6: Clean up (optional)
    console.log("6. Cleaning up test data...");
    await dataService.deleteNoteItem(testItem.id);
    await dataService.deleteNoteCard(testCard.id);
    await dataService.deleteNoteItem(testKeepItem.id);
    await dataService.deleteNoteItem(testReminder.id);

    console.log(
      "✅ All tests passed! Supabase integration is working correctly."
    );
    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}

// Instructions to run the test:
// 1. Sign in with Google authentication
// 2. Open browser developer console
// 3. Run: testSupabaseIntegration(user.id) where user.id is your authenticated user ID
// 4. Check console for test results
