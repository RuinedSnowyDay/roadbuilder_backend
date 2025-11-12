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
  // UserAuthentication: Public queries for user lookup (registration handled via syncs)
  "/api/UserAuthentication/_getUserByUsername":
    "Public query to check for username existence or find a user.",
  "/api/UserAuthentication/_getUsername":
    "Public query to get a username from a user ID.",

  // LikertSurvey: Public queries and responses (example concept)
  "/api/LikertSurvey/_getSurveyQuestions": "this is a public query",
  "/api/LikertSurvey/_getSurveyResponses": "responses are public",
  "/api/LikertSurvey/_getRespondentAnswers": "answers are visible",
  "/api/LikertSurvey/submitResponse": "allow anyone to submit response",
  "/api/LikertSurvey/updateResponse": "allow anyone to update their response",
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
  // UserAuthentication: Registration and login handled via syncs
  "/api/UserAuthentication/register",
  "/api/UserAuthentication/login",

  // Sessioning: All actions and queries handled via syncs (not public)
  "/api/Sessioning/create",
  "/api/Sessioning/delete",
  "/api/Sessioning/_getUser",

  // ObjectManager: All actions and queries require authentication via syncs
  "/api/ObjectManager/createAssignedObject",
  "/api/ObjectManager/accessObject",
  "/api/ObjectManager/deleteAssignedObject",
  "/api/ObjectManager/changeAssignedObjectTitle",
  "/api/ObjectManager/changeAssignedObjectDescription",
  "/api/ObjectManager/suggestTitle",
  "/api/ObjectManager/_getUserAssignedObjects",
  "/api/ObjectManager/_getObjectAssignments",
  "/api/ObjectManager/_getAssignedObject",

  // ResourceList: All actions and queries require authentication via syncs
  "/api/ResourceList/createResourceList",
  "/api/ResourceList/accessResourceList",
  "/api/ResourceList/renameResourceList",
  "/api/ResourceList/appendResource",
  "/api/ResourceList/accessResource",
  "/api/ResourceList/deleteResource",
  "/api/ResourceList/swapResources",
  "/api/ResourceList/moveResource",
  "/api/ResourceList/deleteResourceList",
  "/api/ResourceList/renameIndexedResource",
  "/api/ResourceList/_getListResources",
  "/api/ResourceList/_getResourceList",
  "/api/ResourceList/_getUserResourceLists",

  // EnrichedDAG: All actions and queries require authentication via syncs
  "/api/EnrichedDAG/createEmptyGraph",
  "/api/EnrichedDAG/accessGraph",
  "/api/EnrichedDAG/addNode",
  "/api/EnrichedDAG/accessNode",
  "/api/EnrichedDAG/changeNodeTitle",
  "/api/EnrichedDAG/addEdge",
  "/api/EnrichedDAG/accessEdge",
  "/api/EnrichedDAG/removeNode",
  "/api/EnrichedDAG/removeEdge",
  "/api/EnrichedDAG/deleteGraph",
  "/api/EnrichedDAG/suggestNodeTitle",
  "/api/EnrichedDAG/suggestEdge",
  "/api/EnrichedDAG/wouldCreateCycle", // Private helper method, not a public API
  "/api/EnrichedDAG/_getGraphNodes",
  "/api/EnrichedDAG/_getGraphEdges",
  "/api/EnrichedDAG/_getNodeOutgoingEdges",
  "/api/EnrichedDAG/_getNodeIncomingEdges",

  // ObjectChecker: All actions and queries require authentication via syncs
  "/api/ObjectChecker/createCheck",
  "/api/ObjectChecker/markObject",
  "/api/ObjectChecker/unmarkObject",
  "/api/ObjectChecker/deleteCheck",
  "/api/ObjectChecker/_getUserChecks",
  "/api/ObjectChecker/_getObjectChecks",
  "/api/ObjectChecker/_getCheck",

  // Sharing: All actions and queries require authentication via syncs
  // Note: deleteFile is called automatically via cascade deletion sync, not via HTTP
  "/api/Sharing/shareWithUser",
  "/api/Sharing/revokeAccess",
  "/api/Sharing/deleteFile",
  "/api/Sharing/_isSharedWith",
  "/api/Sharing/_getFilesSharedWithUser",

  // FileUploading: All actions and queries require authentication via syncs
  "/api/FileUploading/requestUploadURL",
  "/api/FileUploading/confirmUpload",
  "/api/FileUploading/delete",
  "/api/FileUploading/_getOwner",
  "/api/FileUploading/_getFilename",
  "/api/FileUploading/_getDownloadURL",
  "/api/FileUploading/_getFilesByOwner",

  // LikertSurvey: Actions that require authentication (example concept)
  "/api/LikertSurvey/createSurvey",
  "/api/LikertSurvey/addQuestion",
];
