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

export const CreateEmptyGraphResponse: Sync = ({ request, newGraph, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/createEmptyGraph" }, { request }],
    [EnrichedDAG.createEmptyGraph, {}, { newGraph, error }],
  ),
  then: actions([Requesting.respond, { request, newGraph, error }]),
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

export const AccessGraphResponse: Sync = ({ request, accessedGraph, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessGraph" }, { request }],
    [EnrichedDAG.accessGraph, {}, { accessedGraph, error }],
  ),
  then: actions([Requesting.respond, { request, accessedGraph, error }]),
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

export const AddNodeResponse: Sync = ({ request, newNode, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addNode" }, { request }],
    [EnrichedDAG.addNode, {}, { newNode, error }],
  ),
  then: actions([Requesting.respond, { request, newNode, error }]),
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

export const AccessNodeResponse: Sync = ({ request, accessedNode, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessNode" }, { request }],
    [EnrichedDAG.accessNode, {}, { accessedNode, error }],
  ),
  then: actions([Requesting.respond, { request, accessedNode, error }]),
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

export const AddEdgeResponse: Sync = ({ request, newEdge, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/addEdge" }, { request }],
    [EnrichedDAG.addEdge, {}, { newEdge, error }],
  ),
  then: actions([Requesting.respond, { request, newEdge, error }]),
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

export const AccessEdgeResponse: Sync = ({ request, newEdge, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/accessEdge" }, { request }],
    [EnrichedDAG.accessEdge, {}, { newEdge, error }],
  ),
  then: actions([Requesting.respond, { request, newEdge, error }]),
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

export const SuggestNodeTitleResponse: Sync = ({ request, suggestedNodeTitle, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestNodeTitle" }, { request }],
    [EnrichedDAG.suggestNodeTitle, {}, { suggestedNodeTitle, error }],
  ),
  then: actions([Requesting.respond, { request, suggestedNodeTitle, error }]),
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

export const SuggestEdgeResponse: Sync = ({ request, suggestedSourceNode, suggestedTargetNode, reasonable, error }) => ({
  when: actions(
    [Requesting.request, { path: "/EnrichedDAG/suggestEdge" }, { request }],
    [EnrichedDAG.suggestEdge, {}, { suggestedSourceNode, suggestedTargetNode, reasonable, error }],
  ),
  then: actions([Requesting.respond, { request, suggestedSourceNode, suggestedTargetNode, reasonable, error }]),
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

    return nodeFrames.collectAs([doc], results);
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

    return edgeFrames.collectAs([doc], results);
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

    return edgeFrames.collectAs([doc], results);
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

    return edgeFrames.collectAs([doc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

