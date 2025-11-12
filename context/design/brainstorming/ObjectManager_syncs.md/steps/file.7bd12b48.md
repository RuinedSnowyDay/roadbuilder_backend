---
timestamp: 'Mon Nov 10 2025 17:32:00 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_173200.72d2b627.md]]'
content_id: 7bd12b48e6809eb1a95877b19b7e2b883dac0626f3906519af3b7778ad4a2010
---

# file: src/syncs/auth.sync.ts

```typescript
import { actions, Sync } from "@engine";
import { Requesting, Sessioning, UserAuthentication } from "@concepts";

/**
 * @sync UserRegistrationRequest
 * @description Triggers user registration when a request is made.
 */
export const UserRegistrationRequest: Sync = ({ username, password }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuthentication/register", username, password },
    {},
  ]),
  then: actions([
    UserAuthentication.register,
    { username, password },
  ]),
});

/**
 * @sync UserRegistrationResponse
 * @description Responds to the registration request with the new user's ID or an error.
 */
export const UserRegistrationResponse: Sync = ({ request, user, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/register" }, { request }],
    [UserAuthentication.register, {}, { user, error }],
  ),
  then: actions([Requesting.respond, { request, user, error }]),
});

/**
 * @sync UserLoginRequest
 * @description Triggers user login when a request is made.
 */
export const UserLoginRequest: Sync = ({ username, password }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuthentication/login", username, password },
    {},
  ]),
  then: actions([UserAuthentication.login, { username, password }]),
});

/**
 * @sync UserLoginSuccess
 * @description When login is successful, create a new session for the user.
 */
export const UserLoginSuccess: Sync = ({ user }) => ({
  when: actions(
    [UserAuthentication.login, {}, { user }],
  ),
  then: actions(
    [Sessioning.create, { user }],
  ),
});

/**
 * @sync UserLoginResponse
 * @description Responds to the original login request with the new session ID after a successful login and session creation.
 */
export const UserLoginResponse: Sync = ({ request, session }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    // Note: We wait for Sessioning.create, which was triggered by a successful login
    [Sessioning.create, {}, { session }],
  ),
  then: actions([Requesting.respond, { request, session }]),
});

/**
 * @sync UserLoginErrorResponse
 * @description Responds to the login request with an error if login fails.
 */
export const UserLoginErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    [UserAuthentication.login, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});
```

### 2. ObjectManager Synchronizations

These synchronizations implement the logic for all `ObjectManager` actions. They follow a consistent pattern:

1. A `...Request` sync catches an incoming `Requesting.request`.
2. It uses the `session` ID from the request to query `Sessioning._getUser` in the `where` clause. This authenticates the request and retrieves the `user` ID.
3. It then triggers the appropriate `ObjectManager` action, passing the retrieved `user` ID as the `owner`.
4. Separate `...Response` and `...ResponseError` syncs catch the result of the `ObjectManager` action and formulate the final HTTP response.
