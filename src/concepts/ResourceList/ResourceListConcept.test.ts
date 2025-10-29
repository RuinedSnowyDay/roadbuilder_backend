import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ResourceListConcept from "./ResourceListConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const resource1 = "resource:Article-1" as ID;
const resource2 = "resource:Article-2" as ID;
const resource3 = "resource:Article-3" as ID;
const resource4 = "resource:Article-4" as ID;
const resource5 = "resource:Article-5" as ID;

Deno.test(
  "Principle: Users create named lists, add resources, and manage them by index and title",
  async () => {
    const [db, client] = await testDb();
    const resourceListConcept = new ResourceListConcept(db);

    try {
      console.log(
        "\n# Trace: Fulfilling the ResourceList Operational Principle",
      );
      console.log(
        "The principle states: 'Users can create their named lists of resources. List in this context means that resources in one list can be distinguished by both title and index. They can later add, remove, or swap resources in their lists.'",
      );

      // 1. Create a resource list
      console.log("\n## 1. User creates a resource list");
      const createListResult = await resourceListConcept.createResourceList({
        owner: userA,
        listTitle: "Reading List",
      });
      assertNotEquals(
        "error" in createListResult,
        true,
        "Creating list should succeed.",
      );
      const { newResourceList } = createListResult as { newResourceList: ID };
      console.log(
        `- Action: createResourceList({ owner: "${userA}", listTitle: "Reading List" })`,
      );
      console.log(
        `  Result: ResourceList created with ID: \`${newResourceList}\``,
      );

      // 2. Append resources to the list
      console.log("\n## 2. User adds resources to the list");
      const append1Result = await resourceListConcept.appendResource({
        resourceList: newResourceList,
        resource: resource1,
        resourceTitle: "Introduction to Algorithms",
      });
      assertNotEquals(
        "error" in append1Result,
        true,
        "Appending resource 1 should succeed.",
      );
      const { newIndexedResource: ir1 } = append1Result as {
        newIndexedResource: ID;
      };
      console.log(
        `- Action: appendResource({ resourceList: \`${newResourceList}\`, resource: \`${resource1}\`, resourceTitle: "Introduction to Algorithms" })`,
      );
      console.log(
        `  Result: IndexedResource created with ID: \`${ir1}\` at index 0`,
      );

      const append2Result = await resourceListConcept.appendResource({
        resourceList: newResourceList,
        resource: resource2,
        resourceTitle: "Design Patterns",
      });
      assertNotEquals(
        "error" in append2Result,
        true,
        "Appending resource 2 should succeed.",
      );
      const { newIndexedResource: ir2 } = append2Result as {
        newIndexedResource: ID;
      };
      console.log(
        `- Action: appendResource({ resourceList: \`${newResourceList}\`, resource: \`${resource2}\`, resourceTitle: "Design Patterns" })`,
      );
      console.log(
        `  Result: IndexedResource created with ID: \`${ir2}\` at index 1`,
      );

      const append3Result = await resourceListConcept.appendResource({
        resourceList: newResourceList,
        resource: resource3,
        resourceTitle: "Clean Code",
      });
      assertNotEquals(
        "error" in append3Result,
        true,
        "Appending resource 3 should succeed.",
      );
      const { newIndexedResource: ir3 } = append3Result as {
        newIndexedResource: ID;
      };
      console.log(
        `- Action: appendResource({ resourceList: \`${newResourceList}\`, resource: \`${resource3}\`, resourceTitle: "Clean Code" })`,
      );
      console.log(
        `  Result: IndexedResource created with ID: \`${ir3}\` at index 2`,
      );

      // 3. Access resources by index
      console.log("\n## 3. User accesses resources by index");
      const access0Result = await resourceListConcept.accessResource({
        resourceList: newResourceList,
        index: 0,
      });
      assertNotEquals(
        "error" in access0Result,
        true,
        "Accessing index 0 should succeed.",
      );
      console.log(
        `- Action: accessResource({ resourceList: \`${newResourceList}\`, index: 0 })`,
      );
      console.log(`  Result: Retrieved IndexedResource`);

      // 4. Swap resources
      console.log("\n## 4. User swaps two resources");
      const swapResult = await resourceListConcept.swapResources({
        resourceList: newResourceList,
        index1: 0,
        index2: 2,
      });
      assertEquals(
        "error" in swapResult,
        false,
        "Swapping resources should succeed.",
      );
      console.log(
        `- Action: swapResources({ resourceList: \`${newResourceList}\`, index1: 0, index2: 2 })`,
      );
      console.log(`  Result: Resources swapped successfully`);

      // 5. Verify the swap took effect
      const resources = await resourceListConcept._getListResources({
        resourceList: newResourceList,
      });
      assertEquals(resources.length, 3, "Should have 3 resources");
      assertEquals(
        resources[0].resource,
        resource3,
        "First resource should now be resource3 (after swap)",
      );
      assertEquals(
        resources[2].resource,
        resource1,
        "Last resource should now be resource1 (after swap)",
      );
      console.log(
        "✓ Verified swap: resource3 is now at index 0, resource1 at index 2",
      );

      // 6. Rename the list
      console.log("\n## 5. User renames the list");
      const renameResult = await resourceListConcept.renameResourceList({
        resourceList: newResourceList,
        newTitle: "Essential Reading List",
      });
      assertEquals(
        "error" in renameResult,
        false,
        "Renaming list should succeed.",
      );
      console.log(
        `- Action: renameResourceList({ resourceList: \`${newResourceList}\`, newTitle: "Essential Reading List" })`,
      );
      console.log(`  Result: List renamed successfully`);

      console.log("\n✅ Principle successfully demonstrated");
    } finally {
      await client.close();
    }
  },
);

