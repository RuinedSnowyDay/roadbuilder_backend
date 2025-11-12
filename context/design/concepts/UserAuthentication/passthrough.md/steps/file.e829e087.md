---
timestamp: 'Mon Nov 10 2025 17:47:36 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_174736.63cf8452.md]]'
content_id: e829e08770cf8a1644503fed3371458d190f452c3d977ef42437292577692069
---

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
