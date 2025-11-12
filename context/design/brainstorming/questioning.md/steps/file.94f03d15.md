---
timestamp: 'Mon Nov 10 2025 17:10:31 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_171031.122aa537.md]]'
content_id: 94f03d152960846510f547b3c8ae32140eeefdfa459a898242372ad057ecbb7d
---

# file: src/concepts/Requesting/passthrough.ts

```typescript
/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // There are no public actions or queries for ObjectManager,
  // so this list should be empty unless other public concepts are added.
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // All ObjectManager actions and queries require authentication
  // to ensure a user can only affect their own objects.
  "/api/ObjectManager/createAssignedObject",
  "/api/ObjectManager/accessObject",
  "/api/ObjectManager/deleteAssignedObject",
  "/api/ObjectManager/changeAssignedObjectTitle",
  "/api/ObjectManager/changeAssignedObjectDescription",
  "/api/ObjectManager/suggestTitle",
  "/api/ObjectManager/_getUserAssignedObjects",
  "/api/ObjectManager/_getObjectAssignments",
  "/api/ObjectManager/_getAssignedObject",
];
```