Deno.test("Action: deleteResource re-indexes remaining resources", async () => {
  const [db, client] = await testDb();
  const resourceListConcept = new ResourceListConcept(db);

  try {
    console.log("\n# Testing Delete Resource with Re-indexing");

    // Setup
    console.log("\n## 1. Create list and add 4 resources");
    const { newResourceList } = (await resourceListConcept.createResourceList({
      owner: userA,
      listTitle: "Test List",
    })) as { newResourceList: ID };

    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource1,
      resourceTitle: "Item 1",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource2,
      resourceTitle: "Item 2",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource3,
      resourceTitle: "Item 3",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource4,
      resourceTitle: "Item 4",
    });

    let resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(resources.length, 4, "Should have 4 resources");
    console.log("✓ Created list with 4 resources at indices 0-3");

    // Verify initial state
    assertEquals(resources[0].index, 0, "Item 1 should be at index 0");
    assertEquals(resources[1].index, 1, "Item 2 should be at index 1");
    assertEquals(resources[2].index, 2, "Item 3 should be at index 2");
    assertEquals(resources[3].index, 3, "Item 4 should be at index 3");

    // Delete middle resource (index 1)
    console.log("\n## 2. Delete resource at index 1");
    const deleteResult = await resourceListConcept.deleteResource({
      resourceList: newResourceList,
      index: 1,
    });
    assertEquals(
      "error" in deleteResult,
      false,
      "Deleting resource should succeed",
    );
    console.log("✓ Deleted resource at index 1 (Item 2)");

    // Verify re-indexing
    resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(resources.length, 3, "Should have 3 resources left");
    assertEquals(resources[0].index, 0, "Item 1 should still be at index 0");
    assertEquals(resources[0].resource, resource1, "Item 1 should be correct");
    assertEquals(resources[1].index, 1, "Item 3 should move to index 1");
    assertEquals(
      resources[1].resource,
      resource3,
      "Item 3 should be at index 1",
    );
    assertEquals(resources[2].index, 2, "Item 4 should move to index 2");
    assertEquals(
      resources[2].resource,
      resource4,
      "Item 4 should be at index 2",
    );
    console.log(
      "✓ Verified re-indexing: Item 3 moved from index 2→1, Item 4 from index 3→2",
    );

    // Verify list length was decremented
    const list = await resourceListConcept._getResourceList({
      owner: userA,
      listTitle: "Test List",
    });
    assertExists(list);
    assertEquals(list?.length, 3, "List length should be 3");

    // Try to access deleted index
    console.log("\n## 3. Try to access deleted index");
    const accessResult = await resourceListConcept.accessResource({
      resourceList: newResourceList,
      index: 3,
    });
    assertEquals(
      "error" in accessResult,
      true,
      "Should fail - index out of bounds",
    );
    console.log("✗ Failed as expected (index out of bounds)");
  } finally {
    await client.close();
  }
});

