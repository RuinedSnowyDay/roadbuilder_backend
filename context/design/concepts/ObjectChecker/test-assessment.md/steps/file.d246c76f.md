---
timestamp: 'Mon Nov 03 2025 12:48:48 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251103_124848.5be3ec28.md]]'
content_id: d246c76f98901ccdade4f9dcbaf03f7d8a68af10c9e6addad09e4c9b8294a30d
---

# file: src/concepts/ObjectChecker/ObjectCheckerConcept.test.ts

```typescript
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ObjectCheckerConcept from "./ObjectCheckerConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const userC = "user:Charlie" as ID;
const object1 = "object:Task-123" as ID;
const object2 = "object:Document-456" as ID;
const object3 = "object:Item-789" as ID;

Deno.test(
  "Principle: Users independently mark objects and manage their markings",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log(
        "\n# Trace: Fulfilling the ObjectChecker Operational Principle",
      );
      console.log(
        "The principle states: 'Users can independently mark objects of interest and later check or remove their markings. Each user's markings are independent, meaning multiple users can mark the same object without affecting each other's state.'",
      );

      // 1. User A creates a check for an object
      console.log("\n## 1. User A creates a check for an object");
      const create1Result = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      assertNotEquals(
        "error" in create1Result,
        true,
        "Creating the first check should succeed.",
      );
      const { newCheck: check1 } = create1Result as { newCheck: ID };
      console.log(
        `- Action: createCheck({ user: "${userA}", object: "${object1}" })`,
      );
      console.log(`  Result: Check created with ID: \`${check1}\``);

      // 2. User A marks the object
      console.log("\n## 2. User A marks the object");
      const markResult = await objectChecker.markObject({ check: check1 });
      assertEquals(
        "error" in markResult,
        false,
        "Marking should succeed.",
      );
      console.log(`- Action: markObject({ check: \`${check1}\` })`);
      console.log(`  Result: Object marked successfully`);

      // Verify the check is marked
      const checkAfterMark = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertExists(checkAfterMark, "Check should exist");
      assertEquals(
        checkAfterMark.checked,
        true,
        "Check should be marked as checked",
      );

      // 3. User A unmarks the object
      console.log("\n## 3. User A unmarks the object");
      const unmarkResult = await objectChecker.unmarkObject({ check: check1 });
      assertEquals(
        "error" in unmarkResult,
        false,
        "Unmarking should succeed.",
      );
      console.log(`- Action: unmarkObject({ check: \`${check1}\` })`);
      console.log(`  Result: Object unmarked successfully`);

      // Verify the check is unmarked
      const checkAfterUnmark = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertExists(checkAfterUnmark, "Check should still exist");
      assertEquals(
        checkAfterUnmark.checked,
        false,
        "Check should be marked as unchecked",
      );

      // 4. User B independently creates a check for the same object
      console.log(
        "\n## 4. User B independently creates a check for the same object",
      );
      const create2Result = await objectChecker.createCheck({
        user: userB,
        object: object1,
      });
      assertNotEquals(
        "error" in create2Result,
        true,
        "User B should be able to create a check for the same object.",
      );
      const { newCheck: check2 } = create2Result as { newCheck: ID };
      console.log(
        `- Action: createCheck({ user: "${userB}", object: "${object1}" })`,
      );
      console.log(`  Result: Check created with ID: \`${check2}\``);

      // Verify independence - User A's check is still unmarked
      const checkA = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        checkA?.checked,
        false,
        "User A's check should remain independent and unmarked",
      );

      // User B marks their check
      await objectChecker.markObject({ check: check2 });
      const checkB = await objectChecker._getCheck({
        user: userB,
        object: object1,
      });
      assertEquals(
        checkB?.checked,
        true,
        "User B's check should be marked",
      );
      console.log(
        `  ✓ Verified: User A's check is unmarked, User B's check is marked - independent states`,
      );

      console.log("\n✅ Principle successfully demonstrated");
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: createCheck prevents duplicate checks for same user and object",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log("\n# Testing Invariants: No Duplicate Checks Per User-Object");

      // 1. Create first check
      console.log("\n## 1. Create check for user A and object1");
      const create1Result = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      assertNotEquals(
        "error" in create1Result,
        true,
        "First creation should succeed",
      );
      const { newCheck: check1 } = create1Result as { newCheck: ID };
      console.log(
        `✓ Created: user="${userA}", object="${object1}", check=\`${check1}\``,
      );

      // 2. Try to create duplicate check
      console.log("\n## 2. Try to create duplicate check for same user and object");
      const create2Result = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        "error" in create2Result,
        true,
        "Should fail - check already exists for this user-object pair",
      );
      console.log(
        `✗ Failed as expected: check already exists for user="${userA}" and object="${object1}"`,
      );
      console.log(
        `  Error: ${(create2Result as { error: string }).error}`,
      );

      // 3. Same user can create check for different object
      console.log("\n## 3. Same user can create check for different object");
      const create3Result = await objectChecker.createCheck({
        user: userA,
        object: object2,
      });
      assertNotEquals(
        "error" in create3Result,
        true,
        "Should succeed - different object",
      );
      console.log(
        `✓ Created: user="${userA}", object="${object2}" (different object OK)`,
      );

      // 4. Different user can create check for same object
      console.log("\n## 4. Different user can create check for same object");
      const create4Result = await objectChecker.createCheck({
        user: userB,
        object: object1,
      });
      assertNotEquals(
        "error" in create4Result,
        true,
        "Should succeed - different user",
      );
      console.log(
        `✓ Created: user="${userB}", object="${object1}" (different user OK)`,
      );
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: markObject and unmarkObject lifecycle",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log("\n# Testing Mark/Unmark Lifecycle");

      // 1. Create check (starts as unchecked)
      console.log("\n## 1. Create check");
      const createResult = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      const { newCheck: check1 } = createResult as { newCheck: ID };
      let check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        check?.checked,
        false,
        "New check should start as unchecked",
      );
      console.log(
        `✓ Created check: \`${check1}\` (checked: false)`,
      );

      // 2. Mark the object
      console.log("\n## 2. Mark the object");
      const markResult = await objectChecker.markObject({ check: check1 });
      assertEquals(
        "error" in markResult,
        false,
        "Marking should succeed",
      );
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        check?.checked,
        true,
        "Check should be marked after markObject",
      );
      console.log(`✓ Marked check: checked is now true`);

      // 3. Mark again (should still be true, no error)
      console.log("\n## 3. Mark again (idempotent)");
      const markAgainResult = await objectChecker.markObject({
        check: check1,
      });
      assertEquals(
        "error" in markAgainResult,
        false,
        "Marking again should not error",
      );
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        check?.checked,
        true,
        "Check should remain marked",
      );
      console.log(`✓ Remained marked after second mark`);

      // 4. Unmark the object
      console.log("\n## 4. Unmark the object");
      const unmarkResult = await objectChecker.unmarkObject({
        check: check1,
      });
      assertEquals(
        "error" in unmarkResult,
        false,
        "Unmarking should succeed",
      );
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        check?.checked,
        false,
        "Check should be unmarked after unmarkObject",
      );
      console.log(`✓ Unmarked check: checked is now false`);

      // 5. Unmark again (should still be false, no error)
      console.log("\n## 5. Unmark again (idempotent)");
      const unmarkAgainResult = await objectChecker.unmarkObject({
        check: check1,
      });
      assertEquals(
        "error" in unmarkAgainResult,
        false,
        "Unmarking again should not error",
      );
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        check?.checked,
        false,
        "Check should remain unmarked",
      );
      console.log(`✓ Remained unmarked after second unmark`);

      // 6. Toggle back and forth
      console.log("\n## 6. Toggle check state multiple times");
      await objectChecker.markObject({ check: check1 });
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(check?.checked, true, "Should be marked");
      await objectChecker.unmarkObject({ check: check1 });
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(check?.checked, false, "Should be unmarked");
      await objectChecker.markObject({ check: check1 });
      check = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(check?.checked, true, "Should be marked again");
      console.log(`✓ Successfully toggled check state multiple times`);
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: markObject and unmarkObject with invalid check IDs",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log("\n# Testing Error Handling for Invalid Check IDs");

      // Create a valid check to get a valid ID format
      const createResult = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      const { newCheck: validCheck } = createResult as {
        newCheck: ID;
      };

      // Use an invalid check ID (different from valid one)
      const invalidCheck = "invalid:check:123" as ID;

      // 1. Try to mark with invalid check ID
      console.log("\n## 1. Try to mark with invalid check ID");
      const markResult = await objectChecker.markObject({
        check: invalidCheck,
      });
      assertEquals(
        "error" in markResult,
        true,
        "Should fail - check doesn't exist",
      );
      console.log(
        `✗ Failed as expected: ${(markResult as { error: string }).error}`,
      );

      // 2. Try to unmark with invalid check ID
      console.log("\n## 2. Try to unmark with invalid check ID");
      const unmarkResult = await objectChecker.unmarkObject({
        check: invalidCheck,
      });
      assertEquals(
        "error" in unmarkResult,
        true,
        "Should fail - check doesn't exist",
      );
      console.log(
        `✗ Failed as expected: ${(unmarkResult as { error: string }).error}`,
      );

      // 3. Try to mark with valid but deleted check ID
      console.log("\n## 3. Create check, delete it, then try to mark");
      const create2Result = await objectChecker.createCheck({
        user: userA,
        object: object2,
      });
      const { newCheck: check2 } = create2Result as { newCheck: ID };
      await objectChecker.deleteCheck({ check: check2 });
      console.log(`✓ Created and deleted check: \`${check2}\``);

      const markDeletedResult = await objectChecker.markObject({
        check: check2,
      });
      assertEquals(
        "error" in markDeletedResult,
        true,
        "Should fail - check was deleted",
      );
      console.log(
        `✗ Failed as expected: ${(markDeletedResult as { error: string }).error}`,
      );
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Action: deleteCheck and recreation lifecycle",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log("\n# Testing Delete and Recreation Lifecycle");

      // 1. Create multiple checks
      console.log("\n## 1. Create multiple checks");
      const create1Result = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      const { newCheck: check1 } = create1Result as { newCheck: ID };
      const create2Result = await objectChecker.createCheck({
        user: userA,
        object: object2,
      });
      const { newCheck: check2 } = create2Result as { newCheck: ID };
      const create3Result = await objectChecker.createCheck({
        user: userA,
        object: object3,
      });
      const { newCheck: check3 } = create3Result as { newCheck: ID };

      let userChecks = await objectChecker._getUserChecks({ user: userA });
      assertEquals(
        userChecks.length,
        3,
        "Should have 3 checks",
      );
      console.log(`✓ Created 3 checks for user ${userA}`);

      // 2. Mark one check
      await objectChecker.markObject({ check: check2 });
      console.log(`✓ Marked check2`);

      // 3. Delete one check
      console.log("\n## 2. Delete one check");
      const deleteResult = await objectChecker.deleteCheck({ check: check2 });
      assertEquals(
        "error" in deleteResult,
        false,
        "Deletion should succeed",
      );
      console.log(`✓ Deleted check: \`${check2}\``);

      // 4. Verify deletion
      userChecks = await objectChecker._getUserChecks({ user: userA });
      assertEquals(
        userChecks.length,
        2,
        "Should have 2 checks left",
      );
      const checkIds = userChecks.map((c) => c._id);
      assertEquals(
        checkIds.includes(check2),
        false,
        "check2 should be deleted",
      );
      console.log(`✓ Verified: check2 is no longer in user's checks`);

      // 5. Try to operate on deleted check
      console.log("\n## 3. Try to operate on deleted check");
      const markDeletedResult = await objectChecker.markObject({
        check: check2,
      });
      assertEquals(
        "error" in markDeletedResult,
        true,
        "Should fail - check is deleted",
      );
      console.log(
        `✗ Failed as expected: ${(markDeletedResult as { error: string }).error}`,
      );

      // 6. Recreate check for same user-object pair (now allowed)
      console.log("\n## 4. Recreate check for same user-object pair");
      const recreateResult = await objectChecker.createCheck({
        user: userA,
        object: object2,
      });
      assertEquals(
        "error" in recreateResult,
        false,
        "Recreating should succeed now that old check is deleted",
      );
      const { newCheck: check2New } = recreateResult as { newCheck: ID };
      console.log(
        `✓ Recreated check: \`${check2New}\` for same user-object pair`,
      );

      // Verify new check starts as unchecked
      const newCheck = await objectChecker._getCheck({
        user: userA,
        object: object2,
      });
      assertEquals(
        newCheck?.checked,
        false,
        "New check should start as unchecked",
      );
      console.log(`✓ New check starts with checked: false`);

      // 7. Delete non-existent check
      console.log("\n## 5. Try to delete non-existent check");
      const invalidCheck = "invalid:check:456" as ID;
      const deleteInvalidResult = await objectChecker.deleteCheck({
        check: invalidCheck,
      });
      assertEquals(
        "error" in deleteInvalidResult,
        true,
        "Should fail - check doesn't exist",
      );
      console.log(
        `✗ Failed as expected: ${(deleteInvalidResult as { error: string }).error}`,
      );
    } finally {
      await client.close();
    }
  },
);

