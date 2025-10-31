# API Specification: EnrichedDAG Concept

**Purpose:** Model and manage hierarchical relationships or dependencies between entities while ensuring the integrity of a non-circular structure

---

## API Endpoints

### POST /api/EnrichedDAG/createEmptyGraph

**Description:** Creates a new empty graph for a user with a specified title.

**Requirements:**
- There are no Graphs with the same owner User and graphTitle String in the set of Graphs

**Effects:**
- Adds new Graph with provided owner User and graphTitle String to the set of Graphs

**Request Body:**
```json
{
  "owner": "ID",
  "graphTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "newGraph": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/accessGraph

**Description:** Accesses a graph by owner and title.

**Requirements:**
- There is a Graph with owner as an owner User and graphTitle as a title String in the set of Graphs

**Effects:**
- Returns the Graph that has owner as an owner User and graphTitle as a title String

**Request Body:**
```json
{
  "owner": "ID",
  "graphTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "accessedGraph": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/addNode

**Description:** Adds a new node to a graph with a title and enrichment object.

**Requirements:**
- graph is in the set of Graphs
- There are no Nodes with the same parent Graph and title String in the set of Nodes

**Effects:**
- Adds a new Node with provided parent Graph, nodeTitle title and enrichment Object to the set of Nodes
- Returns the new Node

**Request Body:**
```json
{
  "graph": "ID",
  "nodeTitle": "string",
  "enrichment": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "newNode": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/accessNode

**Description:** Accesses a node by its parent graph and title.

**Requirements:**
- graph is in the set of Graphs
- There is a Node associated with graph as a parent Graph and nodeTitle as a title String in the set of Nodes

**Effects:**
- Returns the Node that has graph as a parent Graph and nodeTitle as a title String

**Request Body:**
```json
{
  "graph": "ID",
  "nodeTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "accessedNode": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/changeNodeTitle

**Description:** Changes the title of a node in a graph.

**Requirements:**
- graph is in the set of Graphs
- node is in the set of Nodes
- node's parent Graph is graph
- There are no Nodes with graph as a parent Graph and newNodeTitle as a title String in the set of Nodes

**Effects:**
- Changes the title of the node to newNodeTitle

**Request Body:**
```json
{
  "graph": "ID",
  "node": "ID",
  "newNodeTitle": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/addEdge

**Description:** Adds a new edge between two nodes in a graph, ensuring no cycles are created.

**Requirements:**
- graph in the set of Graphs
- sourceNode and targetNode are in the set of Nodes
- sourceNode's parent Graph is graph
- targetNode's parent Graph is graph
- There are no Edges that have sourceNode as a source Node and targetNode as a target Node
- Adding the edge shouldn't create cycles in the graph

**Effects:**
- Adds a new Edge with sourceNode as a source Node, targetNode as a target Node, and enrichment Object as an enrichment to the set of Edges
- Returns this new Edge

**Request Body:**
```json
{
  "graph": "ID",
  "sourceNode": "ID",
  "targetNode": "ID",
  "enrichment": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "newEdge": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/accessEdge

**Description:** Accesses an edge by its parent graph, source node, and target node.

**Requirements:**
- graph is in the set of Graphs
- Both sourceNode and targetNode are in the set of Nodes
- Both sourceNode and targetNode have graph as a parent Graph
- There is an edge with sourceNode as a source Node and targetNode as a target node in the set of Edges

**Effects:**
- Returns the Edge in the graph that has sourceNode as a source Node and targetNode as a target Node

**Request Body:**
```json
{
  "graph": "ID",
  "sourceNode": "ID",
  "targetNode": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "newEdge": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/removeNode

**Description:** Removes a node from a graph, along with all associated edges.

**Requirements:**
- node is in the set of Nodes

**Effects:**
- Removes node from the set of Nodes
- Also removes all edges that have node as either a source or a target

**Request Body:**
```json
{
  "node": "ID"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/removeEdge

**Description:** Removes an edge from a graph.

**Requirements:**
- edge is in the set of Edges

**Effects:**
- Removes edge from the set of Edges

**Request Body:**
```json
{
  "edge": "ID"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/deleteGraph

**Description:** Deletes a graph and all its associated nodes and edges.

**Requirements:**
- graph is in the set of Graphs

**Effects:**
- Removes all nodes that have graph as a parent Graph from the set of Nodes
- Removes all edges associated with removed nodes (done automatically through removeNode action)
- Removes graph from the set of Graphs

**Request Body:**
```json
{
  "graph": "ID"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/suggestNodeTitle

**Description:** Returns an AI-generated suggestion for the title of a new node based on the graph's context.

**Requirements:**
- graph is in the set of Graphs

**Effects:**
- Returns a suggestion for the title of a new node using AI
- Suggestion is based on the graph's title, titles of nodes associated with this graph, and edges in the graph

**Request Body:**
```json
{
  "graph": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "suggestedNodeTitle": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/suggestEdge

**Description:** Returns an AI-generated suggestion for a new edge between nodes in the graph.

**Requirements:**
- graph is in the set of Graphs

**Effects:**
- Returns a suggestion for a new edge using AI
- Suggestion is based on the graph's title, titles of nodes associated with this graph, and edges in the graph
- Returns suggested source and target Nodes, as well as a reasonable flag indicating whether the model considers its suggestion as reasonable

**Request Body:**
```json
{
  "graph": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "suggestedSourceNode": "ID",
  "suggestedTargetNode": "ID",
  "reasonable": "boolean"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/_getGraphNodes

**Description:** Query that retrieves all nodes in a graph.

**Requirements:**
- graph is in the set of Graphs

**Effects:**
- Returns all nodes that have graph as a parent Graph

**Request Body:**
```json
{
  "graph": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "parent": "ID",
    "title": "string",
    "enrichment": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/_getGraphEdges

**Description:** Query that retrieves all edges in a graph.

**Requirements:**
- graph is in the set of Graphs

**Effects:**
- Returns all edges between nodes in the graph

**Request Body:**
```json
{
  "graph": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "source": "ID",
    "target": "ID",
    "enrichment": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/_getNodeOutgoingEdges

**Description:** Query that retrieves all outgoing edges from a specific node.

**Requirements:**
- node is in the set of Nodes

**Effects:**
- Returns all edges that have node as a source Node

**Request Body:**
```json
{
  "node": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "source": "ID",
    "target": "ID",
    "enrichment": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/EnrichedDAG/_getNodeIncomingEdges

**Description:** Query that retrieves all incoming edges to a specific node.

**Requirements:**
- node is in the set of Nodes

**Effects:**
- Returns all edges that have node as a target Node

**Request Body:**
```json
{
  "node": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "source": "ID",
    "target": "ID",
    "enrichment": "ID"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

