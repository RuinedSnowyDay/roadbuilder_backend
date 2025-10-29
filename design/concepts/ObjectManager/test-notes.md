# Summary of tests for ObjectManager concept

## Test coverage

1. Principle test: "User assigns names and descriptions to objects, then modifies them"

+ Creates assigned objects
+ Accesses objects by title
+ Changes title
+ Changes description
+ Verifies object binding remains unchanged

2. Variant tests

+ createAssignedObject enforces invariants — no duplicate objects globally
+ createAssignedObject enforces invariants — no duplicate titles per user
+ deleteAssignedObject and lifecycle — delete, access, recreate
+ changeAssignedObjectTitle with validation — valid changes and error cases
+ suggestTitle async behavior — suggestion without objects and with objects
+ changeAssignedObjectDescription — update description and error handling

All actions are covered, error cases are validated, and all tests pass with no memory
leaks.

## Interesting moments

+ For some reason, model produced code that tried to use `async` functions for
  functions that don't need to be async and are not even marked as `async` in the
  specification.
+ The model also didn't write actual code for the `suggestTitle` function, but instead
  left out some template code. I copied `gemini-llm.ts` from the AI-augmented code
  assignment and semi-manually edited it to make it work.

## Raw test output

# Trace: Fulfilling the ObjectManager Operational Principle
The principle states: 'Given an object, a user can give it a name and description, becoming an owner of this object. The user that owns the object can later change its name and description, but not the object binding itself.'

## 1. User creates assigned objects
- Action: createAssignedObject({ owner: "user:Alice", object: "object:Book-123", title: "My Favorite Book" })
  Result: AssignedObject created with ID: `019a2df2-eda7-7ed7-8bb2-bc4a7104b017`
- Action: createAssignedObject({ owner: "user:Alice", object: "object:Document-456", title: "Project Plan" })
  Result: AssignedObject created with ID: `019a2df2-ee00-7011-a110-0b5c24a677a5`

## 2. User accesses objects by their titles
- Action: accessObject({ owner: "user:Alice", title: "My Favorite Book" })
  Result: Object `object:Book-123`

## 3. User changes the title of an assigned object
- Action: changeAssignedObjectTitle({ owner: "user:Alice", oldTitle: "My Favorite Book", newTitle: "All-Time Favorite Book" })
  Result: Title changed successfully

## 4. User changes the description
- Action: changeAssignedObjectDescription({ owner: "user:Alice", title: "All-Time Favorite Book", newDescription: "...inspiring tale..." })
  Result: Description updated successfully

✅ Principle successfully demonstrated
----- post-test output end -----
Principle: User assigns names and descriptions to objects, then modifies them ... ok (934ms)
Action: createAssignedObject enforces invariants (no duplicate object) ...
------- post-test output -------

# Testing Invariants: No Duplicate Objects Globally

## 1. Create first assigned object with object1
✓ Created: owner="user:Alice", object="object:Book-123", title="First Title"

## 2. Try to create another assigned object with same object1
✗ Failed as expected: object="object:Book-123" is already assigned
  Error: Object has already been assigned to another user
----- post-test output end -----
Action: createAssignedObject enforces invariants (no duplicate object) ... ok (643ms)
Action: createAssignedObject enforces invariants (no duplicate title per user) ...
------- post-test output -------

# Testing Invariants: No Duplicate Title Per User

## 1. Alice creates assigned object with 'My Book'
✓ Created: owner="user:Alice", title="My Book"

## 2. Alice tries to create another with same title
✗ Failed as expected: user "user:Alice" already has title "My Book"
  Error: User already has an assigned object with this title

## 3. Bob can use the same title
✓ Created: owner="user:Bob", title="My Book" (different user OK)
----- post-test output end -----
Action: createAssignedObject enforces invariants (no duplicate title per user) ... ok (718ms)
Action: deleteAssignedObject and lifecycle ...
------- post-test output -------

# Testing Delete and Lifecycle Management

## 1. Creating multiple assigned objects
✓ Created 3 assigned objects for user user:Alice

## 2. Deleting one assigned object
✓ Deleted: owner="user:Alice", title="Book 2"

## 3. Trying to access deleted object
✗ Access failed as expected: No assigned object found with this owner and title

## 4. Recreating with the same object (now allowed)
✓ Recreated: object="object:Document-456" with new title
----- post-test output end -----
Action: deleteAssignedObject and lifecycle ... ok (894ms)
Action: changeAssignedObjectTitle with validation ...
------- post-test output -------

# Testing Title Changes and Validation

## 1. Create initial assigned objects
✓ Setup complete

## 2. Valid title change
✓ Changed: 'Original Title' → 'Updated Title'

## 3. Attempt to change to existing title
✗ Failed as expected: title "Another Title" already exists

## 4. Attempt to change non-existent object
✗ Failed as expected: object doesn't exist
----- post-test output end -----
Action: changeAssignedObjectTitle with validation ... ok (833ms)
Action: suggestTitle async behavior ...
------- post-test output -------

# Testing Async suggestTitle Functionality

## 1. Suggest title with no assigned objects
✗ Failed as expected: No assigned objects found for this user to suggest a title

## 2. Create assigned objects
✓ Created 2 assigned objects

## 3. Get title suggestion
✓ Suggested title: "Third Iteration"
✓ Suggested title is valid and doesn't conflict
----- post-test output end -----
Action: suggestTitle async behavior ... ok (1s)
Action: changeAssignedObjectDescription ...
------- post-test output -------

# Testing Description Changes

## 1. Create assigned object
✓ Created with original description

## 2. Change description
✓ Description updated

## 3. Try to change description for non-existent object
✗ Failed as expected
----- post-test output end -----
Action: changeAssignedObjectDescription ... ok (703ms)
  ```