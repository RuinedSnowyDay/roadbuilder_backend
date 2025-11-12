import { actions, Frames, Sync } from "@engine";
import { EnrichedDAG, Requesting, Sessioning } from "@concepts";

// --- Create Empty Graph ---

export const CreateEmptyGraphRequest: Sync = ({ request, session, graphTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/createEmptyGraph", session, graphTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.createEmptyGraph, { owner: user, graphTitle }]),
});

export const CreateEmptyGraphSuccessResponse: Sync = ({ request, newGraph }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/createEmptyGraph" }, { request }],
    [EnrichedDAG.createEmptyGraph, {}, { newGraph }],
  ),
  then: actions([Requesting.respond, { request, newGraph }]),
});

export const CreateEmptyGraphErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/createEmptyGraph" }, { request }],
    [EnrichedDAG.createEmptyGraph, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Access Graph ---

export const AccessGraphRequest: Sync = ({ request, session, graphTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/accessGraph", session, graphTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.accessGraph, { owner: user, graphTitle }]),
});

export const AccessGraphSuccessResponse: Sync = ({ request, accessedGraph }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessGraph" }, { request }],
    [EnrichedDAG.accessGraph, {}, { accessedGraph }],
  ),
  then: actions([Requesting.respond, { request, accessedGraph }]),
});

export const AccessGraphErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessGraph" }, { request }],
    [EnrichedDAG.accessGraph, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Add Node ---

export const AddNodeRequest: Sync = ({ request, session, graph, nodeTitle, enrichment, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/addNode", session, graph, nodeTitle, enrichment },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.addNode, { graph, nodeTitle, enrichment }]),
});

export const AddNodeSuccessResponse: Sync = ({ request, newNode }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addNode" }, { request }],
    [EnrichedDAG.addNode, {}, { newNode }],
  ),
  then: actions([Requesting.respond, { request, newNode }]),
});

export const AddNodeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addNode" }, { request }],
    [EnrichedDAG.addNode, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Access Node ---

export const AccessNodeRequest: Sync = ({ request, session, graph, nodeTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/accessNode", session, graph, nodeTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.accessNode, { graph, nodeTitle }]),
});

export const AccessNodeSuccessResponse: Sync = ({ request, accessedNode }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessNode" }, { request }],
    [EnrichedDAG.accessNode, {}, { accessedNode }],
  ),
  then: actions([Requesting.respond, { request, accessedNode }]),
});

export const AccessNodeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessNode" }, { request }],
    [EnrichedDAG.accessNode, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Change Node Title ---

export const ChangeNodeTitleRequest: Sync = ({ request, session, graph, node, newNodeTitle, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/changeNodeTitle", session, graph, node, newNodeTitle },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.changeNodeTitle, { graph, node, newNodeTitle }]),
});

export const ChangeNodeTitleResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/changeNodeTitle" }, { request }],
    [EnrichedDAG.changeNodeTitle, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Add Edge ---

export const AddEdgeRequest: Sync = ({ request, session, graph, sourceNode, targetNode, enrichment, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/addEdge", session, graph, sourceNode, targetNode, enrichment },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.addEdge, { graph, sourceNode, targetNode, enrichment }]),
});

export const AddEdgeSuccessResponse: Sync = ({ request, newEdge }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addEdge" }, { request }],
    [EnrichedDAG.addEdge, {}, { newEdge }],
  ),
  then: actions([Requesting.respond, { request, newEdge }]),
});

export const AddEdgeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addEdge" }, { request }],
    [EnrichedDAG.addEdge, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Access Edge ---

export const AccessEdgeRequest: Sync = ({ request, session, graph, sourceNode, targetNode, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/accessEdge", session, graph, sourceNode, targetNode },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.accessEdge, { graph, sourceNode, targetNode }]),
});

export const AccessEdgeSuccessResponse: Sync = ({ request, newEdge }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessEdge" }, { request }],
    [EnrichedDAG.accessEdge, {}, { newEdge }],
  ),
  then: actions([Requesting.respond, { request, newEdge }]),
});

