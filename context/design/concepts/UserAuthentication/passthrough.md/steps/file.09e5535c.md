---
timestamp: 'Mon Nov 10 2025 17:47:36 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_174736.63cf8452.md]]'
content_id: 09e5535cdedb815fc56c29ca46361abee63100aea4494b84ec6908bcd3f7306a
---

# file: src/concepts/Requesting/passthrough.ts

This update configures which `UserAuthentication` routes are publicly accessible and which require synchronizations for more complex logic like session management.

```typescript
/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // UserAuthentication: Public endpoints for registration and user lookup.
  "/api/UserAuthentication/register": "Public endpoint for new user registration.",
  "/api/UserAuthentication/_getUserByUsername": "Public query to check for username existence or find a user.",
  "/api/UserAuthentication/_getUsername": "Public query to get a username from a user ID.",

  // Feel free to delete these example inclusions
  "/api/LikertSurvey/_getSurveyQuestions": "this is a public query",
  "/api/LikertSurvey/_getSurveyResponses": "responses are public",
  "/api/LikertSurvey/_getRespondentAnswers": "answers are visible",
  "/api/LikertSurvey/submitResponse": "allow anyone to submit response",
  "/api/LikertSurvey/updateResponse": "allow anyone to update their response",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // UserAuthentication: Login and Logout require session management via syncs.
  "/api/UserAuthentication/login",
  "/api/logout", // Custom route for logging out.

  // Feel free to delete these example exclusions
  "/api/LikertSurvey/createSurvey",
  "/api/LikertSurvey/addQuestion",
  "/api/ObjectManager/createAssignedObject",
  "/api/ObjectManager/accessObject",
  "/api/ObjectManager/deleteAssignedObject",
  "/api/ObjectManager/changeAssignedObjectTitle",
  "/api/ObjectManager/changeAssignedObjectDescription",
  "/api/ObjectManager/suggestTitle",
  "/api/ObjectManager/_getUserAssignedObjects",
  "/api/ObjectManager/_getObjectAssignments",
  "/api/ObjectManager/_getAssignedObject",
];
```
