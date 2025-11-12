[@sync-background](../../tools/sync-background.md)

[@passthrough.ts](../../../src/concepts/Requesting/passthrough.ts)

[@API](API.md)

[@API](../ObjectManager/API.md)

[@Sessioning](../Sessioning/Sessioning.md)

[@API](../Sessioning/API.md)

[@passthrough.ts](../../../src/concepts/Requesting/passthrough.ts)

[@UserAuthenticationConcept.ts](../../../src/concepts/UserAuthentication/UserAuthenticationConcept.ts)

# prompt: come up with passthroughs and syncs for UserAuthentication concept
# response:

# solution:

Here are the passthrough route configurations and the necessary synchronizations for the `UserAuthentication` concept, integrating it with `Sessioning` for login and logout functionality.

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

# file: src/syncs/auth.sync.ts

This new file contains the synchronizations that orchestrate the login and logout flows. Login involves chaining `UserAuthentication.login` with `Sessioning.create`, and logout maps a custom `/api/logout` route to `Sessioning.delete`.

```typescript
import { actions, Sync } from "@engine";
import { Requesting, UserAuthentication, Sessioning } from "@concepts";

/**
 * This sync initiates the login process. When a request is made to the login endpoint,
 * it triggers the `UserAuthentication.login` action with the provided credentials.
 */
export const LoginRequest: Sync = ({ request, username, password }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuthentication/login", username, password },
    { request },
  ]),
  then: actions([UserAuthentication.login, { username, password }]),
});

/**
 * On a successful login, this sync takes the authenticated user and creates a new session for them.
 */
export const LoginSuccess: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    [UserAuthentication.login, {}, { user }],
  ),
  then: actions([Sessioning.create, { user }]),
});

/**
 * Once a session is created after a successful login, this sync responds to the original
 * request with the new session ID.
 */
export const LoginSuccessResponse: Sync = ({ request, session }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    [Sessioning.create, {}, { session }],
  ),
  then: actions([Requesting.respond, { request, session }]),
});

/**
 * If the login attempt fails (e.g., wrong password), this sync captures the error
 * from `UserAuthentication.login` and responds to the original request with the error message.
 */
export const LoginErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    [UserAuthentication.login, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * This sync initiates the logout process. It listens for requests on the custom `/logout`
 * endpoint and triggers the deletion of the specified session.
 */
export const LogoutRequest: Sync = ({ request, session }) => ({
  when: actions(
    [Requesting.request, { path: "/logout", session }, { request }],
  ),
  then: actions([Sessioning.delete, { session }]),
});

/**
 * After a session is successfully deleted, this sync responds to the original logout
 * request with a success status message.
 */
export const LogoutResponse: Sync = ({ request, status }) => ({
  when: actions(
    [Requesting.request, { path: "/logout" }, { request }],
    [Sessioning.delete, {}, {}], // Match successful deletion (empty output)
  ),
  then: actions([Requesting.respond, { request, status: "logged_out" }]),
});

/**
 * If session deletion fails (e.g., session not found), this sync captures the error
 * and responds to the original logout request with the error message.
 */
export const LogoutErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/logout" }, { request }],
    [Sessioning.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});
```