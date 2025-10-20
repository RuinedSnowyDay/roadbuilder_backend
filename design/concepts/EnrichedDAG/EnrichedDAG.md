# Concept: EnrichedAcyclicGraph

+ **concept** EnrichedDAG[Object, User]
+ **purpose** Manipulation of a general directed acyclic graph object
+ **principle** Users can create new graph, add nodes to the graph or remove them, add
  edges between nodes in the graph or remove them. Nodes have titles associated with
  them; they are unique to one particular graph and can be changed by the user.  All
  added nodes and edges should have some "enrichment" object associated with them.
  User can't add edges so that they form a cycle in the graph.
+ **state**
  + A set of Graphs with
    + an owner User
    + a title String
  + A set of Nodes with
    + a parent Graph
    + a title String
    + an enrichment Object
  + A set of Edges with
    + a source Node
    + a target Node
    + an enrichment Object
+ **actions**
  + createEmptyGraph(owner: User, graphTitle: String): (newGraph: Graph)
    + **requires** there are no Graphs with the same owner User and graphTitle String
     in the set of Graphs
    + **effects** adds new Graph with provided owner User and graphTitle String to the
      set of Graphs
  + addNode(graph: Graph, nodeTitle: String, enrichment: Object): (newNode: Node)
    + **requires** there are no Nodes with the same parent Graph and title String in
      the set of Nodes
    + **effects** and a new Node with provided parent Graph, nodeTitle title and
      enrichment Object to the set of Nodes. Returns the new Node.
  + accessNode(graph: Graph, nodeTitle: String): (accessedNode: Node)
    + **requires** there is a Node associated with graph as a parent Graph and
      nodeTitle as a title String in the set of Nodes
    + **effects** returns the Node that has graph as a parent Graph and nodeTitle as a
      title String
  + changeNodeTitle(graph: Graph, node: Node, newNodeTitle: string)
    + **requires** node is in the set of Nodes. node's parent Graph is graph. There
      are no Nodes with graph as a parent Graph and newNodeTitle as a title String in
      the set of Nodes.
    + **effects** changes the title of the node to newNodeTitle
  + addEdge(graph: Graph, sourceNode: Node, targetNode: Node, enrichment: Object):
    (newEdge: Edge)
    + **requires** sourceNode and targetNode are in the set of Nodes, sourceNode's
      parent Graph is graph, targetNode's parent Graph is graph. There are no Edges
      that have sourceNode as a source Node and targetNode as a target Node.
      Adding the edge shouldn't create cycles in the graph
    + **effects** adds a new Edge with sourceNode as a source Node, targetNode as a
      target Node, and enrichment Object as an enrichment to the set of Edges, and
      returns this new Edge.
  + accessEdge(graph: Graph, sourceNode: Node, targetNode: Node): (newEdge: Edge)
    + **requires** Both sourceNode and targetNode are in the set of Nodes. Both
      sourceNode and targetNode have graph as a parent Graph. There is an edge with
      sourceNode as a source Node and targetNode as a target node in the set of Edges
    + **effects** returns the Edge in the graph that has sourceNode as a source Node
      and tagetNode as a target Node.
  + removeNode(node: Node)
    + **requires** node is in the set of Nodes
    + **effects** removes node from the set of Nodes. Also removes all edges that
      have node as either a source or a target.
  + removeEdge(edge: Edge)
    + **requires** edge is in the set of Edges
    + **effects** removes edge from the set of Edges
+ Invariants
  + There are no cycles in the graph.
  + There are no nodes with the same title in one graph
  + There are no edges between nodes in different graphs