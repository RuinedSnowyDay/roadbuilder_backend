# Summary of tests for ResourceList concept

## Test coverage

1. Principle test — "Users create named lists, add resources, and manage them by index and title"

+ Creates a list
+ Appends resources
+ Accesses by index
+ Swaps resources and verifies
+ Renames the list

2. Variant tests

+ deleteResource re-indexes remaining resources: deletes middle item, verifies
  re-indexing, checks updated indices
+ swapResources exchanges resources correctly: swaps first/last and adjacent items
+ createResourceList enforces unique titles per user: blocks duplicate title per user
+ deleteResourceList removes associated resources: cascade deletes resources
+ accessResource and renameIndexedResource edge cases: valid/invalid access, rename,
  error handling
+ appendResource increments list length: verifies append updates length and indices

## Raw test output

# Trace: Fulfilling the ResourceList Operational Principle
The principle states: 'Users can create their named lists of resources. List in this context means that resources in one list can be distinguished by both title and index. They can later add, remove, or swap resources in their lists.'

## 1. User creates a resource list
- Action: createResourceList({ owner: "user:Alice", listTitle: "Reading List" })
  Result: ResourceList created with ID: `019a2e13-b346-7aef-8f00-c6d3947297e0`

## 2. User adds resources to the list
- Action: appendResource({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, resource: `resource:Article-1`, resourceTitle: "Introduction to Algorithms" })
  Result: IndexedResource created with ID: `019a2e13-b38d-727a-b573-70d4c59858d3` at index 0
- Action: appendResource({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, resource: `resource:Article-2`, resourceTitle: "Design Patterns" })
  Result: IndexedResource created with ID: `019a2e13-b3db-7251-8e52-ee1546fc3cfb` at index 1
- Action: appendResource({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, resource: `resource:Article-3`, resourceTitle: "Clean Code" })
  Result: IndexedResource created with ID: `019a2e13-b419-7290-b6f0-b90e6f8ab0c6` at index 2

## 3. User accesses resources by index
- Action: accessResource({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, index: 0 })
  Result: Retrieved IndexedResource

## 4. User swaps two resources
- Action: swapResources({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, index1: 0, index2: 2 })
  Result: Resources swapped successfully
✓ Verified swap: resource3 is now at index 0, resource1 at index 2

## 5. User renames the list
- Action: renameResourceList({ resourceList: `019a2e13-b346-7aef-8f00-c6d3947297e0`, newTitle: "Essential Reading List" })
  Result: List renamed successfully

✅ Principle successfully demonstrated
----- post-test output end -----
Principle: Users create named lists, add resources, and manage them by index and title ... ok (1s)
Action: deleteResource re-indexes remaining resources ...
------- post-test output -------

# Testing Delete Resource with Re-indexing

## 1. Create list and add 4 resources
✓ Created list with 4 resources at indices 0-3

## 2. Delete resource at index 1
✓ Deleted resource at index 1 (Item 2)
✓ Verified re-indexing: Item 3 moved from index 2→1, Item 4 from index 3→2

## 3. Try to access deleted index
✗ Failed as expected (index out of bounds)
----- post-test output end -----
Action: deleteResource re-indexes remaining resources ... ok (1s)
Action: swapResources exchanges resources correctly ...
------- post-test output -------

# Testing Resource Swapping

## 1. Create list with resources
✓ Created list with 3 resources

## 2. Swap resources at indices 0 and 2
✓ Swapped resources at indices 0 and 2
✓ Verified swap: resource1 and resource3 switched positions

## 3. Swap adjacent resources (indices 1 and 2)
✓ Adjacent swap successful: resource1 and resource2 switched

## 4. Try to swap with invalid indices
✗ Failed as expected (index out of bounds)
----- post-test output end -----
Action: swapResources exchanges resources correctly ... ok (1s)
Action: createResourceList enforces unique titles per user ...
------- post-test output -------

# Testing List Title Uniqueness

## 1. Create list with title 'My List'
✓ Created list with title 'My List'

## 2. Try to create another list with same title
✗ Failed as expected: A list with this title already exists for this user

## 3. Bob can create a list with same title
✓ Bob's list created with title 'My List'
✓ Both users have their own lists
----- post-test output end -----
Action: createResourceList enforces unique titles per user ... ok (749ms)
Action: deleteResourceList removes associated resources ...
------- post-test output -------

# Testing List Deletion with Cascade

## 1. Create multiple lists with resources
✓ Created 2 lists with resources

## 2. Delete List 1
✓ Deleted List 1
✓ List 1 resources were removed
✓ List 2 and its resources remain intact

## 3. Try to append to deleted list
✗ Failed as expected
----- post-test output end -----
Action: deleteResourceList removes associated resources ... ok (982ms)
Action: accessResource and renameIndexedResource edge cases ...
------- post-test output -------

# Testing Resource Access and Renaming

## 1. Create list and add resources
✓ Created list with 2 resources

## 2. Access resource by valid index
✓ Retrieved resource at index 1: `019a2e13-c7a2-78e7-b022-59f9bb5d392e`

## 3. Try to access invalid indices
✗ Failed as expected (negative index)
✗ Failed as expected (index out of bounds)

## 4. Rename indexed resource
✓ Renamed resource
✓ Verified title update

## 5. Try to rename non-existent resource
✗ Failed as expected
----- post-test output end -----
Action: accessResource and renameIndexedResource edge cases ... ok (925ms)
Action: appendResource increments list length ...
------- post-test output -------

# Testing Append Resource and Length Tracking

## 1. Create empty list
✓ Created list with length 0

## 2. Append first resource
✓ Length incremented to 1

## 3. Append more resources
✓ Length incremented to 3
✓ All resources have correct indices