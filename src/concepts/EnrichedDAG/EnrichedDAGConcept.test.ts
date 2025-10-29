import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import EnrichedDAGConcept from "./EnrichedDAGConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const enrichment1 = "enrichment:type-A" as ID;
const enrichment2 = "enrichment:type-B" as ID;
const enrichment3 = "enrichment:type-C" as ID;

Deno.test(
  "Principle: Users create graphs, add nodes with titles and enrichments, connect them with edges",
  async () => {
    const [db, client] = await testDb();
    const dagConcept = new EnrichedDAGConcept(db);

    try {
      console.log(
        "\n# Trace: Fulfilling the EnrichedDAG Operational Principle",
      );
      console.log(
        "The principle states: 'Users can create new graph, add nodes to the graph or remove them, add edges between nodes in the graph or remove them. Nodes have titles associated with them; they are unique to one particular graph and can be changed by the user. User can't add edges so that they form a cycle in the graph.'",
      );

      // 1. Create a graph
      console.log("\n## 1. User creates a new graph");
      const createGraphResult = await dagConcept.createEmptyGraph({
        owner: userA,
        graphTitle: "Project Dependencies",
      });
      assertNotEquals(
        "error" in createGraphResult,
        true,
        "Creating graph should succeed.",
      );
      const { newGraph } = createGraphResult as { newGraph: ID };
      console.log(
        `- Action: createEmptyGraph({ owner: "${userA}", graphTitle: "Project Dependencies" })`,
      );
      console.log(`  Result: Graph created with ID: \`${newGraph}\``);

      // 2. Add nodes to the graph
      console.log("\n## 2. User adds nodes to the graph");
      const addNode1Result = await dagConcept.addNode({
        graph: newGraph,
        nodeTitle: "Database Design",
        enrichment: enrichment1,
      });
      assertNotEquals(
        "error" in addNode1Result,
        true,
        "Adding node 1 should succeed.",
      );
      const { newNode: node1 } = addNode1Result as { newNode: ID };
      console.log(
        `- Action: addNode({ graph: \`${newGraph}\`, nodeTitle: "Database Design", enrichment: \`${enrichment1}\` })`,
      );
      console.log(`  Result: Node created with ID: \`${node1}\``);

      const addNode2Result = await dagConcept.addNode({
        graph: newGraph,
        nodeTitle: "API Implementation",
        enrichment: enrichment2,
      });
      assertNotEquals(
        "error" in addNode2Result,
        true,
        "Adding node 2 should succeed.",
      );
      const { newNode: node2 } = addNode2Result as { newNode: ID };
      console.log(
        `- Action: addNode({ graph: \`${newGraph}\`, nodeTitle: "API Implementation", enrichment: \`${enrichment2}\` })`,
      );
      console.log(`  Result: Node created with ID: \`${node2}\``);

      const addNode3Result = await dagConcept.addNode({
        graph: newGraph,
        nodeTitle: "Frontend Development",
        enrichment: enrichment3,
      });
      assertNotEquals(
        "error" in addNode3Result,
        true,
        "Adding node 3 should succeed.",
      );
      const { newNode: node3 } = addNode3Result as { newNode: ID };
      console.log(
        `- Action: addNode({ graph: \`${newGraph}\`, nodeTitle: "Frontend Development", enrichment: \`${enrichment3}\` })`,
      );
      console.log(`  Result: Node created with ID: \`${node3}\``);

      // 3. Add edges between nodes
      console.log("\n## 3. User adds edges between nodes");
      const addEdge1Result = await dagConcept.addEdge({
        graph: newGraph,
        sourceNode: node1,
        targetNode: node2,
        enrichment: enrichment1,
      });
      assertNotEquals(
        "error" in addEdge1Result,
        true,
        "Adding edge 1 should succeed.",
      );
      const { newEdge: edge1 } = addEdge1Result as { newEdge: ID };
      console.log(
        `- Action: addEdge({ sourceNode: \`${node1}\`, targetNode: \`${node2}\` })`,
      );
      console.log(`  Result: Edge created with ID: \`${edge1}\``);

      const addEdge2Result = await dagConcept.addEdge({
        graph: newGraph,
        sourceNode: node2,
        targetNode: node3,
        enrichment: enrichment2,
      });
      assertNotEquals(
        "error" in addEdge2Result,
        true,
        "Adding edge 2 should succeed.",
      );
      const { newEdge: edge2 } = addEdge2Result as { newEdge: ID };
      console.log(
        `- Action: addEdge({ sourceNode: \`${node2}\`, targetNode: \`${node3}\` })`,
      );
      console.log(`  Result: Edge created with ID: \`${edge2}\``);

      // 4. Change a node title
      console.log("\n## 4. User changes a node title");
      const changeTitleResult = await dagConcept.changeNodeTitle({
        graph: newGraph,
        node: node1,
        newNodeTitle: "Database Schema Design",
      });
      assertEquals(
        "error" in changeTitleResult,
        false,
        "Changing node title should succeed.",
      );
      console.log(
        `- Action: changeNodeTitle({ node: \`${node1}\`, newNodeTitle: "Database Schema Design" })`,
      );
      console.log(`  Result: Title changed successfully`);

      // 5. Verify the graph structure
      const nodes = await dagConcept._getGraphNodes({ graph: newGraph });
      assertEquals(nodes.length, 3, "Should have 3 nodes");
      assertEquals(
        nodes.find((n) => n._id === node1)?.title,
        "Database Schema Design",
        "Node title should be updated",
      );

      const edges = await dagConcept._getGraphEdges({ graph: newGraph });
      assertEquals(edges.length, 2, "Should have 2 edges");
      console.log("\n✅ Principle successfully demonstrated");
    } finally {
      await client.close();
    }
  },
);

