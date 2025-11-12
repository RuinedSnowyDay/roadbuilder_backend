[@sync-background](../tools/sync-background.md)

[@ObjectManager](../concepts/ObjectManager/ObjectManager.md)

[@ObjectManagerConcept.ts](../../src/concepts/ObjectManager/ObjectManagerConcept.ts)

[@UserAuthenticationConcept.ts](../../src/concepts/UserAuthentication/UserAuthenticationConcept.ts)

[@UserAuthentication](../concepts/UserAuthentication/UserAuthentication.md)

[@passthrough.ts](../../src/concepts/Requesting/passthrough.ts)

[@Sessioning](../concepts/Sessioning/Sessioning.md)

[@SessioningConcept.ts](../../src/concepts/Sessioning/SessioningConcept.ts)

# prompt: what are the syncs I should use for ObjectManager concept in relation to authentication?
# response:

Excellent question. To make the `ObjectManager` concept functional and secure, you need to create synchronizations that handle the full request/response cycle, including authentication and authorization. This involves linking the `Requesting`, `UserAuthentication`, `Sessioning`, and `ObjectManager` concepts together.

Here are the synchronizations you should use, split into two logical files for clarity: one for core authentication (`auth.sync.ts`) and one specifically for the `ObjectManager` logic (`objectManager.sync.ts`).

### 1. Core Authentication Synchronizations

First, we need to handle user registration, login, and session management. A user must log in to get a session, which is then used to authorize their actions with the `ObjectManager`.

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

1.  A `...Request` sync catches an incoming `Requesting.request`.
2.  It uses the `session` ID from the request to query `Sessioning._getUser` in the `where` clause. This authenticates the request and retrieves the `user` ID.
3.  It then triggers the appropriate `ObjectManager` action, passing the retrieved `user` ID as the `owner`.
4.  Separate `...Response` and `...ResponseError` syncs catch the result of the `ObjectManager` action and formulate the final HTTP response.

# file: src/syncs/objectManager.sync.ts

```typescript
import { actions, Frames, Sync } from "@engine";
import { ObjectManager, Requesting, Sessioning } from "@concepts";

// --- Create Assigned Object ---

export const CreateAssignedObjectRequest: Sync = (
  { session, object, title, description, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/createAssignedObject", session, object, title, description },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([
    ObjectManager.createAssignedObject,
    { owner: user, object, title, description },
  ]),
});

export const CreateAssignedObjectResponse: Sync = ({ request, assignedObject, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectManager/createAssignedObject" }, { request }],
    [ObjectManager.createAssignedObject, {}, { assignedObject, error }],
  ),
  then: actions([Requesting.respond, { request, assignedObject, error }]),
});

// --- Access Object ---

export const AccessObjectRequest: Sync = ({ session, title, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/accessObject", session, title },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([ObjectManager.accessObject, { owner: user, title }]),
});

export const AccessObjectResponse: Sync = ({ request, object, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectManager/accessObject" }, { request }],
    [ObjectManager.accessObject, {}, { object, error }],
  ),
  then: actions([Requesting.respond, { request, object, error }]),
});

// --- Delete Assigned Object ---

export const DeleteAssignedObjectRequest: Sync = ({ session, title, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/deleteAssignedObject", session, title },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([ObjectManager.deleteAssignedObject, { owner: user, title }]),
});

export const DeleteAssignedObjectResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectManager/deleteAssignedObject" }, { request }],
    [ObjectManager.deleteAssignedObject, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Change Title ---

export const ChangeTitleRequest: Sync = (
  { session, oldTitle, newTitle, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/changeAssignedObjectTitle", session, oldTitle, newTitle },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([
    ObjectManager.changeAssignedObjectTitle,
    { owner: user, oldTitle, newTitle },
  ]),
});

export const ChangeTitleResponse: Sync = ({ request, error }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/ObjectManager/changeAssignedObjectTitle" },
      { request },
    ],
    [ObjectManager.changeAssignedObjectTitle, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Change Description ---

export const ChangeDescriptionRequest: Sync = (
  { session, title, newDescription, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/changeAssignedObjectDescription", session, title, newDescription },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([
    ObjectManager.changeAssignedObjectDescription,
    { owner: user, title, newDescription },
  ]),
});

export const ChangeDescriptionResponse: Sync = ({ request, error }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/ObjectManager/changeAssignedObjectDescription" },
      { request },
    ],
    [ObjectManager.changeAssignedObjectDescription, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Suggest Title ---

export const SuggestTitleRequest: Sync = ({ session, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/suggestTitle", session },
    {},
  ]),
  where: (frames) => frames.query(Sessioning._getUser, { session }, { user }),
  then: actions([ObjectManager.suggestTitle, { owner: user }]),
});

export const SuggestTitleResponse: Sync = ({ request, titleSuggestion, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectManager/suggestTitle" }, { request }],
    [ObjectManager.suggestTitle, {}, { titleSuggestion, error }],
  ),
  then: actions([Requesting.respond, { request, titleSuggestion, error }]),
});

// --- Get User's Assigned Objects (Query) ---

export const GetUserAssignedObjectsRequest: Sync = ({ request, session, user, doc, results }) => ({
    when: actions([
        Requesting.request,
        { path: "/ObjectManager/_getUserAssignedObjects", session },
        { request }
    ]),
    where: async (frames) => {
        // Authenticate the session to get the user
        const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
        if (userFrames.length === 0) {
            // If session is invalid, create a frame with an error to respond with
            const errorFrame = {...frames[0], [results]: { error: "Invalid or expired session." }};
            return new Frames(errorFrame);
        }

        // Fetch the assigned objects for the authenticated user
        const objectFrames = await userFrames.query(ObjectManager._getUserAssignedObjects, { owner: user }, { doc });
        if (objectFrames.length === 0) {
            // If the user has no objects, create a frame with an empty array for the results
            const emptyResultFrame = {...userFrames[0], [results]: []};
            return new Frames(emptyResultFrame);
        }

        // If there are objects, collect them all into a single 'results' array
        return objectFrames.collectAs([doc], results);
    },
    then: actions([
        Requesting.respond, { request, results }
    ]),
});
```

By adding these two files to your `src/syncs/` directory, you will have a fully functional and secure API for your `ObjectManager` concept, complete with user registration, login, and session-based authorization for every action.