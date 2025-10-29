import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ObjectManagerConcept from "./ObjectManagerConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const object1 = "object:Book-123" as ID;
const object2 = "object:Document-456" as ID;
const object3 = "object:Project-789" as ID;

Deno.test(
  "Principle: User assigns names and descriptions to objects, then modifies them",
  async () => {
    const [db, client] = await testDb();
    const objectManager = new ObjectManagerConcept(db);

    try {
      console.log(
        "\n# Trace: Fulfilling the ObjectManager Operational Principle",
      );
      console.log(
        "The principle states: 'Given an object, a user can give it a name and description, becoming an owner of this object. The user that owns the object can later change its name and description, but not the object binding itself.'",
      );

      // 1. Create an assigned object
      console.log("\n## 1. User creates assigned objects");
      const create1Result = await objectManager.createAssignedObject({
        owner: userA,
        object: object1,
        title: "My Favorite Book",
        description: "A great novel about adventure",
      });
      assertNotEquals(
        "error" in create1Result,
        true,
        "Creating the first assigned object should succeed.",
      );
      const { assignedObject: ao1 } = create1Result as { assignedObject: ID };
      console.log(
        `- Action: createAssignedObject({ owner: "${userA}", object: "${object1}", title: "My Favorite Book" })`,
      );
      console.log(`  Result: AssignedObject created with ID: \`${ao1}\``);

      // 2. Create another assigned object
      const create2Result = await objectManager.createAssignedObject({
        owner: userA,
        object: object2,
        title: "Project Plan",
        description: "My detailed project documentation",
      });
      assertNotEquals(
        "error" in create2Result,
        true,
        "Creating the second assigned object should succeed.",
      );
      const { assignedObject: ao2 } = create2Result as { assignedObject: ID };
      console.log(
        `- Action: createAssignedObject({ owner: "${userA}", object: "${object2}", title: "Project Plan" })`,
      );
      console.log(`  Result: AssignedObject created with ID: \`${ao2}\``);

      // 3. Access objects by title
      console.log("\n## 2. User accesses objects by their titles");
      const access1Result = await objectManager.accessObject({
        owner: userA,
        title: "My Favorite Book",
      });
      assertNotEquals("error" in access1Result, true, "Access should succeed.");
      const { object: obj1 } = access1Result as { object: ID };
      assertEquals(obj1, object1, "Should return the correct object.");
      console.log(
        `- Action: accessObject({ owner: "${userA}", title: "My Favorite Book" })`,
      );
      console.log(`  Result: Object \`${obj1}\``);

      // 4. Modify the title
      console.log("\n## 3. User changes the title of an assigned object");
      const changeTitleResult = await objectManager.changeAssignedObjectTitle({
        owner: userA,
        oldTitle: "My Favorite Book",
        newTitle: "All-Time Favorite Book",
      });
      assertEquals(
        "error" in changeTitleResult,
        false,
        "Changing title should succeed.",
      );
      console.log(
        `- Action: changeAssignedObjectTitle({ owner: "${userA}", oldTitle: "My Favorite Book", newTitle: "All-Time Favorite Book" })`,
      );
      console.log(`  Result: Title changed successfully`);

      // 5. Modify the description
      console.log("\n## 4. User changes the description");
      const changeDescResult = await objectManager
        .changeAssignedObjectDescription({
          owner: userA,
          title: "All-Time Favorite Book",
          newDescription: "An inspiring tale of courage and discovery",
        });
      assertEquals(
        "error" in changeDescResult,
        false,
        "Changing description should succeed.",
      );
      console.log(
        `- Action: changeAssignedObjectDescription({ owner: "${userA}", title: "All-Time Favorite Book", newDescription: "...inspiring tale..." })`,
      );
      console.log(`  Result: Description updated successfully`);

      // 6. Verify the object binding has not changed
      const accessAfterChange = await objectManager.accessObject({
        owner: userA,
        title: "All-Time Favorite Book",
      });
      const { object: objAfter } = accessAfterChange as { object: ID };
      assertEquals(
        objAfter,
        object1,
        "The object binding should remain the same after modifications.",
      );

      console.log("\n✅ Principle successfully demonstrated");
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: createAssignedObject enforces invariants (no duplicate object)",
  async () => {
    const [db, client] = await testDb();
    const objectManager = new ObjectManagerConcept(db);

    try {
      console.log("\n# Testing Invariants: No Duplicate Objects Globally");
      console.log("\n## 1. Create first assigned object with object1");

      const create1Result = await objectManager.createAssignedObject({
        owner: userA,
        object: object1,
        title: "First Title",
        description: "First description",
      });
      assertNotEquals(
        "error" in create1Result,
        true,
        "First creation succeeds",
      );
      console.log(
        `✓ Created: owner="${userA}", object="${object1}", title="First Title"`,
      );

      console.log(
        "\n## 2. Try to create another assigned object with same object1",
      );
      const create2Result = await objectManager.createAssignedObject({
        owner: userB,
        object: object1,
        title: "Different Title",
        description: "Different description",
      });
      assertEquals(
        "error" in create2Result,
        true,
        "Should fail - object already assigned globally",
      );
      console.log(
        `✗ Failed as expected: object="${object1}" is already assigned`,
      );
      console.log(
        `  Error: ${(create2Result as { error: string }).error}`,
      );
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: createAssignedObject enforces invariants (no duplicate title per user)",
  async () => {
    const [db, client] = await testDb();
    const objectManager = new ObjectManagerConcept(db);

    try {
      console.log("\n# Testing Invariants: No Duplicate Title Per User");
      console.log("\n## 1. Alice creates assigned object with 'My Book'");

      const create1Result = await objectManager.createAssignedObject({
        owner: userA,
        object: object1,
        title: "My Book",
        description: "Description 1",
      });
      assertNotEquals(
        "error" in create1Result,
        true,
        "First creation succeeds",
      );
      console.log(`✓ Created: owner="${userA}", title="My Book"`);

      console.log("\n## 2. Alice tries to create another with same title");
      const create2Result = await objectManager.createAssignedObject({
        owner: userA,
        object: object2,
        title: "My Book",
        description: "Description 2",
      });
      assertEquals(
        "error" in create2Result,
        true,
        "Should fail - title already used by this user",
      );
      console.log(
        `✗ Failed as expected: user "${userA}" already has title "My Book"`,
      );
      console.log(
        `  Error: ${(create2Result as { error: string }).error}`,
      );

      console.log("\n## 3. Bob can use the same title");
      const create3Result = await objectManager.createAssignedObject({
        owner: userB,
        object: object2,
        title: "My Book",
        description: "Bob's book",
      });
      assertNotEquals(
        "error" in create3Result,
        true,
        "Bob can use same title (different user)",
      );
      console.log(
        `✓ Created: owner="${userB}", title="My Book" (different user OK)`,
      );
    } finally {
      await client.close();
    }
  },
);

Deno.test("Action: deleteAssignedObject and lifecycle", async () => {
  const [db, client] = await testDb();
  const objectManager = new ObjectManagerConcept(db);

  try {
    console.log("\n# Testing Delete and Lifecycle Management");

    // 1. Create several assigned objects
    console.log("\n## 1. Creating multiple assigned objects");
    await objectManager.createAssignedObject({
      owner: userA,
      object: object1,
      title: "Book 1",
      description: "Description 1",
    });
    await objectManager.createAssignedObject({
      owner: userA,
      object: object2,
      title: "Book 2",
      description: "Description 2",
    });
    await objectManager.createAssignedObject({
      owner: userA,
      object: object3,
      title: "Book 3",
      description: "Description 3",
    });

    let assignedObjects = await objectManager._getUserAssignedObjects({
      owner: userA,
    });
    assertEquals(
      assignedObjects.length,
      3,
      "Should have 3 assigned objects",
    );
    console.log(`✓ Created 3 assigned objects for user ${userA}`);

    // 2. Delete one
    console.log("\n## 2. Deleting one assigned object");
    const deleteResult = await objectManager.deleteAssignedObject({
      owner: userA,
      title: "Book 2",
    });
    assertEquals(
      "error" in deleteResult,
      false,
      "Deletion should succeed",
    );
    console.log(`✓ Deleted: owner="${userA}", title="Book 2"`);

    // 3. Verify deletion
    assignedObjects = await objectManager._getUserAssignedObjects({
      owner: userA,
    });
    assertEquals(
      assignedObjects.length,
      2,
      "Should have 2 assigned objects left",
    );
    const titles = assignedObjects.map((ao) => ao.title);
    assertEquals(
      titles.includes("Book 2"),
      false,
      "Book 2 should be deleted",
    );

    // 4. Try to access deleted object
    console.log("\n## 3. Trying to access deleted object");
    const accessResult = await objectManager.accessObject({
      owner: userA,
      title: "Book 2",
    });
    assertEquals(
      "error" in accessResult,
      true,
      "Accessing deleted object should fail",
    );
    console.log(
      `✗ Access failed as expected: ${
        (accessResult as { error: string }).error
      }`,
    );

    // 5. Recreate with same object (now allowed)
    console.log("\n## 4. Recreating with the same object (now allowed)");
    const recreateResult = await objectManager.createAssignedObject({
      owner: userA,
      object: object2,
      title: "Book 2 Again",
      description: "New description",
    });
    assertEquals(
      "error" in recreateResult,
      false,
      "Recreating should succeed now that old assignment is deleted",
    );
    console.log(`✓ Recreated: object="${object2}" with new title`);
  } finally {
    await client.close();
  }
});

Deno.test("Action: changeAssignedObjectTitle with validation", async () => {
  const [db, client] = await testDb();
  const objectManager = new ObjectManagerConcept(db);

  try {
    console.log("\n# Testing Title Changes and Validation");

    // Setup
    console.log("\n## 1. Create initial assigned objects");
    await objectManager.createAssignedObject({
      owner: userA,
      object: object1,
      title: "Original Title",
      description: "Description",
    });
    await objectManager.createAssignedObject({
      owner: userA,
      object: object2,
      title: "Another Title",
      description: "Description",
    });
    console.log("✓ Setup complete");

    // Valid title change
    console.log("\n## 2. Valid title change");
    const changeResult = await objectManager.changeAssignedObjectTitle({
      owner: userA,
      oldTitle: "Original Title",
      newTitle: "Updated Title",
    });
    assertEquals(
      "error" in changeResult,
      false,
      "Valid title change should succeed",
    );
    console.log("✓ Changed: 'Original Title' → 'Updated Title'");

    // Try to change to existing title
    console.log("\n## 3. Attempt to change to existing title");
    const existingTitleResult = await objectManager.changeAssignedObjectTitle({
      owner: userA,
      oldTitle: "Updated Title",
      newTitle: "Another Title",
    });
    assertEquals(
      "error" in existingTitleResult,
      true,
      "Should fail - new title already exists",
    );
    console.log(
      `✗ Failed as expected: title "Another Title" already exists`,
    );

    // Try to change non-existent object
    console.log("\n## 4. Attempt to change non-existent object");
    const nonexistentResult = await objectManager.changeAssignedObjectTitle({
      owner: userA,
      oldTitle: "Non-existent Title",
      newTitle: "Some Title",
    });
    assertEquals(
      "error" in nonexistentResult,
      true,
      "Should fail - object doesn't exist",
    );
    console.log("✗ Failed as expected: object doesn't exist");
  } finally {
    await client.close();
  }
});

Deno.test("Action: suggestTitle async behavior", async () => {
  const [db, client] = await testDb();
  const objectManager = new ObjectManagerConcept(db);

  try {
    console.log("\n# Testing Async suggestTitle Functionality");

    // Empty state - should fail
    console.log("\n## 1. Suggest title with no assigned objects");
    const emptyResult = await objectManager.suggestTitle({ owner: userA });
    assertEquals(
      "error" in emptyResult,
      true,
      "Should fail - no objects exist",
    );
    console.log(
      `✗ Failed as expected: ${(emptyResult as { error: string }).error}`,
    );

    // Create some objects
    console.log("\n## 2. Create assigned objects");
    await objectManager.createAssignedObject({
      owner: userA,
      object: object1,
      title: "First Object",
      description: "Description 1",
    });
    await objectManager.createAssignedObject({
      owner: userA,
      object: object2,
      title: "Second Object",
      description: "Description 2",
    });
    console.log("✓ Created 2 assigned objects");

    // Get suggestion
    console.log("\n## 3. Get title suggestion");
    const suggestResult = await objectManager.suggestTitle({ owner: userA });
    assertEquals(
      "error" in suggestResult,
      false,
      "Suggestion should succeed",
    );
    const { titleSuggestion } = suggestResult as { titleSuggestion: string };
    assertExists(titleSuggestion);
    console.log(`✓ Suggested title: "${titleSuggestion}"`);

    // Verify suggestion doesn't conflict
    const suggestionWorks = await objectManager.createAssignedObject({
      owner: userA,
      object: object3,
      title: titleSuggestion,
      description: "From suggestion",
    });
    assertEquals(
      "error" in suggestionWorks,
      false,
      "Suggested title should work",
    );
    console.log(`✓ Suggested title is valid and doesn't conflict`);
  } finally {
    await client.close();
  }
});

Deno.test("Action: changeAssignedObjectDescription", async () => {
  const [db, client] = await testDb();
  const objectManager = new ObjectManagerConcept(db);

  try {
    console.log("\n# Testing Description Changes");

    // Create initial object
    console.log("\n## 1. Create assigned object");
    await objectManager.createAssignedObject({
      owner: userA,
      object: object1,
      title: "My Document",
      description: "Original description",
    });
    console.log("✓ Created with original description");

    // Change description
    console.log("\n## 2. Change description");
    const changeResult = await objectManager.changeAssignedObjectDescription({
      owner: userA,
      title: "My Document",
      newDescription: "Updated description with more details",
    });
    assertEquals(
      "error" in changeResult,
      false,
      "Changing description should succeed",
    );
    console.log("✓ Description updated");

    // Verify change
    const assignedObject = await objectManager._getAssignedObject({
      owner: userA,
      title: "My Document",
    });
    assertExists(assignedObject);
    assertEquals(
      assignedObject.description,
      "Updated description with more details",
      "Description should be updated",
    );

    // Try to change non-existent
    console.log("\n## 3. Try to change description for non-existent object");
    const nonexistentResult = await objectManager
      .changeAssignedObjectDescription({
        owner: userA,
        title: "Non-existent",
        newDescription: "Should fail",
      });
    assertEquals(
      "error" in nonexistentResult,
      true,
      "Should fail - object doesn't exist",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});