Deno.test("Action: addEdge prevents cycle creation", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Cycle Detection in Edge Addition");
    console.log("\n## 1. Create graph and add nodes");
    const { newGraph } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Test Graph",
    })) as { newGraph: ID };
    console.log(`✓ Created graph: \`${newGraph}\``);

    const { newNode: nodeA } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node A",
      enrichment: enrichment1,
    })) as { newNode: ID };
    const { newNode: nodeB } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node B",
      enrichment: enrichment2,
    })) as { newNode: ID };
    const { newNode: nodeC } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node C",
      enrichment: enrichment3,
    })) as { newNode: ID };
    console.log("✓ Created 3 nodes");

    // 2. Create a path: A -> B -> C
    console.log("\n## 2. Create a path: A → B → C");
    await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: nodeA,
      targetNode: nodeB,
      enrichment: enrichment1,
    });
    await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: nodeB,
      targetNode: nodeC,
      enrichment: enrichment2,
    });
    console.log("✓ Created edges: A → B → C");

    // 3. Try to create a valid edge (doesn't create cycle)
    console.log("\n## 3. Add a valid edge (A → C, no cycle)");
    const validEdgeResult = await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: nodeA,
      targetNode: nodeC,
      enrichment: enrichment3,
    });
    assertEquals(
      "error" in validEdgeResult,
      false,
      "Adding edge A→C should succeed (no cycle)",
    );
    console.log("✓ Added edge A → C (valid, no cycle)");

    // 4. Try to create a cycle (C → A)
    console.log("\n## 4. Try to create a cycle (C → A)");
    const cycleResult = await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: nodeC,
      targetNode: nodeA,
      enrichment: enrichment1,
    });
    assertEquals(
      "error" in cycleResult,
      true,
      "Adding edge C→A should fail (creates cycle)",
    );
    console.log(
      `✗ Failed as expected: ${(cycleResult as { error: string }).error}`,
    );

    // 5. Try to create a self-loop
    console.log("\n## 5. Try to create a self-loop (A → A)");
    const selfLoopResult = await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: nodeA,
      targetNode: nodeA,
      enrichment: enrichment1,
    });
    assertEquals(
      "error" in selfLoopResult,
      true,
      "Adding edge A→A should fail (self-loop)",
    );
    console.log(
      `✗ Failed as expected: ${(selfLoopResult as { error: string }).error}`,
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: node and edge removal", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Node and Edge Removal");

    // Setup
    console.log("\n## 1. Create graph with nodes and edges");
    const { newGraph } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Removal Test",
    })) as { newGraph: ID };

    const { newNode: node1 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node 1",
      enrichment: enrichment1,
    })) as { newNode: ID };
    const { newNode: node2 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node 2",
      enrichment: enrichment2,
    })) as { newNode: ID };
    const { newNode: node3 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Node 3",
      enrichment: enrichment3,
    })) as { newNode: ID };

    await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: node1,
      targetNode: node2,
      enrichment: enrichment1,
    });
    await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: node2,
      targetNode: node3,
      enrichment: enrichment2,
    });

    console.log("✓ Created graph with 3 nodes and 2 edges");

    // Verify initial state
    let edges = await dagConcept._getGraphEdges({ graph: newGraph });
    assertEquals(edges.length, 2, "Should have 2 edges");

    // Remove an edge
    console.log("\n## 2. Remove an edge");
    const edge1 = edges[0];
    const removeEdgeResult = await dagConcept.removeEdge({ edge: edge1._id });
    assertEquals(
      "error" in removeEdgeResult,
      false,
      "Removing edge should succeed",
    );
    console.log(`✓ Removed edge: ${edge1.source} → ${edge1.target}`);

    // Verify edge is removed
    edges = await dagConcept._getGraphEdges({ graph: newGraph });
    assertEquals(edges.length, 1, "Should have 1 edge left");

    // Remove a node (should also remove connected edges)
    console.log("\n## 3. Remove a node (should also remove its edges)");
    const removeNodeResult = await dagConcept.removeNode({ node: node2 });
    assertEquals(
      "error" in removeNodeResult,
      false,
      "Removing node should succeed",
    );
    console.log(`✓ Removed node 2`);

    // Verify node and edges are removed
    edges = await dagConcept._getGraphEdges({ graph: newGraph });
    assertEquals(edges.length, 0, "All edges should be removed");
    const nodes = await dagConcept._getGraphNodes({ graph: newGraph });
    assertEquals(nodes.length, 2, "Should have 2 nodes left");
    console.log("✓ All edges connected to the node were also removed");

    // Try to remove non-existent edge
    console.log("\n## 4. Try to remove non-existent edge");
    const nonexistentEdgeResult = await dagConcept.removeEdge({
      edge: "fake:edge" as ID,
    });
    assertEquals(
      "error" in nonexistentEdgeResult,
      true,
      "Should fail - edge doesn't exist",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: deleteGraph removes all associated nodes and edges", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Graph Deletion");

    // Create multiple graphs
    console.log("\n## 1. Create multiple graphs with nodes");
    const { newGraph: graph1 } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Graph 1",
    })) as { newGraph: ID };
    const { newGraph: graph2 } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Graph 2",
    })) as { newGraph: ID };

    const { newNode: node1G1 } = (await dagConcept.addNode({
      graph: graph1,
      nodeTitle: "G1 Node 1",
      enrichment: enrichment1,
    })) as { newNode: ID };
    const { newNode: node2G1 } = (await dagConcept.addNode({
      graph: graph1,
      nodeTitle: "G1 Node 2",
      enrichment: enrichment2,
    })) as { newNode: ID };

    const { newNode: node1G2 } = (await dagConcept.addNode({
      graph: graph2,
      nodeTitle: "G2 Node 1",
      enrichment: enrichment3,
    })) as { newNode: ID };

    // Add edge in graph1
    await dagConcept.addEdge({
      graph: graph1,
      sourceNode: node1G1,
      targetNode: node2G1,
      enrichment: enrichment1,
    });

    console.log("✓ Created 2 graphs with nodes and edges");

    // Delete graph1
    console.log("\n## 2. Delete graph 1");
    const deleteResult = await dagConcept.deleteGraph({ graph: graph1 });
    assertEquals(
      "error" in deleteResult,
      false,
      "Deleting graph should succeed",
    );
    console.log("✓ Deleted graph 1");

    // Verify graph1's nodes and edges are gone
    const nodesG1 = await dagConcept._getGraphNodes({ graph: graph1 });
    const edgesG1 = await dagConcept._getGraphEdges({ graph: graph1 });
    assertEquals(nodesG1.length, 0, "Graph1 should have no nodes");
    assertEquals(edgesG1.length, 0, "Graph1 should have no edges");

    // Verify graph2 still exists
    const nodesG2 = await dagConcept._getGraphNodes({ graph: graph2 });
    assertEquals(nodesG2.length, 1, "Graph2 should still have 1 node");
    console.log(
      "✓ Graph 1 and its nodes/edges removed, Graph 2 remains intact",
    );

    // Try to access deleted graph's nodes
    console.log("\n## 3. Try to access nodes from deleted graph");
    const accessResult = await dagConcept.accessNode({
      graph: graph1,
      nodeTitle: "G1 Node 1",
    });
    assertEquals(
      "error" in accessResult,
      true,
      "Should fail - node from deleted graph",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: addNode enforces unique titles within a graph", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Node Title Uniqueness");

    // Create graph
    console.log("\n## 1. Create graph and add node");
    const { newGraph } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Title Uniqueness Test",
    })) as { newGraph: ID };

    await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Task A",
      enrichment: enrichment1,
    });
    console.log("✓ Created node with title 'Task A'");

    // Try to add duplicate title
    console.log("\n## 2. Try to add node with duplicate title");
    const duplicateResult = await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Task A",
      enrichment: enrichment2,
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Should fail - duplicate title in same graph",
    );
    console.log(
      `✗ Failed as expected: ${(duplicateResult as { error: string }).error}`,
    );

    // Different graph can have same title
    console.log("\n## 3. Different graph can have same title");
    const { newGraph: graph2 } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Another Graph",
    })) as { newGraph: ID };

    const allowedResult = await dagConcept.addNode({
      graph: graph2,
      nodeTitle: "Task A",
      enrichment: enrichment2,
    });
    assertEquals(
      "error" in allowedResult,
      false,
      "Same title in different graph should work",
    );
    console.log("✓ Created node with 'Task A' in different graph");
  } finally {
    await client.close();
  }
});

