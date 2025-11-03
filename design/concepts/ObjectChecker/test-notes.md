# Summary of tests for ObjectChecker concept

## Test coverage

1. **Principle test**: Demonstrates the operational principle

+ User creates check → marks → unmarks
+ Multiple users can mark the same object independently
+ Verifies independent user states

2. **Duplicate check prevention**: Tests createCheck invariants

+ Prevents duplicate checks for same user-object pair
+ Allows same user with different object
+ Allows different user with same object

3. **Mark/unmark lifecycle**: Tests `markObject` and unmarkObject

+ Initial state (unchecked)
+ Marking and verification
+ Idempotent marking
+ Unmarking and verification
+ Toggling multiple times

4. **Invalid check ID handling**: Tests error handling

+ Marking with invalid check ID fails
+ Unmarking with invalid check ID fails
+ Operating on deleted check fails

5. **Delete and recreation**: Tests deleteCheck

+ Delete check and verify removal
+ Operation on deleted check fails
+ Recreate check for same user-object pair
+ Delete non-existent check fails

6. **Multiple users independence**: Comprehensive scenario

+ Three users marking same objects
+ Verify independent states
+ Query operations: Tests query operations (`_getObjectChecks`, `_getUserChecks`)
+ State changes don't affect other users

All actions are covered, tests include

+ Programmatic assertions using `assertEquals`, `assertNotEquals`, `assertExists`
+ Helpful console output showing actions and results
+ Coverage of requirements and effects
+ Error cases handled properly

## Test output

# Trace: Fulfilling the ObjectChecker Operational Principle
The principle states: 'Users can independently mark objects of interest and later check or remove their markings. Each user's markings are independent, meaning multiple users can mark the same object without affecting each other's state.'

## 1. User A creates a check for an object
- Action: createCheck({ user: "user:Alice", object: "object:Task-123" })
  Result: Check created with ID: `019a4ad8-55af-7c77-ad0a-842aa011db05`

## 2. User A marks the object
- Action: markObject({ check: `019a4ad8-55af-7c77-ad0a-842aa011db05` })
  Result: Object marked successfully

## 3. User A unmarks the object
- Action: unmarkObject({ check: `019a4ad8-55af-7c77-ad0a-842aa011db05` })
  Result: Object unmarked successfully

## 4. User B independently creates a check for the same object
- Action: createCheck({ user: "user:Bob", object: "object:Task-123" })
  Result: Check created with ID: `019a4ad8-563a-73d4-9a54-0729f56a4f17`
  ✓ Verified: User A's check is unmarked, User B's check is marked - independent states

✅ Principle successfully demonstrated
----- post-test output end -----
Principle: Users independently mark objects and manage their markings ... ok (844ms)
Action: createCheck prevents duplicate checks for same user and object ...
------- post-test output -------

# Testing Invariants: No Duplicate Checks Per User-Object

## 1. Create check for user A and object1
✓ Created: user="user:Alice", object="object:Task-123", check=`019a4ad8-588c-7eed-bc7d-1e31bff77c70`

## 2. Try to create duplicate check for same user and object
✗ Failed as expected: check already exists for user="user:Alice" and object="object:Task-123"
  Error: A check already exists for this user and object

## 3. Same user can create check for different object
✓ Created: user="user:Alice", object="object:Document-456" (different object OK)

## 4. Different user can create check for same object
✓ Created: user="user:Bob", object="object:Task-123" (different user OK)
----- post-test output end -----
Action: createCheck prevents duplicate checks for same user and object ... ok (644ms)
Action: markObject and unmarkObject lifecycle ...
------- post-test output -------

# Testing Mark/Unmark Lifecycle

## 1. Create check
✓ Created check: `019a4ad8-5b39-743f-bd1d-30220417f9b5` (checked: false)

## 2. Mark the object
✓ Marked check: checked is now true

## 3. Mark again (idempotent)
✓ Remained marked after second mark

## 4. Unmark the object
✓ Unmarked check: checked is now false

## 5. Unmark again (idempotent)
✓ Remained unmarked after second unmark

## 6. Toggle check state multiple times
✓ Successfully toggled check state multiple times
----- post-test output end -----
Action: markObject and unmarkObject lifecycle ... ok (924ms)
Action: markObject and unmarkObject with invalid check IDs ...
------- post-test output -------

# Testing Error Handling for Invalid Check IDs

## 1. Try to mark with invalid check ID
✗ Failed as expected: No check found with the provided check ID

## 2. Try to unmark with invalid check ID
✗ Failed as expected: No check found with the provided check ID

## 3. Create check, delete it, then try to mark
✓ Created and deleted check: `019a4ad8-5f13-7730-8b18-38818d0ece25`
✗ Failed as expected: No check found with the provided check ID
----- post-test output end -----
Action: markObject and unmarkObject with invalid check IDs ... ok (668ms)
Action: deleteCheck and recreation lifecycle ...
------- post-test output -------

# Testing Delete and Recreation Lifecycle

## 1. Create multiple checks
✓ Created 3 checks for user user:Alice
✓ Marked check2

## 2. Delete one check
✓ Deleted check: `019a4ad8-61e5-7956-91b9-601dc510cd80`
✓ Verified: check2 is no longer in user's checks

## 3. Try to operate on deleted check
✗ Failed as expected: No check found with the provided check ID

## 4. Recreate check for same user-object pair
✓ Recreated check: `019a4ad8-628a-7caf-9dee-205895b03f09` for same user-object pair
✓ New check starts with checked: false

## 5. Try to delete non-existent check
✗ Failed as expected: No check found with the provided check ID to delete
----- post-test output end -----
Action: deleteCheck and recreation lifecycle ... ok (874ms)
Scenario: Multiple users marking same objects independently ...
------- post-test output -------

# Testing Independent User States: Multiple Users, Same Objects

## 1. Three users create checks for the same objects
✓ Created checks: Alice (object:Task-123, object:Document-456), Bob (object:Task-123, object:Document-456), Charlie (object:Task-123)
✓ All checks start as unchecked

## 2. User A marks their check for object1
✓ User A marked; User B and C remain unmarked (independent states)

## 3. User B marks their check for object1
✓ User B marked; User A remains marked, C unmarked

## 4. User A unmarks their check for object1
✓ User A unmarked; User B remains marked, C unmarked (independent)

## 5. Query all checks for object1
✓ Found 3 checks for object1, 1 marked

## 6. Query all checks for User A
✓ User A has 2 checks, 0 marked

✅ Independence of user states successfully demonstrated
----- post-test output end -----
Scenario: Multiple users marking same objects independently ... ok (998ms)