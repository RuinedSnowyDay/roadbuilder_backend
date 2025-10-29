---
timestamp: 'Tue Oct 28 2025 23:43:20 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251028_234320.5d8d9db8.md]]'
content_id: 14744a43c879dda99d5223cb31f42b59ae917159179d8938de82ff4e374b846c
---

# Trace: Fulfilling the EnrichedDAG Operational Principle

The principle states: 'Users can create new graph, add nodes to the graph or remove them, add edges between nodes in the graph or remove them. Nodes have titles associated with them; they are unique to one particular graph and can be changed by the user. User can't add edges so that they form a cycle in the graph.'

## 1. User creates a new graph

* Action: createEmptyGraph({ owner: "user:Alice", graphTitle: "Project Dependencies" })
  Result: Graph created with ID: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`

## 2. User adds nodes to the graph

* Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "Database Design", enrichment: `enrichment:type-A` })
  Result: Node created with ID: `019a2e07-b42c-779b-b404-7ffa7ff5881c`
* Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "API Implementation", enrichment: `enrichment:type-B` })
  Result: Node created with ID: `019a2e07-b4be-7410-b1a3-89c55a0f14ff`
* Action: addNode({ graph: `019a2e07-b3d0-7b57-8ecd-639fa33ee014`, nodeTitle: "Frontend Development", enrichment: `enrichment:type-C` })
  Result: Node created with ID: `019a2e07-b550-747f-8bad-998a4206d2d8`

## 3. User adds edges between nodes

* Action: addEdge({ sourceNode: `019a2e07-b42c-779b-b404-7ffa7ff5881c`, targetNode: `019a2e07-b4be-7410-b1a3-89c55a0f14ff` })
  Result: Edge created with ID: `019a2e07-b5e0-73d2-99b4-822e502984ea`
* Action: addEdge({ sourceNode: `019a2e07-b4be-7410-b1a3-89c55a0f14ff`, targetNode: `019a2e07-b550-747f-8bad-998a4206d2d8` })
  Result: Edge created with ID: `019a2e07-b688-737d-9720-8a264e231134`

## 4. User changes a node title

* Action: changeNodeTitle({ node: `019a2e07-b42c-779b-b404-7ffa7ff5881c`, newNodeTitle: "Database Schema Design" })
  Result: Title changed successfully

✅ Principle successfully demonstrated
\----- output end -----
Principle: Users create graphs, add nodes with titles and enrichments, connect them with edges ... ok (1s)
Action: addEdge prevents cycle creation ...
\------- output -------
