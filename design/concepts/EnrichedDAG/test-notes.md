# Summary of tests for EnrichedDAG concept

## Test coverage

1. Principle test: "User assigns names and descriptions to objects, then modifies them"

+ Creates a graph and nodes with titles and enrichments
+ Adds edges (acyclic)
+ Changes a node title
+ Verifies title update

2. Variant tests

+ addEdge prevents cycle creation: flow A→B→C; blocks C→A and self-loops
+ node and edge removal: removes edges, deletes nodes, cascades removal
+ deleteGraph removes all associated nodes and edges: multiple graphs; deletes one
  without affecting others
+ addNode enforces unique titles within a graph: blocks duplicate titles; different
  graphs can reuse titles
+ changeNodeTitle validates uniqueness: successful change, prevents conflict with
  existing titles
+ accessEdge and edge queries: access by source/target; query outgoing/incoming

All actions are covered, error cases are validated, and all tests pass with no memory
leaks.

## Interesting moments

+ Interestingly, the generated prompt for the `suggestEdge` incorporates the list of
  edges in the graph in the prompt. However, `suggestNodeTitle` does not, only the
  number of edges and the existing node titles.

## Raw test output

 # Trace: Fulfilling the EnrichedDAG Operational Principle
The principle states: 'Users can create new graph, add nodes to the graph or remove them, add edges between nodes in the graph or remove them. Nodes have titles associated with them; they are unique to one particular graph and can be changed by the user. User can't add edges so that they form a cycle in the graph.'

## 1. User creates a new graph
- Action: createEmptyGraph({ owner: "user:Alice", graphTitle: "Project Dependencies" })
  Result: Graph created with ID: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`

## 2. User adds nodes to the graph
- Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "Database Design", enrichment: `enrichment:type-A` })
  Result: Node created with ID: `019a2e07-b42c-779b-b404-7ffa7ff5881c`
- Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "API Implementation", enrichment: `enrichment:type-B` })
  Result: Node created with ID: `019a2e07-b4be-7410-b1a3-89c55a0f14ff`
- Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "Frontend Development", enrichment: `enrichment:type-C` })
  Result: Node created with ID: `019a2e07-b550-747f-8bad-998a4206d2d8`

## 3. User adds edges between nodes
- Action: addEdge({ sourceNode: `019a2e07-b42c-779b-b404-7ffa7ff5881c`, targetNode: `019a2e07-b4be-7410-b1a3-89c55a0f14ff` })
  Result: Edge created with ID: `019a2e07-b5e0-73d2-99b4-822e502984ea`
- Action: addEdge({ sourceNode: `019a2e07-b4be-7410-b1a3-89c55a0f14ff`, targetNode: `019a2e07-b550-747f-8bad-998a4206d2d8` })
  Result: Edge created with ID: `019a2e07-b688-737d-9720-8a264e231134`

## 4. User changes a node title
- Action: changeNodeTitle({ node: `019a2e07-b42c-779b-b404-7ffa7ff5881c`, newNodeTitle: "Database Schema Design" })
  Result: Title changed successfully

✅ Principle successfully demonstrated
----- output end -----
Principle: Users create graphs, add nodes with titles and enrichments, connect them with edges ... ok (1s)
Action: addEdge prevents cycle creation ...
------- output -------

# Testing Cycle Detection in Edge Addition

## 1. Create graph and add nodes
✓ Created graph: `019a2e07-b998-7da7-817d-d1c432a556db`
✓ Created 3 nodes

## 2. Create a path: A → B → C
✓ Created edges: A → B → C

## 3. Add a valid edge (A → C, no cycle)
✓ Added edge A → C (valid, no cycle)

## 4. Try to create a cycle (C → A)
✗ Failed as expected: Adding this edge would create a cycle in the graph

## 5. Try to create a self-loop (A → A)
✗ Failed as expected: Adding this edge would create a cycle in the graph
----- output end -----
Action: addEdge prevents cycle creation ... ok (1s)
Action: node and edge removal ...
------- output -------

# Testing Node and Edge Removal

## 1. Create graph with nodes and edges
✓ Created graph with 3 nodes and 2 edges

## 2. Remove an edge
✓ Removed edge: 019a2e07-bf8d-7daf-aa5c-0d36f2da6413 → 019a2e07-bfd9-71b6-a044-48f088197884

## 3. Remove a node (should also remove its edges)
✓ Removed node 2
✓ All edges connected to the node were also removed

## 4. Try to remove non-existent edge
✗ Failed as expected
----- output end -----
Action: node and edge removal ... ok (1s)
Action: deleteGraph removes all associated nodes and edges ...
------- output -------

# Testing Graph Deletion

## 1. Create multiple graphs with nodes
✓ Created 2 graphs with nodes and edges

## 2. Delete graph 1
✓ Deleted graph 1
✓ Graph 1 and its nodes/edges removed, Graph 2 remains intact

## 3. Try to access nodes from deleted graph
✗ Failed as expected
----- output end -----
Action: deleteGraph removes all associated nodes and edges ... ok (1s)
Action: addNode enforces unique titles within a graph ...
------- output -------

# Testing Node Title Uniqueness

## 1. Create graph and add node
✓ Created node with title 'Task A'

## 2. Try to add node with duplicate title
✗ Failed as expected: A node with this title already exists in this graph

## 3. Different graph can have same title
✓ Created node with 'Task A' in different graph
----- output end -----
Action: addNode enforces unique titles within a graph ... ok (875ms)
Action: changeNodeTitle validates uniqueness ...
------- output -------

# Testing Node Title Changes

## 1. Create graph with nodes
✓ Setup complete

## 2. Change to new unique title
✓ Changed: 'Original Title' → 'Updated Title'

## 3. Try to change to existing title
✗ Failed as expected: A node with this title already exists in this graph

## 4. Try to change non-existent node
✗ Failed as expected
----- output end -----
Action: changeNodeTitle validates uniqueness ... ok (888ms)
Action: accessEdge and edge queries ...
------- output -------

# Testing Edge Access and Queries

## 1. Create graph with nodes and edges
✓ Created graph with 3 nodes and 2 edges

## 2. Access existing edge
✓ Retrieved edge: `019a2e07-d18a-789c-a323-54618ef87278`

## 3. Query outgoing edges from node 2
✓ Found 1 outgoing edge(s)

## 4. Query incoming edges to node 2
✓ Found 1 incoming edge(s)

## 5. Try to access non-existent edge
✗ Failed as expected
----- output end -----
Action: accessEdge and edge queries ... ok (1s)

ok | 7 passed | 0 failed (8s)