Deno.test("Action: changeNodeTitle validates uniqueness", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Node Title Changes");

    // Setup
    console.log("\n## 1. Create graph with nodes");
    const { newGraph } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Title Change Test",
    })) as { newGraph: ID };

    const { newNode: node1 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Original Title",
      enrichment: enrichment1,
    })) as { newNode: ID };

    await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Existing Title",
      enrichment: enrichment2,
    });

    console.log("✓ Setup complete");

    // Valid change
    console.log("\n## 2. Change to new unique title");
    const changeResult = await dagConcept.changeNodeTitle({
      graph: newGraph,
      node: node1,
      newNodeTitle: "Updated Title",
    });
    assertEquals(
      "error" in changeResult,
      false,
      "Changing to unique title should succeed",
    );
    console.log("✓ Changed: 'Original Title' → 'Updated Title'");

    // Try to change to existing title
    console.log("\n## 3. Try to change to existing title");
    const conflictResult = await dagConcept.changeNodeTitle({
      graph: newGraph,
      node: node1,
      newNodeTitle: "Existing Title",
    });
    assertEquals(
      "error" in conflictResult,
      true,
      "Should fail - title already exists",
    );
    console.log(
      `✗ Failed as expected: ${(conflictResult as { error: string }).error}`,
    );

    // Try to change non-existent node
    console.log("\n## 4. Try to change non-existent node");
    const nonexistentResult = await dagConcept.changeNodeTitle({
      graph: newGraph,
      node: "fake:node" as ID,
      newNodeTitle: "Some Title",
    });
    assertEquals(
      "error" in nonexistentResult,
      true,
      "Should fail - node doesn't exist",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: accessEdge and edge queries", async () => {
  const [db, client] = await testDb();
  const dagConcept = new EnrichedDAGConcept(db);

  try {
    console.log("\n# Testing Edge Access and Queries");

    // Setup
    console.log("\n## 1. Create graph with nodes and edges");
    const { newGraph } = (await dagConcept.createEmptyGraph({
      owner: userA,
      graphTitle: "Edge Access Test",
    })) as { newGraph: ID };

    const { newNode: node1 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Start",
      enrichment: enrichment1,
    })) as { newNode: ID };
    const { newNode: node2 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "Middle",
      enrichment: enrichment2,
    })) as { newNode: ID };
    const { newNode: node3 } = (await dagConcept.addNode({
      graph: newGraph,
      nodeTitle: "End",
      enrichment: enrichment3,
    })) as { newNode: ID };

    const { newEdge: edge1 } = (await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: node1,
      targetNode: node2,
      enrichment: enrichment1,
    })) as { newEdge: ID };

    const { newEdge: edge2 } = (await dagConcept.addEdge({
      graph: newGraph,
      sourceNode: node2,
      targetNode: node3,
      enrichment: enrichment2,
    })) as { newEdge: ID };

    console.log("✓ Created graph with 3 nodes and 2 edges");

    // Access existing edge
    console.log("\n## 2. Access existing edge");
    const accessResult = await dagConcept.accessEdge({
      graph: newGraph,
      sourceNode: node1,
      targetNode: node2,
    });
    assertEquals(
      "error" in accessResult,
      false,
      "Accessing existing edge should succeed",
    );
    const { newEdge } = accessResult as { newEdge: ID };
    assertExists(newEdge);
    console.log(`✓ Retrieved edge: \`${newEdge}\``);

    // Query outgoing edges
    console.log("\n## 3. Query outgoing edges from node 2");
    const outgoingEdges = await dagConcept._getNodeOutgoingEdges({
      node: node2,
    });
    assertEquals(outgoingEdges.length, 1, "Node 2 should have 1 outgoing edge");
    assertEquals(outgoingEdges[0].target, node3, "Target should be node 3");
    console.log(`✓ Found ${outgoingEdges.length} outgoing edge(s)`);

    // Query incoming edges
    console.log("\n## 4. Query incoming edges to node 2");
    const incomingEdges = await dagConcept._getNodeIncomingEdges({
      node: node2,
    });
    assertEquals(incomingEdges.length, 1, "Node 2 should have 1 incoming edge");
    assertEquals(incomingEdges[0].source, node1, "Source should be node 1");
    console.log(`✓ Found ${incomingEdges.length} incoming edge(s)`);

    // Try to access non-existent edge
    console.log("\n## 5. Try to access non-existent edge");
    const missingResult = await dagConcept.accessEdge({
      graph: newGraph,
      sourceNode: node3,
      targetNode: node1,
    });
    assertEquals(
      "error" in missingResult,
      true,
      "Should fail - edge doesn't exist",
    );
    console.log("✗ Failed as expected");
  } finally {
    await client.close();
  }
});