Deno.test("Action: swapResources exchanges resources correctly", async () => {
  const [db, client] = await testDb();
  const resourceListConcept = new ResourceListConcept(db);

  try {
    console.log("\n# Testing Resource Swapping");

    // Setup
    console.log("\n## 1. Create list with resources");
    const { newResourceList } = (await resourceListConcept.createResourceList({
      owner: userA,
      listTitle: "Swap Test",
    })) as { newResourceList: ID };

    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource1,
      resourceTitle: "First",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource2,
      resourceTitle: "Second",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource3,
      resourceTitle: "Third",
    });

    let resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(resources.length, 3, "Should have 3 resources");
    console.log("✓ Created list with 3 resources");

    // Verify initial order
    assertEquals(
      resources[0].resource,
      resource1,
      "Should start with resource1",
    );
    assertEquals(resources[2].resource, resource3, "Should end with resource3");

    // Swap first and last
    console.log("\n## 2. Swap resources at indices 0 and 2");
    const swapResult = await resourceListConcept.swapResources({
      resourceList: newResourceList,
      index1: 0,
      index2: 2,
    });
    assertEquals(
      "error" in swapResult,
      false,
      "Swapping resources should succeed",
    );
    console.log("✓ Swapped resources at indices 0 and 2");

    // Verify swap
    resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(
      resources[0].resource,
      resource3,
      "Index 0 should now have resource3",
    );
    assertEquals(
      resources[1].resource,
      resource2,
      "Index 1 should still have resource2",
    );
    assertEquals(
      resources[2].resource,
      resource1,
      "Index 2 should now have resource1",
    );
    console.log("✓ Verified swap: resource1 and resource3 switched positions");

    // Swap adjacent resources
    console.log("\n## 3. Swap adjacent resources (indices 1 and 2)");
    await resourceListConcept.swapResources({
      resourceList: newResourceList,
      index1: 1,
      index2: 2,
    });
    resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(
      resources[1].resource,
      resource1,
      "Index 1 should now have resource1",
    );
    assertEquals(
      resources[2].resource,
      resource2,
      "Index 2 should now have resource2",
    );
    console.log("✓ Adjacent swap successful: resource1 and resource2 switched");

    // Try invalid swap
    console.log("\n## 4. Try to swap with invalid indices");
    const invalidResult = await resourceListConcept.swapResources({
      resourceList: newResourceList,
      index1: 0,
      index2: 10,
    });
    assertEquals(
      "error" in invalidResult,
      true,
      "Should fail - index out of bounds",
    );
    console.log("✗ Failed as expected (index out of bounds)");
  } finally {
    await client.close();
  }
});

Deno.test("Action: createResourceList enforces unique titles per user", async () => {
  const [db, client] = await testDb();
  const resourceListConcept = new ResourceListConcept(db);

  try {
    console.log("\n# Testing List Title Uniqueness");

    // Create first list
    console.log("\n## 1. Create list with title 'My List'");
    const create1Result = await resourceListConcept.createResourceList({
      owner: userA,
      listTitle: "My List",
    });
    assertNotEquals(
      "error" in create1Result,
      true,
      "First list creation should succeed",
    );
    console.log("✓ Created list with title 'My List'");

    // Try to create duplicate title
    console.log("\n## 2. Try to create another list with same title");
    const create2Result = await resourceListConcept.createResourceList({
      owner: userA,
      listTitle: "My List",
    });
    assertEquals(
      "error" in create2Result,
      true,
      "Should fail - duplicate title for same user",
    );
    console.log(
      `✗ Failed as expected: ${(create2Result as { error: string }).error}`,
    );

    // Different user can have same title
    console.log("\n## 3. Bob can create a list with same title");
    const create3Result = await resourceListConcept.createResourceList({
      owner: userB,
      listTitle: "My List",
    });
    assertNotEquals(
      "error" in create3Result,
      true,
      "Different user can have same title",
    );
    console.log("✓ Bob's list created with title 'My List'");

    // Verify both lists exist
    const userALists = await resourceListConcept._getUserResourceLists({
      owner: userA,
    });
    const userBLists = await resourceListConcept._getUserResourceLists({
      owner: userB,
    });
    assertEquals(userALists.length, 1, "Alice should have 1 list");
    assertEquals(userBLists.length, 1, "Bob should have 1 list");
    console.log("✓ Both users have their own lists");
  } finally {
    await client.close();
  }
});