Deno.test(
  "Scenario: Multiple users marking same objects independently",
  async () => {
    const [db, client] = await testDb();
    const objectChecker = new ObjectCheckerConcept(db);

    try {
      console.log(
        "\n# Testing Independent User States: Multiple Users, Same Objects",
      );

      // 1. Three users each create checks for the same objects
      console.log("\n## 1. Three users create checks for the same objects");
      const createA1 = await objectChecker.createCheck({
        user: userA,
        object: object1,
      });
      const { newCheck: checkA1 } = createA1 as { newCheck: ID };
      const createB1 = await objectChecker.createCheck({
        user: userB,
        object: object1,
      });
      const { newCheck: checkB1 } = createB1 as { newCheck: ID };
      const createC1 = await objectChecker.createCheck({
        user: userC,
        object: object1,
      });
      const { newCheck: checkC1 } = createC1 as { newCheck: ID };

      const createA2 = await objectChecker.createCheck({
        user: userA,
        object: object2,
      });
      const { newCheck: checkA2 } = createA2 as { newCheck: ID };
      const createB2 = await objectChecker.createCheck({
        user: userB,
        object: object2,
      });
      const { newCheck: checkB2 } = createB2 as { newCheck: ID };

      console.log(
        `✓ Created checks: Alice (${object1}, ${object2}), Bob (${object1}, ${object2}), Charlie (${object1})`,
      );

      // 2. Verify all checks start as unchecked
      const checksForObject1 = await objectChecker._getObjectChecks({
        object: object1,
      });
      assertEquals(
        checksForObject1.length,
        3,
        "Should have 3 checks for object1",
      );
      assertEquals(
        checksForObject1.every((c) => c.checked === false),
        true,
        "All checks should start as unchecked",
      );
      console.log(`✓ All checks start as unchecked`);

      // 3. User A marks their check for object1
      console.log("\n## 2. User A marks their check for object1");
      await objectChecker.markObject({ check: checkA1 });
      let checkA = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(checkA?.checked, true, "User A's check should be marked");

      // Verify other users' checks remain unchanged
      let checkB = await objectChecker._getCheck({
        user: userB,
        object: object1,
      });
      let checkC = await objectChecker._getCheck({
        user: userC,
        object: object1,
      });
      assertEquals(
        checkB?.checked,
        false,
        "User B's check should remain unmarked",
      );
      assertEquals(
        checkC?.checked,
        false,
        "User C's check should remain unmarked",
      );
      console.log(
        `✓ User A marked; User B and C remain unmarked (independent states)`,
      );

      // 4. User B marks their check for object1
      console.log("\n## 3. User B marks their check for object1");
      await objectChecker.markObject({ check: checkB1 });
      checkB = await objectChecker._getCheck({
        user: userB,
        object: object1,
      });
      assertEquals(checkB?.checked, true, "User B's check should now be marked");

      // Verify User A and C remain independent
      checkA = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      checkC = await objectChecker._getCheck({
        user: userC,
        object: object1,
      });
      assertEquals(
        checkA?.checked,
        true,
        "User A's check should remain marked",
      );
      assertEquals(
        checkC?.checked,
        false,
        "User C's check should remain unmarked",
      );
      console.log(`✓ User B marked; User A remains marked, C unmarked`);

      // 5. User A unmarks their check for object1
      console.log("\n## 4. User A unmarks their check for object1");
      await objectChecker.unmarkObject({ check: checkA1 });
      checkA = await objectChecker._getCheck({
        user: userA,
        object: object1,
      });
      assertEquals(
        checkA?.checked,
        false,
        "User A's check should now be unmarked",
      );

      // Verify others remain unchanged
      checkB = await objectChecker._getCheck({
        user: userB,
        object: object1,
      });
      checkC = await objectChecker._getCheck({
        user: userC,
        object: object1,
      });
      assertEquals(
        checkB?.checked,
        true,
        "User B's check should remain marked",
      );
      assertEquals(
        checkC?.checked,
        false,
        "User C's check should remain unmarked",
      );
      console.log(
        `✓ User A unmarked; User B remains marked, C unmarked (independent)`,
      );

      // 6. Query all checks for object1
      console.log("\n## 5. Query all checks for object1");
      const allChecksForObject1 = await objectChecker._getObjectChecks({
        object: object1,
      });
      assertEquals(
        allChecksForObject1.length,
        3,
        "Should still have 3 checks",
      );
      const checkedCount = allChecksForObject1.filter((c) => c.checked).length;
      assertEquals(checkedCount, 1, "Exactly one should be checked");
      console.log(
        `✓ Found ${allChecksForObject1.length} checks for object1, ${checkedCount} marked`,
      );

      // 7. Query all checks for User A
      console.log("\n## 6. Query all checks for User A");
      const userAChecks = await objectChecker._getUserChecks({ user: userA });
      assertEquals(userAChecks.length, 2, "User A should have 2 checks");
      const userACheckedCount = userAChecks.filter((c) => c.checked).length;
      assertEquals(userACheckedCount, 0, "User A should have 0 checked items");
      console.log(
        `✓ User A has ${userAChecks.length} checks, ${userACheckedCount} marked`,
      );

      console.log("\n✅ Independence of user states successfully demonstrated");
    } finally {
      await client.close();
    }
  },
);


```