export const AccessEdgeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessEdge" }, { request }],
    [EnrichedDAG.accessEdge, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Remove Node ---

export const RemoveNodeRequest: Sync = ({ request, session, node, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/removeNode", session, node },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.removeNode, { node }]),
});

export const RemoveNodeResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/removeNode" }, { request }],
    [EnrichedDAG.removeNode, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Remove Edge ---

export const RemoveEdgeRequest: Sync = ({ request, session, edge, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/removeEdge", session, edge },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.removeEdge, { edge }]),
});

export const RemoveEdgeResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/removeEdge" }, { request }],
    [EnrichedDAG.removeEdge, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Delete Graph ---

export const DeleteGraphRequest: Sync = ({ request, session, graph, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/deleteGraph", session, graph },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.deleteGraph, { graph }]),
});

export const DeleteGraphResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/deleteGraph" }, { request }],
    [EnrichedDAG.deleteGraph, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Suggest Node Title ---

export const SuggestNodeTitleRequest: Sync = ({ request, session, graph, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/suggestNodeTitle", session, graph },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.suggestNodeTitle, { graph }]),
});

export const SuggestNodeTitleSuccessResponse: Sync = ({ request, suggestedNodeTitle }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestNodeTitle" }, { request }],
    [EnrichedDAG.suggestNodeTitle, {}, { suggestedNodeTitle }],
  ),
  then: actions([Requesting.respond, { request, suggestedNodeTitle }]),
});

export const SuggestNodeTitleErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestNodeTitle" }, { request }],
    [EnrichedDAG.suggestNodeTitle, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Suggest Edge ---

export const SuggestEdgeRequest: Sync = ({ request, session, graph, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/suggestEdge", session, graph },
    { request },
  ]),
  where: async (frames) => {
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([EnrichedDAG.suggestEdge, { graph }]),
});

export const SuggestEdgeSuccessResponse: Sync = ({ request, suggestedSourceNode, suggestedTargetNode, reasonable }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestEdge" }, { request }],
    [EnrichedDAG.suggestEdge, {}, { suggestedSourceNode, suggestedTargetNode, reasonable }],
  ),
  then: actions([Requesting.respond, { request, suggestedSourceNode, suggestedTargetNode, reasonable }]),
});

export const SuggestEdgeErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestEdge" }, { request }],
    [EnrichedDAG.suggestEdge, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Get Graph Nodes (Query) ---

export const GetGraphNodesRequest: Sync = ({ request, session, graph, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/_getGraphNodes", session, graph },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const nodeFrames = await userFrames.query(EnrichedDAG._getGraphNodes, { graph }, { doc });
    if (nodeFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: NodeDoc }[], and query processing extracts doc
    // So doc is bound to NodeDoc directly. Extract documents manually since
    // collectAs would wrap them in { doc: ... } but frontend expects direct array.
    const docArray = nodeFrames.map((frame) => {
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

// --- Get Graph Edges (Query) ---

export const GetGraphEdgesRequest: Sync = ({ request, session, graph, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/_getGraphEdges", session, graph },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const edgeFrames = await userFrames.query(EnrichedDAG._getGraphEdges, { graph }, { doc });
    if (edgeFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: EdgeDoc }[], and query processing extracts doc
    // So doc is bound to EdgeDoc directly. Extract documents manually since
    // collectAs would wrap them in { doc: ... } but frontend expects direct array.
    const docArray = edgeFrames.map((frame) => {
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

// --- Get Node Outgoing Edges (Query) ---

export const GetNodeOutgoingEdgesRequest: Sync = ({ request, session, node, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/_getNodeOutgoingEdges", session, node },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const edgeFrames = await userFrames.query(EnrichedDAG._getNodeOutgoingEdges, { node }, { doc });
    if (edgeFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: EdgeDoc }[], and query processing extracts doc
    // So doc is bound to EdgeDoc directly. Extract documents manually since
    // collectAs would wrap them in { doc: ... } but frontend expects direct array.
    const docArray = edgeFrames.map((frame) => {
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

// --- Get Node Incoming Edges (Query) ---

export const GetNodeIncomingEdgesRequest: Sync = ({ request, session, node, doc, results, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/EnrichedDAG/_getNodeIncomingEdges", session, node },
    { request },
  ]),
  where: async (frames) => {
    const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
    if (userFrames.length === 0) {
      const originalFrame = frames[0];
      return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
    }

    const edgeFrames = await userFrames.query(EnrichedDAG._getNodeIncomingEdges, { node }, { doc });
    if (edgeFrames.length === 0) {
      const emptyResultFrame = { ...userFrames[0], [results]: [] };
      return new Frames(emptyResultFrame);
    }

    // The query returns { doc: EdgeDoc }[], and query processing extracts doc
    // So doc is bound to EdgeDoc directly. Extract documents manually since
    // collectAs would wrap them in { doc: ... } but frontend expects direct array.
    const docArray = edgeFrames.map((frame) => {
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

