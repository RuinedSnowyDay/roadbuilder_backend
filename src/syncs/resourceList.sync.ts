import { actions, Frames, Sync } from "@engine";
import { Requesting, ResourceList, Sessioning } from "@concepts";

// --- Create Resource List ---

export const CreateResourceListRequest: Sync = ({ request, session, listTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/createResourceList", session, listTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.createResourceList, { owner: user, listTitle }]),
});

export const CreateResourceListSuccessResponse: Sync = ({ request, newResourceList }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/createResourceList" }, { request }],
    [ResourceList.createResourceList, {}, { newResourceList }],
  ),
  then: actions([Requesting.respond, { request, newResourceList }]),
});

export const CreateResourceListErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/createResourceList" }, { request }],
    [ResourceList.createResourceList, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Access Resource List ---

export const AccessResourceListRequest: Sync = ({ request, session, listTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/accessResourceList", session, listTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.accessResourceList, { owner: user, listTitle }]),
});

export const AccessResourceListSuccessResponse: Sync = ({ request, accessedResourceList }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/accessResourceList" }, { request }],
    [ResourceList.accessResourceList, {}, { accessedResourceList }],
  ),
  then: actions([Requesting.respond, { request, accessedResourceList }]),
});

export const AccessResourceListErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/accessResourceList" }, { request }],
    [ResourceList.accessResourceList, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Rename Resource List ---

export const RenameResourceListRequest: Sync = ({ request, session, resourceList, newTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/renameResourceList", session, resourceList, newTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.renameResourceList, { resourceList, newTitle }]),
});

export const RenameResourceListSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/renameResourceList" }, { request }],
    [ResourceList.renameResourceList, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RenameResourceListErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/renameResourceList" }, { request }],
    [ResourceList.renameResourceList, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Append Resource ---

export const AppendResourceRequest: Sync = ({ request, session, resourceList, resource, resourceTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/appendResource", session, resourceList, resource, resourceTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.appendResource, { resourceList, resource, resourceTitle }]),
});

export const AppendResourceSuccessResponse: Sync = ({ request, newIndexedResource }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/appendResource" }, { request }],
    [ResourceList.appendResource, {}, { newIndexedResource }],
  ),
  then: actions([Requesting.respond, { request, newIndexedResource }]),
});

export const AppendResourceErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/appendResource" }, { request }],
    [ResourceList.appendResource, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Access Resource ---

export const AccessResourceRequest: Sync = ({ request, session, resourceList, index, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/accessResource", session, resourceList, index },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.accessResource, { resourceList, index }]),
});

export const AccessResourceSuccessResponse: Sync = ({ request, accessedIndexedResource }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/accessResource" }, { request }],
    [ResourceList.accessResource, {}, { accessedIndexedResource }],
  ),
  then: actions([Requesting.respond, { request, accessedIndexedResource }]),
});

export const AccessResourceErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/accessResource" }, { request }],
    [ResourceList.accessResource, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Delete Resource ---

export const DeleteResourceRequest: Sync = ({ request, session, resourceList, index, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/deleteResource", session, resourceList, index },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.deleteResource, { resourceList, index }]),
});

export const DeleteResourceSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/deleteResource" }, { request }],
    [ResourceList.deleteResource, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteResourceErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/deleteResource" }, { request }],
    [ResourceList.deleteResource, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Swap Resources ---

export const SwapResourcesRequest: Sync = ({ request, session, resourceList, index1, index2, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/swapResources", session, resourceList, index1, index2 },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.swapResources, { resourceList, index1, index2 }]),
});

export const SwapResourcesSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/swapResources" }, { request }],
    [ResourceList.swapResources, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const SwapResourcesErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/swapResources" }, { request }],
    [ResourceList.swapResources, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Move Resource ---

export const MoveResourceRequest: Sync = ({ request, session, resourceList, oldIndex, newIndex, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/moveResource", session, resourceList, oldIndex, newIndex },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.moveResource, { resourceList, oldIndex, newIndex }]),
});

export const MoveResourceSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/moveResource" }, { request }],
    [ResourceList.moveResource, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const MoveResourceErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/moveResource" }, { request }],
    [ResourceList.moveResource, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Delete Resource List ---

export const DeleteResourceListRequest: Sync = ({ request, session, resourceList, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/deleteResourceList", session, resourceList },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.deleteResourceList, { resourceList }]),
});

export const DeleteResourceListSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/deleteResourceList" }, { request }],
    [ResourceList.deleteResourceList, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteResourceListErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/deleteResourceList" }, { request }],
    [ResourceList.deleteResourceList, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Rename Indexed Resource ---

export const RenameIndexedResourceRequest: Sync = ({ request, session, indexedResource, newTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/renameIndexedResource", session, indexedResource, newTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([ResourceList.renameIndexedResource, { indexedResource, newTitle }]),
});

export const RenameIndexedResourceSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/renameIndexedResource" }, { request }],
    [ResourceList.renameIndexedResource, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RenameIndexedResourceErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ResourceList/renameIndexedResource" }, { request }],
    [ResourceList.renameIndexedResource, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Get List Resources (Query) ---

export const GetListResourcesRequest: Sync = ({ request, session, resourceList, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/_getListResources", session, resourceList },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const resourceFrames = await userFrames.query(ResourceList._getListResources, { resourceList }, { doc });
    if (resourceFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: IndexedResourceDoc }[], and query processing extracts doc
    // So doc is bound to IndexedResourceDoc directly. Extract documents manually since
    // collectAs would wrap them in { doc: ... } but frontend expects direct array.
    const docArray = resourceFrames.map((frame) => {
      const docValue = frame[doc];
      if (docValue && typeof docValue === "object") {
        return docValue;
      }
      return null;
    }).filter((d) => d !== null);

    const resultFrame = { ...userFrames[0], [results]: docArray };
    return new Frames(resultFrame);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// --- Get Resource List (Query) ---

export const GetResourceListRequest: Sync = ({ request, session, listTitle, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/_getResourceList", session, listTitle },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const listFrames = await userFrames.query(ResourceList._getResourceList, { owner: user, listTitle }, { doc });
    if (listFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: null };
      return new Frames(emptyResultFrame);
    }

    return listFrames.collectAs([doc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

// --- Get User Resource Lists (Query) ---

export const GetUserResourceListsRequest: Sync = ({ request, session, user, doc, results }) => ({
  when: actions([
    Requesting.request,
    { path: "/ResourceList/_getUserResourceLists", session },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const listFrames = await userFrames.query(ResourceList._getUserResourceLists, { owner: user }, { doc });
    if (listFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    return listFrames.collectAs([doc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

