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