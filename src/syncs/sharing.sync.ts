import { actions, Frames, Sync } from "@engine";
import { Requesting, Sessioning, Sharing } from "@concepts";

// --- Share With User ---

export const ShareWithUserRequest: Sync = (
  { request, session, file, user: shareUser, authenticatedUser },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Sharing/shareWithUser", session, file, user: shareUser },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, {
      authenticatedUser,
    });
  },
  then: actions([Sharing.shareWithUser, { file, user: shareUser }]),
});

export const ShareWithUserSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Sharing/shareWithUser" }, { request }],
    [Sharing.shareWithUser, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const ShareWithUserErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Sharing/shareWithUser" }, { request }],
    [Sharing.shareWithUser, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Revoke Access ---

export const RevokeAccessRequest: Sync = (
  { request, session, file, user: revokeUser, authenticatedUser },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Sharing/revokeAccess", session, file, user: revokeUser },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, {
      authenticatedUser,
    });
  },
  then: actions([Sharing.revokeAccess, { file, user: revokeUser }]),
});

export const RevokeAccessSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Sharing/revokeAccess" }, { request }],
    [Sharing.revokeAccess, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RevokeAccessErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Sharing/revokeAccess" }, { request }],
    [Sharing.revokeAccess, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Is Shared With (Query) ---

export const IsSharedWithRequest: Sync = (
  { request, session, file, user: checkUser, access, authenticatedUser },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Sharing/_isSharedWith", session, file, user: checkUser },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      authenticatedUser,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [access]: { error: "Invalid or expired session." },
      });
    }

    const accessFrames = await userFrames.query(Sharing._isSharedWith, {
      file,
      user: checkUser,
    }, { access });
    if (accessFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [access]: false };
      return new Frames(emptyResultFrame);
    }

    return accessFrames;
  },
  then: actions([Requesting.respond, { request, access }]),
});

// --- Get Files Shared With User (Query) ---

export const GetFilesSharedWithUserRequest: Sync = (
  { request, session, file, results, authenticatedUser },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Sharing/_getFilesSharedWithUser", session },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      authenticatedUser,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [results]: { error: "Invalid or expired session." },
      });
    }

    // Use the authenticated user to get files shared with them
    const fileFrames = await userFrames.query(Sharing._getFilesSharedWithUser, {
      user: authenticatedUser,
    }, { file });
    if (fileFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    return fileFrames.collectAs([file], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});
