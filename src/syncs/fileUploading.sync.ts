import { actions, Frames, Sync } from "@engine";
import { FileUploading, Requesting, Sessioning } from "@concepts";

// --- Request Upload URL ---

export const RequestUploadURLRequest: Sync = (
  { request, session, filename, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/requestUploadURL", session, filename },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([FileUploading.requestUploadURL, { owner: user, filename }]),
});

export const RequestUploadURLSuccessResponse: Sync = (
  { request, file, uploadURL },
) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/requestUploadURL" }, {
      request,
    }],
    [FileUploading.requestUploadURL, {}, { file, uploadURL }],
  ),
  then: actions([Requesting.respond, { request, file, uploadURL }]),
});

export const RequestUploadURLErrorResponse: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/requestUploadURL" }, {
      request,
    }],
    [FileUploading.requestUploadURL, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Confirm Upload ---

export const ConfirmUploadRequest: Sync = (
  { request, session, file, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/confirmUpload", session, file },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([FileUploading.confirmUpload, { file }]),
});

export const ConfirmUploadSuccessResponse: Sync = (
  { request, file: responseFile },
) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/confirmUpload" }, { request }],
    [FileUploading.confirmUpload, {}, { file: responseFile }],
  ),
  then: actions([Requesting.respond, { request, file: responseFile }]),
});

export const ConfirmUploadErrorResponse: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/confirmUpload" }, { request }],
    [FileUploading.confirmUpload, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Delete File ---

export const DeleteFileRequest: Sync = (
  { request, session, file, user, owner },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/delete", session, file },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });
    if (userFrames.length === 0) {
      return new Frames();
    }

    // Check ownership before allowing deletion
    const ownerFrames = await userFrames.query(FileUploading._getOwner, {
      file,
    }, { owner });
    // Filter to only allow deletion if the authenticated user is the owner
    return ownerFrames.filter((frame) => frame[owner] === frame[user]);
  },
  then: actions([FileUploading.delete, { file }]),
});

export const DeleteFileSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/delete" }, { request }],
    [FileUploading.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteFileErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/FileUploading/delete" }, { request }],
    [FileUploading.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Get Owner (Query) ---

export const GetOwnerRequest: Sync = (
  { request, session, file, owner, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/_getOwner", session, file },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [owner]: { error: "Invalid or expired session." },
      });
    }

    const ownerFrames = await userFrames.query(FileUploading._getOwner, {
      file,
    }, { owner });
    if (ownerFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [owner]: null };
      return new Frames(emptyResultFrame);
    }

    return ownerFrames;
  },
  then: actions([Requesting.respond, { request, owner }]),
});

// --- Get Filename (Query) ---

export const GetFilenameRequest: Sync = (
  { request, session, file, filename, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/_getFilename", session, file },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [filename]: { error: "Invalid or expired session." },
      });
    }

    const filenameFrames = await userFrames.query(FileUploading._getFilename, {
      file,
    }, { filename });
    if (filenameFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [filename]: null };
      return new Frames(emptyResultFrame);
    }

    return filenameFrames;
  },
  then: actions([Requesting.respond, { request, filename }]),
});

// --- Get Download URL (Query) ---

export const GetDownloadURLRequest: Sync = (
  { request, session, file, downloadURL, results, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/_getDownloadURL", session, file },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [results]: { error: "Invalid or expired session." },
      });
    }

    const urlFrames = await userFrames.query(FileUploading._getDownloadURL, {
      file,
    }, { downloadURL });
    if (urlFrames.length === 0) {
      // No download URL found, return empty array
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { downloadURL: string }[], and query processing extracts downloadURL
    // So downloadURL is bound to string directly. Extract and wrap in array since
    // callConceptQuery expects results to be an array.
    const urlValue = urlFrames[0][downloadURL];
    if (urlValue && typeof urlValue === "string") {
      const resultFrame = {
        ...userFrames[0],
        [results]: [{ downloadURL: urlValue }],
      };
      return new Frames(resultFrame);
    }
    // No valid URL, return empty array
    const emptyResultFrame = { ...userFrames[0], [results]: [] };
    return new Frames(emptyResultFrame);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// --- Get Files By Owner (Query) ---

export const GetFilesByOwnerRequest: Sync = (
  { request, session, user, file, filename, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/FileUploading/_getFilesByOwner", session },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({
        ...originalFrame,
        [results]: { error: "Invalid or expired session." },
      });
    }

    const fileFrames = await userFrames.query(FileUploading._getFilesByOwner, {
      owner: user,
    }, { file, filename });
    if (fileFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    return fileFrames.collectAs([file, filename], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});
