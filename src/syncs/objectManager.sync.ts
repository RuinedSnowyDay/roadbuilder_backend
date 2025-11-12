import { actions, Frames, Sync } from "@engine";
import { ObjectManager, Requesting, Sessioning } from "@concepts";

// --- Create Assigned Object ---

export const CreateAssignedObjectRequest: Sync = (
  { request, session, object, title, description, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/createAssignedObject", session, object, title, description },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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

export const AccessObjectRequest: Sync = ({ request, session, title, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/accessObject", session, title },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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

export const DeleteAssignedObjectRequest: Sync = ({ request, session, title, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/deleteAssignedObject", session, title },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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
  { request, session, oldTitle, newTitle, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/changeAssignedObjectTitle", session, oldTitle, newTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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
  { request, session, title, newDescription, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/changeAssignedObjectDescription", session, title, newDescription },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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

export const SuggestTitleRequest: Sync = ({ request, session, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectManager/suggestTitle", session },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
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
    { request },
  ]),
  where: async (frames) => {
    // Authenticate the session to get the user
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      // If session is invalid, create a frame with an error to respond with
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    // Fetch the assigned objects for the authenticated user
    const objectFrames = await userFrames.query(ObjectManager._getUserAssignedObjects, { owner: user }, { doc });
    if (objectFrames.length === 0) {
      // If the user has no objects, create a frame with an empty array for the results
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // If there are objects, collect them all into a single 'results' array
    return objectFrames.collectAs([doc], results);
  },
  then: actions([
    Requesting.respond,
    { request, results },
  ]),
});

