import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import type { GeminiLLM } from "@utils/gemini-llm.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "EnrichedDAG" + ".";

// Generic types for the concept's external dependencies
type Object = ID;
type User = ID;

// Internal entity types, represented as IDs
type Graph = ID;
type Node = ID;
type Edge = ID;

/**
 * State: A set of Graphs with owner User and title String.
 */
interface GraphDoc {
  _id: Graph;
  owner: User;
  title: string;
}

/**
 * State: A set of Nodes with parent Graph, title String, and enrichment Object.
 */
interface NodeDoc {
  _id: Node;
  parent: Graph;
  title: string;
  enrichment: Object;
}

/**
 * State: A set of Edges with source Node, target Node, and enrichment Object.
 */
interface EdgeDoc {
  _id: Edge;
  source: Node;
  target: Node;
  enrichment: Object;
}

/**
 * @concept EnrichedDAG
 * @purpose Model and manage hierarchical relationships or dependencies between entities while ensuring the integrity of a non-circular structure
 */
export default class EnrichedDAGConcept {
  graphs: Collection<GraphDoc>;
  nodes: Collection<NodeDoc>;
  edges: Collection<EdgeDoc>;

  constructor(
    private readonly db: Db,
    private readonly llm?: GeminiLLM,
  ) {
    this.graphs = this.db.collection(PREFIX + "graphs");
    this.nodes = this.db.collection(PREFIX + "nodes");
    this.edges = this.db.collection(PREFIX + "edges");
  }

  /**
   * Action: Creates an empty graph.
   * @requires There are no Graphs with the same owner User and graphTitle String.
   * @effects Adds new Graph with provided owner and title to the set of Graphs and returns it.
   */
  async createEmptyGraph(
    { owner, graphTitle }: { owner: User; graphTitle: string },
  ): Promise<{ newGraph: Graph } | { error: string }> {
    // Check for duplicate graph
    const existing = await this.graphs.findOne({ owner, title: graphTitle });
    if (existing) {
      return { error: "A graph with this title already exists for this user" };
    }

    const graphId = freshID();
    await this.graphs.insertOne({
      _id: graphId as Graph,
      owner,
      title: graphTitle,
    });

    return { newGraph: graphId as Graph };
  }

  /**
   * Action: Accesses a graph by owner and title.
   * @requires There is a Graph with owner as owner User and graphTitle as title String.
   * @effects Returns the Graph with owner as owner User and graphTitle as title String.
   */
  async accessGraph(
    { owner, graphTitle }: { owner: User; graphTitle: string },
  ): Promise<{ accessedGraph: Graph } | { error: string }> {
    const graph = await this.graphs.findOne({ owner, title: graphTitle });
    if (!graph) {
      return { error: "No graph found with this owner and title" };
    }

    return { accessedGraph: graph._id };
  }

  /**
   * Action: Adds a node to a graph.
   * @requires Graph is in the set of Graphs. There are no Nodes with the same parent Graph and title String.
   * @effects Adds a new Node with provided parent Graph, nodeTitle, and enrichment Object. Returns the new Node.
   */
  async addNode(
    { graph, nodeTitle, enrichment }: {
      graph: Graph;
      nodeTitle: string;
      enrichment: Object;
    },
  ): Promise<{ newNode: Node } | { error: string }> {
    // Check graph exists
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    // Check for duplicate node title within the graph
    const existingNode = await this.nodes.findOne({
      parent: graph,
      title: nodeTitle,
    });
    if (existingNode) {
      return {
        error: "A node with this title already exists in this graph",
      };
    }

    const nodeId = freshID();
    await this.nodes.insertOne({
      _id: nodeId as Node,
      parent: graph,
      title: nodeTitle,
      enrichment,
    });

    return { newNode: nodeId as Node };
  }

  /**
   * Action: Accesses a node by graph and title.
   * @requires Graph is in the set of Graphs. There is a Node with graph as parent Graph and nodeTitle as title String.
   * @effects Returns the Node with graph as parent Graph and nodeTitle as title String.
   */
  async accessNode(
    { graph, nodeTitle }: { graph: Graph; nodeTitle: string },
  ): Promise<{ accessedNode: Node } | { error: string }> {
    const node = await this.nodes.findOne({
      parent: graph,
      title: nodeTitle,
    });
    if (!node) {
      return { error: "No node found with this title in this graph" };
    }

    return { accessedNode: node._id };
  }

