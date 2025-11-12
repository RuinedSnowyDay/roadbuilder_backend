import { actions, Frames, Sync } from "@engine";
import { ObjectChecker, Requesting, Sessioning } from "@concepts";

// --- Create Check ---

export const CreateCheckRequest: Sync = ({ request, session, object, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/createCheck", session, object },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ObjectChecker.createCheck, { user, object }]),
});

export const CreateCheckSuccessResponse: Sync = ({ request, newCheck }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/createCheck" }, { request }],
    [ObjectChecker.createCheck, {}, { newCheck }],
  ),
  then: actions([Requesting.respond, { request, newCheck }]),
});

export const CreateCheckErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/createCheck" }, { request }],
    [ObjectChecker.createCheck, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Mark Object ---

export const MarkObjectRequest: Sync = ({ request, session, check, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/markObject", session, check },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ObjectChecker.markObject, { check }]),
});

export const MarkObjectSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/markObject" }, { request }],
    [ObjectChecker.markObject, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const MarkObjectErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/markObject" }, { request }],
    [ObjectChecker.markObject, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Unmark Object ---

export const UnmarkObjectRequest: Sync = ({ request, session, check, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/unmarkObject", session, check },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ObjectChecker.unmarkObject, { check }]),
});

export const UnmarkObjectSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/unmarkObject" }, { request }],
    [ObjectChecker.unmarkObject, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const UnmarkObjectErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/unmarkObject" }, { request }],
    [ObjectChecker.unmarkObject, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Delete Check ---

export const DeleteCheckRequest: Sync = ({ request, session, check, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/deleteCheck", session, check },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ObjectChecker.deleteCheck, { check }]),
});

export const DeleteCheckSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/deleteCheck" }, { request }],
    [ObjectChecker.deleteCheck, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteCheckErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ObjectChecker/deleteCheck" }, { request }],
    [ObjectChecker.deleteCheck, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Get User Checks (Query) ---

export const GetUserChecksRequest: Sync = ({ request, session, user, doc, results }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/_getUserChecks", session },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const checkFrames = await userFrames.query(ObjectChecker._getUserChecks, { user }, { doc });
    if (checkFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    return checkFrames.collectAs([doc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// --- Get Object Checks (Query) ---

export const GetObjectChecksRequest: Sync = ({ request, session, object, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/_getObjectChecks", session, object },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const checkFrames = await userFrames.query(ObjectChecker._getObjectChecks, { object }, { doc });
    if (checkFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    return checkFrames.collectAs([doc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// --- Get Check (Query) ---

export const GetCheckRequest: Sync = ({ request, session, object, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ObjectChecker/_getCheck", session, object },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const checkFrames = await userFrames.query(ObjectChecker._getCheck, { user, object }, { doc });
    if (checkFrames.length === 0) {
      // No check exists, return empty array
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: CheckDoc }[], and query processing extracts doc
    // So doc is bound to CheckDoc directly. Extract document and wrap in array
    // since callConceptQuery expects results to be an array.
    const docValue = checkFrames[0][doc];
    if (docValue && typeof docValue === "object") {
      const resultFrame = { ...userFrames[0], [results]: [docValue] };
      return new Frames(resultFrame);
    }
    // No valid document, return empty array
    const emptyResultFrame = { ...userFrames[0], [results]: [] };
    return new Frames(emptyResultFrame);
  },
  then: actions([Requesting.respond, { request, results }]),
});

