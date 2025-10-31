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

## AI Test Coverage (2 additional tests)

+ **suggestNodeTitle generates AI suggestions**: Tests the AI-based node title suggestion feature
  - Creates a graph with context-specific nodes (Database Layer, API Layer, Frontend Layer)
  - Requests an AI-generated title suggestion
  - Verifies the suggestion works and doesn't conflict with existing nodes
  - Tests fallback behavior when LLM is not available
  
+ **suggestEdge generates AI edge suggestions**: Tests the AI-based edge suggestion feature
  - Creates a graph with nodes representing a workflow (Planning → Development → Testing)
  - Requests an AI-generated edge suggestion
  - Verifies the suggestion includes both source and target nodes
  - Tests attempt to add the suggested edge (may fail if it creates a cycle)
  - Tests edge suggestion with insufficient nodes (only 1 node)

## Interesting moments

+ Interestingly, the generated prompt for the `suggestEdge` incorporates the list of
  edges in the graph in the prompt. However, `suggestNodeTitle` does not, only the
  number of edges and the existing node titles.
+ AI features were not tested at all after the initial iteration.

## Raw test output

# Trace: Fulfilling the EnrichedDAG Operational Principle
The principle states: 'Users can create new graph, add nodes to the graph or remove them, add edges between nodes in the graph or remove them. Nodes have titles associated with them; they are unique to one particular graph and can be changed by the user. User can't add edges so that they form a cycle in the graph.'

## 1. User creates a new graph
- Action: createEmptyGraph({ owner: "user:Alice", graphTitle: "Project Dependencies" })
  Result: Graph created with ID: `019a2e1a-9454-7791-9370-d51e9782e4e8`

## 2. User adds nodes to the graph
- Action: addNode({ graph: `019a2e1a-9454-7791-9370-d51e9782e4e8`, nodeTitle: "Database Design", enrichment: `enrichment:type-A` })
  Result: Node created with ID: `019a2e1a-949e-7da7-b2ff-87680b3f4b28`
- Action: addNode({ graph: `019a2e1a-9454-7791-9370-d51e9782e4e8`, nodeTitle: "API Implementation", enrichment: `enrichment:type-B` })
  Result: Node created with ID: `019a2e1a-94e6-7894-b1f2-dcae88751580`
- Action: addNode({ graph: `019a2e1a-9454-7791-9370-d51e9782e4e8`, nodeTitle: "Frontend Development", enrichment: `enrichment:type-C` })
  Result: Node created with ID: `019a2e1a-952d-7047-9f62-c8da2f4a3d16`

## 3. User adds edges between nodes
- Action: addEdge({ sourceNode: `019a2e1a-949e-7da7-b2ff-87680b3f4b28`, targetNode: `019a2e1a-94e6-7894-b1f2-dcae88751580` })
  Result: Edge created with ID: `019a2e1a-959f-7836-a183-1e561b5392a4`
- Action: addEdge({ sourceNode: `019a2e1a-94e6-7894-b1f2-dcae88751580`, targetNode: `019a2e1a-952d-7047-9f62-c8da2f4a3d16` })
  Result: Edge created with ID: `019a2e1a-9632-712a-ad76-7db8bb2e39bd`

## 4. User changes a node title
- Action: changeNodeTitle({ node: `019a2e1a-949e-7da7-b2ff-87680b3f4b28`, newNodeTitle: "Database Schema Design" })
  Result: Title changed successfully

✅ Principle successfully demonstrated
----- output end -----
Principle: Users create graphs, add nodes with titles and enrichments, connect them with edges ... ok (1s)
Action: addEdge prevents cycle creation ...
------- output -------

# Testing Cycle Detection in Edge Addition

## 1. Create graph and add nodes
✓ Created graph: `019a2e1a-9933-76a0-9892-d56378fdad0d`
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
✓ Removed edge: 019a2e1a-9ea7-7d21-8ed5-5aa684cf31c5 → 019a2e1a-9eef-7694-8c14-747f41096e53

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
Action: addNode enforces unique titles within a graph ... ok (865ms)
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
Action: changeNodeTitle validates uniqueness ... ok (844ms)
Action: accessEdge and edge queries ...
------- output -------

# Testing Edge Access and Queries

## 1. Create graph with nodes and edges
✓ Created graph with 3 nodes and 2 edges

## 2. Access existing edge
✓ Retrieved edge: `019a2e1a-afe8-7aee-a508-f489a88401b5`

## 3. Query outgoing edges from node 2
✓ Found 1 outgoing edge(s)

## 4. Query incoming edges to node 2
✓ Found 1 incoming edge(s)

## 5. Try to access non-existent edge
✗ Failed as expected
----- output end -----
Action: accessEdge and edge queries ... ok (1s)
Action: suggestNodeTitle generates AI suggestions ...
------- output -------

# Testing AI Node Title Suggestions

## 1. Create graph with nodes
✓ Created graph with 3 nodes

## 2. Get AI title suggestion
✓ Suggested title: "Business Logic Layer"
✓ Suggested title is valid and doesn't conflict

## 3. Test suggestion with empty graph (fallback)
✓ Fallback suggestion generated
----- output end -----
Action: suggestNodeTitle generates AI suggestions ... ok (1s)
Action: suggestEdge generates AI edge suggestions ...
------- output -------

# Testing AI Edge Suggestions

## 1. Create graph with nodes and edges
✓ Created graph with 3 nodes and 1 edge

## 2. Get AI edge suggestion
✓ Suggested edge: `019a2e1a-bb76-799d-9d2b-6a408f6b83a5` → `019a2e1a-bbb6-7e02-aac6-1598c69300f4`
  Reasonable: true

## 3. Try to add the suggested edge
✓ Successfully added suggested edge

## 4. Test edge suggestion with insufficient nodes
✓ Edge suggestion returns when insufficient nodes (reasonable=false)