  /**
   * Action: Changes a node's title.
   * @requires Graph is in the set of Graphs, node is in the set of Nodes, node's parent Graph is graph. There are no Nodes with graph as parent Graph and newNodeTitle as title String.
   * @effects Changes the title of the node to newNodeTitle.
   */
  async changeNodeTitle(
    { graph, node, newNodeTitle }: {
      graph: Graph;
      node: Node;
      newNodeTitle: string;
    },
  ): Promise<Empty | { error: string }> {
    // Check node exists and belongs to graph
    const nodeDoc = await this.nodes.findOne({ _id: node });
    if (!nodeDoc || nodeDoc.parent !== graph) {
      return { error: "Node not found or doesn't belong to this graph" };
    }

    // Check for duplicate title
    const existingNode = await this.nodes.findOne({
      parent: graph,
      title: newNodeTitle,
    });
    if (existingNode) {
      return {
        error: "A node with this title already exists in this graph",
      };
    }

    await this.nodes.updateOne({ _id: node }, {
      $set: { title: newNodeTitle },
    });

    return {};
  }

  /**
   * Helper: Checks if adding an edge would create a cycle in the graph.
   * Uses DFS to detect cycles.
   */
  private async wouldCreateCycle(
    sourceNode: Node,
    targetNode: Node,
  ): Promise<boolean> {
    // If source == target, it's a self-loop (cycle)
    if (sourceNode === targetNode) {
      return true;
    }

    // Get all edges to form adjacency list
    const allEdges = await this.edges.find({}).toArray();
    const graph = new Map<Node, Node[]>();

    for (const edge of allEdges) {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, []);
      }
      graph.get(edge.source)!.push(edge.target);
    }

    // DFS to detect if target can reach source (would create cycle)
    const visited = new Set<Node>();
    const stack = [targetNode];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === sourceNode) {
        return true; // Cycle detected: target can reach source
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);
      const neighbors = graph.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    return false; // No cycle
  }

  /**
   * Action: Adds an edge between two nodes.
   * @requires Graph is in the set of Graphs, sourceNode and targetNode are in the set of Nodes, both belong to graph. There are no Edges with sourceNode and targetNode. Adding the edge shouldn't create cycles.
   * @effects Adds a new Edge with sourceNode, targetNode, and enrichment Object to the set of Edges, and returns this new Edge.
   */
  async addEdge(
    { graph, sourceNode, targetNode, enrichment }: {
      graph: Graph;
      sourceNode: Node;
      targetNode: Node;
      enrichment: Object;
    },
  ): Promise<{ newEdge: Edge } | { error: string }> {
    // Check graph exists
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    // Check both nodes exist and belong to graph
    const sourceDoc = await this.nodes.findOne({ _id: sourceNode });
    const targetDoc = await this.nodes.findOne({ _id: targetNode });

    if (!sourceDoc || !targetDoc) {
      return { error: "One or both nodes not found" };
    }

    if (sourceDoc.parent !== graph || targetDoc.parent !== graph) {
      return { error: "Nodes must belong to the same graph" };
    }

    // Check if edge already exists
    const existingEdge = await this.edges.findOne({
      source: sourceNode,
      target: targetNode,
    });
    if (existingEdge) {
      return { error: "Edge already exists between these nodes" };
    }

    // Check for cycles
    const wouldCycle = await this.wouldCreateCycle(sourceNode, targetNode);
    if (wouldCycle) {
      return { error: "Adding this edge would create a cycle in the graph" };
    }

    const edgeId = freshID();
    await this.edges.insertOne({
      _id: edgeId as Edge,
      source: sourceNode,
      target: targetNode,
      enrichment,
    });

    return { newEdge: edgeId as Edge };
  }

  /**
   * Action: Accesses an edge by source and target nodes.
   * @requires Graph is in the set of Graphs. Both sourceNode and targetNode are in the set of Nodes and have graph as parent Graph. There is an Edge with sourceNode and targetNode.
   * @effects Returns the Edge with sourceNode as source Node and targetNode as target Node.
   */
  async accessEdge(
    { graph, sourceNode, targetNode }: {
      graph: Graph;
      sourceNode: Node;
      targetNode: Node;
    },
  ): Promise<{ newEdge: Edge } | { error: string }> {
    // Check graph exists
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    const edge = await this.edges.findOne({
      source: sourceNode,
      target: targetNode,
    });

    if (!edge) {
      return { error: "No edge found between these nodes" };
    }

    return { newEdge: edge._id };
  }

  /**
   * Action: Removes a node.
   * @requires Node is in the set of Nodes.
   * @effects Removes node from the set of Nodes. Also removes all edges that have node as either a source or a target.
   */
  async removeNode(
    { node }: { node: Node },
  ): Promise<Empty | { error: string }> {
    // Check node exists
    const existingNode = await this.nodes.findOne({ _id: node });
    if (!existingNode) {
      return { error: "Node not found" };
    }

    // Remove all edges connected to this node
    await this.edges.deleteMany({
      $or: [{ source: node }, { target: node }],
    });

    // Remove the node
    await this.nodes.deleteOne({ _id: node });

    return {};
  }

  /**
   * Action: Removes an edge.
   * @requires Edge is in the set of Edges.
   * @effects Removes edge from the set of Edges.
   */
  async removeEdge(
    { edge }: { edge: Edge },
  ): Promise<Empty | { error: string }> {
    const result = await this.edges.deleteOne({ _id: edge });
    if (result.deletedCount === 0) {
      return { error: "Edge not found" };
    }

    return {};
  }

  /**
   * Action: Deletes a graph.
   * @requires Graph is in the set of Graphs.
   * @effects Removes all nodes that have graph as parent Graph from the set of Nodes. Removes all edges associated with removed nodes. Removes graph from the set of Graphs.
   */
  async deleteGraph(
    { graph }: { graph: Graph },
  ): Promise<Empty | { error: string }> {
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    // Get all nodes in the graph
    const nodesInGraph = await this.nodes.find({ parent: graph }).toArray();
    const nodeIds = nodesInGraph.map((n) => n._id);

    // Remove all edges connected to these nodes
    if (nodeIds.length > 0) {
      await this.edges.deleteMany({
        $or: [
          { source: { $in: nodeIds } },
          { target: { $in: nodeIds } },
        ],
      });
    }

    // Remove all nodes in the graph
    await this.nodes.deleteMany({ parent: graph });

    // Remove the graph
    await this.graphs.deleteOne({ _id: graph });

    return {};
  }

  /**
   * Action: Suggests a node title using AI.
   * @async
   * @requires Graph is in the set of Graphs.
   * @effects Returns a suggestion for the title of a new node using AI based on the graph's title, titles of nodes, and edges in the graph.
   */
  async suggestNodeTitle(
    { graph }: { graph: Graph },
  ): Promise<{ suggestedNodeTitle: string } | { error: string }> {
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    const nodesInGraph = await this.nodes.find({ parent: graph }).toArray();
    const edgesInGraph = await this.edges.find({
      $or: nodesInGraph.map((n) => ({
        source: n._id,
        target: { $in: nodesInGraph.map((n) => n._id) },
      })),
    }).toArray();

    if (!this.llm) {
      // Fallback to simple suggestion
      const count = nodesInGraph.length;
      return { suggestedNodeTitle: `Node ${count + 1}` };
    }

    // Build prompt for AI
    const nodeTitles = nodesInGraph.map((n) => n.title).join(", ");
    const edgeCount = edgesInGraph.length;

    const prompt =
      `You are helping create a node in a directed acyclic graph titled "${existingGraph.title}".

Existing nodes in this graph: ${nodeTitles || "none"}

Number of edges: ${edgeCount}

Suggest a new, descriptive node title that:
1. Fits well with the existing nodes
2. Follows similar naming patterns
3. Is concise and meaningful

Respond with ONLY the suggested title, nothing else. Do not include quotation marks.`;

    try {
      const suggestion = await this.llm.executeLLM(prompt);
      const suggestedNodeTitle = suggestion.trim().replace(/['"]/g, "");
      return { suggestedNodeTitle };
    } catch (error) {
      console.error("LLM error:", error);
      const count = nodesInGraph.length;
      return { suggestedNodeTitle: `Node ${count + 1}` };
    }
  }

  /**
   * Action: Suggests an edge using AI.
   * @async
   * @requires Graph is in the set of Graphs.
   * @effects Returns a suggestion for a new edge using AI. Returns suggested source and target Nodes, and a reasonable flag.
   */
  async suggestEdge(
    { graph }: { graph: Graph },
  ): Promise<
    | {
      suggestedSourceNode: Node;
      suggestedTargetNode: Node;
      reasonable: boolean;
    }
    | { error: string }
  > {
    const existingGraph = await this.graphs.findOne({ _id: graph });
    if (!existingGraph) {
      return { error: "Graph not found" };
    }

    const nodesInGraph = await this.nodes.find({ parent: graph }).toArray();
    const edgesInGraph = await this.edges.find({
      $or: nodesInGraph.map((n) => ({
        source: n._id,
      })),
    }).toArray();

    if (nodesInGraph.length < 2) {
      return {
        suggestedSourceNode: nodesInGraph[0]?._id || "" as Node,
        suggestedTargetNode: nodesInGraph[0]?._id || "" as Node,
        reasonable: false,
      };
    }

    if (!this.llm) {
      // Fallback to random suggestion
      const sourceIdx = Math.floor(Math.random() * nodesInGraph.length);
      let targetIdx = Math.floor(Math.random() * nodesInGraph.length);
      while (targetIdx === sourceIdx) {
        targetIdx = Math.floor(Math.random() * nodesInGraph.length);
      }
      return {
        suggestedSourceNode: nodesInGraph[sourceIdx]._id,
        suggestedTargetNode: nodesInGraph[targetIdx]._id,
        reasonable: true,
      };
    }

    // Build prompt for AI
    const nodeList = nodesInGraph.map((n, i) => `${i + 1}. ${n.title}`).join(
      "\n",
    );
    const edgeDescriptions = [];
    for (const edge of edgesInGraph) {
      const sourceNode = nodesInGraph.find((n) => n._id === edge.source);
      const targetNode = nodesInGraph.find((n) => n._id === edge.target);
      if (sourceNode && targetNode) {
        edgeDescriptions.push(`${sourceNode.title} → ${targetNode.title}`);
      }
    }

    const prompt =
      `You are helping create an edge in a directed acyclic graph titled "${existingGraph.title}".

Nodes in the graph:
${nodeList}

Current edges:
${edgeDescriptions.join("\n") || "none"}

Suggest a reasonable edge that would make sense in this graph. Respond with ONLY:
1. The source node title
2. The target node title
3. Whether this suggestion is reasonable (yes/no)

Format: source|target|reasonable`;

    try {
      const result = await this.llm.executeLLM(prompt);
      const parts = result.trim().split("|");
      if (parts.length >= 2) {
        const sourceTitle = parts[0].trim();
        const targetTitle = parts[1].trim();
        const reasonable = parts[2]?.toLowerCase().includes("yes") || false;

        const sourceNode = nodesInGraph.find((n) => n.title === sourceTitle);
        const targetNode = nodesInGraph.find((n) => n.title === targetTitle);

        if (sourceNode && targetNode) {
          return {
            suggestedSourceNode: sourceNode._id,
            suggestedTargetNode: targetNode._id,
            reasonable,
          };
        }
      }
    } catch (error) {
      console.error("LLM error:", error);
    }

    // Fallback
    const sourceIdx = Math.floor(Math.random() * nodesInGraph.length);
    let targetIdx = Math.floor(Math.random() * nodesInGraph.length);
    while (targetIdx === sourceIdx) {
      targetIdx = Math.floor(Math.random() * nodesInGraph.length);
    }
    return {
      suggestedSourceNode: nodesInGraph[sourceIdx]._id,
      suggestedTargetNode: nodesInGraph[targetIdx]._id,
      reasonable: false,
    };
  }

  /**
   * Query: Retrieves all nodes in a graph.
   */
  async _getGraphNodes({ graph }: { graph: Graph }): Promise<NodeDoc[]> {
    return await this.nodes.find({ parent: graph }).toArray();
  }

  /**
   * Query: Retrieves all edges in a graph.
   */
  async _getGraphEdges({ graph }: { graph: Graph }): Promise<EdgeDoc[]> {
    const nodesInGraph = await this.nodes.find({ parent: graph }).toArray();
    const nodeIds = nodesInGraph.map((n) => n._id);
    if (nodeIds.length === 0) {
      return [];
    }
    return await this.edges.find({
      source: { $in: nodeIds },
      target: { $in: nodeIds },
    }).toArray();
  }

  /**
   * Query: Retrieves all edges from a specific node.
   */
  async _getNodeOutgoingEdges({ node }: { node: Node }): Promise<EdgeDoc[]> {
    return await this.edges.find({ source: node }).toArray();
  }

  /**
   * Query: Retrieves all edges to a specific node.
   */
  async _getNodeIncomingEdges({ node }: { node: Node }): Promise<EdgeDoc[]> {
    return await this.edges.find({ target: node }).toArray();
  }
}
