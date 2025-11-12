---
timestamp: 'Mon Nov 10 2025 17:10:31 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_171031.122aa537.md]]'
content_id: facc08ee81bf5b7fcc50faf5a438b8706bd94d8b63dbec11983ea10677814558
---

# response:

Based on the specification and implementation of the `ObjectManager` concept, **all of its actions and queries should be excluded from passthrough routes.**

### Core Reasoning

The fundamental reason for this is **security and authorization**. Every single action and query in the `ObjectManager` concept accepts an `owner: User` parameter.

If these were exposed as passthrough routes, a malicious actor could craft an HTTP request and specify any user's ID in the `owner` field of the JSON body. For example, they could send a request to `/api/ObjectManager/deleteAssignedObject` with the body `{"owner": "some_other_user_id", "title": "Important Document"}` and delete another user's object without their permission.

Passthrough routes offer no mechanism to verify that the `owner` specified in the request body is the same as the user who is actually logged in and making the request.

### The Correct Architectural Pattern

The intended way to interact with a concept like `ObjectManager` is to reify the requests and handle them with synchronizations that perform authentication. The flow should be:

1. A client sends a request to a custom route (e.g., `POST /api/my-objects/create`) with a **session token** and the object details (title, description).
2. The `Requesting` concept fires a `Requesting.request` action with the path and all body parameters.
3. A synchronization listens for this `Requesting.request`.
4. In the `where` clause, the sync uses the `Sessioning` concept to look up the user associated with the provided session token.
5. If a valid user is found, the `then` clause calls the appropriate `ObjectManager` action (e.g., `ObjectManager.createAssignedObject`), passing the **verified user ID** from the session as the `owner` parameter.

This pattern uses the `Sessioning` concept as an authentication guard, ensuring that users can only manage their own objects.

### Updated `passthrough.ts`

To correctly configure this, you should add all `ObjectManager` routes to the `exclusions` array in `src/concepts/Requesting/passthrough.ts`. You can also remove the `LikertSurvey` examples for clarity.