Deno.test("Action: deleteResourceList removes associated resources", async () => {
  const [db, client] = await testDb();
  const resourceListConcept = new ResourceListConcept(db);

  try {
    console.log("\n# Testing List Deletion with Cascade");

    // Setup - create multiple lists with resources
    console.log("\n## 1. Create multiple lists with resources");
    const { newResourceList: list1 } =
      (await resourceListConcept.createResourceList({
        owner: userA,
        listTitle: "List 1",
      })) as { newResourceList: ID };

    const { newResourceList: list2 } =
      (await resourceListConcept.createResourceList({
        owner: userA,
        listTitle: "List 2",
      })) as { newResourceList: ID };

    await resourceListConcept.appendResource({
      resourceList: list1,
      resource: resource1,
      resourceTitle: "L1 Item 1",
    });
    await resourceListConcept.appendResource({
      resourceList: list1,
      resource: resource2,
      resourceTitle: "L1 Item 2",
    });

    await resourceListConcept.appendResource({
      resourceList: list2,
      resource: resource3,
      resourceTitle: "L2 Item 1",
    });

    console.log("✓ Created 2 lists with resources");

    // Verify resources exist
    let list1Resources = await resourceListConcept._getListResources({
      resourceList: list1,
    });
    let list2Resources = await resourceListConcept._getListResources({
      resourceList: list2,
    });
    assertEquals(list1Resources.length, 2, "List 1 should have 2 resources");
    assertEquals(list2Resources.length, 1, "List 2 should have 1 resource");

    // Delete list1
    console.log("\n## 2. Delete List 1");
    const deleteResult = await resourceListConcept.deleteResourceList({
      resourceList: list1,
    });
    assertEquals(
      "error" in deleteResult,
      false,
      "Deleting list should succeed",
    );
    console.log("✓ Deleted List 1");

    // Verify list1 is gone and its resources are deleted
    list1Resources = await resourceListConcept._getListResources({
      resourceList: list1,
    });
    assertEquals(list1Resources.length, 0, "List 1 should have no resources");
    console.log("✓ List 1 resources were removed");

    // Verify list2 is intact
    list2Resources = await resourceListConcept._getListResources({
      resourceList: list2,
    });
    assertEquals(
      list2Resources.length,
      1,
      "List 2 should still have 1 resource",
    );
    console.log("✓ List 2 and its resources remain intact");

    // Try to append to deleted list
    console.log("\n## 3. Try to append to deleted list");
    const appendResult = await resourceListConcept.appendResource({
      resourceList: list1,
      resource: resource4,
      resourceTitle: "Should fail",
    });
    assertEquals(
      "error" in appendResult,
      true,
      "Should fail - list doesn't exist",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});

Deno.test(
  "Action: accessResource and renameIndexedResource edge cases",
  async () => {
    const [db, client] = await testDb();
    const resourceListConcept = new ResourceListConcept(db);

    try {
      console.log("\n# Testing Resource Access and Renaming");

      // Setup
      console.log("\n## 1. Create list and add resources");
      const { newResourceList } =
        (await resourceListConcept.createResourceList({
          owner: userA,
          listTitle: "Access Test",
        })) as { newResourceList: ID };

      const { newIndexedResource: ir1 } =
        (await resourceListConcept.appendResource({
          resourceList: newResourceList,
          resource: resource1,
          resourceTitle: "Original Title 1",
        })) as { newIndexedResource: ID };

      const { newIndexedResource: ir2 } =
        (await resourceListConcept.appendResource({
          resourceList: newResourceList,
          resource: resource2,
          resourceTitle: "Original Title 2",
        })) as { newIndexedResource: ID };

      console.log("✓ Created list with 2 resources");

      // Access valid index
      console.log("\n## 2. Access resource by valid index");
      const accessResult = await resourceListConcept.accessResource({
        resourceList: newResourceList,
        index: 1,
      });
      assertEquals(
        "error" in accessResult,
        false,
        "Accessing valid index should succeed",
      );
      const { accessedIndexedResource } = accessResult as {
        accessedIndexedResource: ID;
      };
      assertExists(accessedIndexedResource);
      console.log(
        `✓ Retrieved resource at index 1: \`${accessedIndexedResource}\``,
      );

      // Try invalid indices
      console.log("\n## 3. Try to access invalid indices");
      const negativeResult = await resourceListConcept.accessResource({
        resourceList: newResourceList,
        index: -1,
      });
      assertEquals(
        "error" in negativeResult,
        true,
        "Should fail - negative index",
      );
      console.log("✗ Failed as expected (negative index)");

      const outOfBoundsResult = await resourceListConcept.accessResource({
        resourceList: newResourceList,
        index: 10,
      });
      assertEquals(
        "error" in outOfBoundsResult,
        true,
        "Should fail - index out of bounds",
      );
      console.log("✗ Failed as expected (index out of bounds)");

      // Rename indexed resource
      console.log("\n## 4. Rename indexed resource");
      const renameResult = await resourceListConcept.renameIndexedResource({
        indexedResource: ir1,
        newTitle: "Updated Title 1",
      });
      assertEquals(
        "error" in renameResult,
        false,
        "Renaming resource should succeed",
      );
      console.log("✓ Renamed resource");

      // Verify rename
      const resources = await resourceListConcept._getListResources({
        resourceList: newResourceList,
      });
      const renamedResource = resources.find((r) => r._id === ir1);
      assertExists(renamedResource);
      assertEquals(
        renamedResource.title,
        "Updated Title 1",
        "Title should be updated",
      );
      console.log("✓ Verified title update");

      // Try to rename non-existent resource
      console.log("\n## 5. Try to rename non-existent resource");
      const nonexistentResult = await resourceListConcept.renameIndexedResource(
        {
          indexedResource: "fake:resource" as ID,
          newTitle: "Should fail",
        },
      );
      assertEquals(
        "error" in nonexistentResult,
        true,
        "Should fail - resource doesn't exist",
      );
      console.log("✗ Failed as expected");
    } finally {
      await client.close();
    }
  },
);

Deno.test("Action: appendResource increments list length", async () => {
  const [db, client] = await testDb();
  const resourceListConcept = new ResourceListConcept(db);

  try {
    console.log("\n# Testing Append Resource and Length Tracking");

    // Create list
    console.log("\n## 1. Create empty list");
    const { newResourceList } = (await resourceListConcept.createResourceList({
      owner: userA,
      listTitle: "Length Test",
    })) as { newResourceList: ID };

    let list = await resourceListConcept._getResourceList({
      owner: userA,
      listTitle: "Length Test",
    });
    assertExists(list);
    assertEquals(list.length, 0, "Initial length should be 0");
    console.log("✓ Created list with length 0");

    // Append first resource
    console.log("\n## 2. Append first resource");
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource1,
      resourceTitle: "First Resource",
    });
    list = await resourceListConcept._getResourceList({
      owner: userA,
      listTitle: "Length Test",
    });
    assertEquals(list?.length, 1, "Length should be 1");
    console.log("✓ Length incremented to 1");

    // Append more resources
    console.log("\n## 3. Append more resources");
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource2,
      resourceTitle: "Second Resource",
    });
    await resourceListConcept.appendResource({
      resourceList: newResourceList,
      resource: resource3,
      resourceTitle: "Third Resource",
    });

    list = await resourceListConcept._getResourceList({
      owner: userA,
      listTitle: "Length Test",
    });
    assertEquals(list?.length, 3, "Length should be 3");
    console.log("✓ Length incremented to 3");

    // Verify resources have correct indices
    const resources = await resourceListConcept._getListResources({
      resourceList: newResourceList,
    });
    assertEquals(resources.length, 3, "Should have 3 resources");
    assertEquals(resources[0].index, 0, "First resource should be at index 0");
    assertEquals(resources[1].index, 1, "Second resource should be at index 1");
    assertEquals(resources[2].index, 2, "Third resource should be at index 2");
    console.log("✓ All resources have correct indices");
  } finally {
    await client.close();
  }
});
