# Design Notes: Changes After Merge with Upstream

This document describes the changes made to the repository after the assignment 4a,
tracket via the changes after merging with the remote-tracking branch `upstream/main`
(merge commit: `af22647`).

## Overview

Significant additions were made to expand the backend functionality, including new
concepts, API documentation, and improvements to existing concepts. Merging with main
branch provided the guides for writing API specifications and running the server.
Also concepts from ConceptBox were integrated into the backend.

## Major Changes

### 1. Concept Engine Framework (from merge)

The merge introduced the core concept engine infrastructure:

- **Engine Framework** (`src/engine/`): Complete synchronization engine with frames,
actions, and sync system
- **Requesting Concept** (`src/concepts/Requesting/`): HTTP request handling and
routing concept
- **Import Generation** (`src/utils/generate_imports.ts`): Automatic concept and sync
discovery
- **Main Application Entry** (`src/main.ts`): Application initialization with
synchronization support
- **Concept Server** (`src/concept_server.ts`): HTTP API server for direct concept
access
- **Architecture Documentation**: Comprehensive design documentation in
`design/background/`

### 2. API Documentation (Commit: 898d421)

Created API specifications for existing concepts:

- `design/concepts/EnrichedDAG/API.md`
- `design/concepts/ObjectManager/API.md`
- `design/concepts/Requesting/API.md`
- `design/concepts/ResourceList/API.md`

These API docs follow the standard format documenting endpoints, request/response
formats, requirements, and effects.

### 3. ObjectChecker Concept Implementation (Commits: 6f60563, caac461, 5feecd2)

**New Concept**: ObjectChecker

- **Implementation**: `src/concepts/ObjectChecker/ObjectCheckerConcept.ts`
- **Tests**: `src/concepts/ObjectChecker/ObjectCheckerConcept.test.ts`
- **Specification**: Updated `design/concepts/ObjectChecker/ObjectChecker.md`
- **API Documentation**: `design/concepts/ObjectChecker/API.md`
- **Test Assessment**: Comprehensive test documentation in
`design/concepts/ObjectChecker/test-assessment.md` and `test-notes.md`

The ObjectChecker concept provides validation and checking functionality for objects in the system.

### 4. Core Concepts from ConceptBox (Commit: 8ab4f15)

Integrated four fundamental concepts from the ConceptBox repository:

#### UserAuthentication

- **Implementation**: `src/concepts/UserAuthentication/UserAuthenticationConcept.ts`
- **Specification**: `design/concepts/UserAuthentication/UserAuthentication.md`
- **Documentation**: Includes implementation notes and additional queries

#### Sessioning

- **Implementation**: `src/concepts/Sessioning/SessioningConcept.ts`
- **Specification**: `design/concepts/Sessioning/Sessioning.md`
- **Implementation Notes**: `design/concepts/Sessioning/implementation.md`

#### Sharing

- **Implementation**: `src/concepts/Sharing/SharingConcept.ts`
- **Specification**: `design/concepts/Sharing/Sharing.md`
- **Documentation**: Includes implementation notes and additional queries

#### FileUploading

- **Implementation**: `src/concepts/FileUploading/FileUploadingConcept.ts`
- **Specification**: `design/concepts/FileUploading/FileUploading.md`
- **Comprehensive Documentation**:
  - `environment-setup.md`
  - `implementation.md`
  - `troubleshooting.md`
  - `additional-queries.md`

### 5. API Documentation for New Concepts (Commit: 8a3d2f2)

Added API specifications for the concepts copied from ConceptBox:

- `design/concepts/FileUploading/API.md`
- `design/concepts/Sessioning/API.md`
- `design/concepts/Sharing/API.md`
- `design/concepts/UserAuthentication/API.md`

Also fixed linter errors and updated `deno.lock`.

### 6. CORS Configuration (Commit: 3f54cba)

**Changed**: `src/concept_server.ts`

Added CORS support to allow locally hosted frontend and backend to communicate. This
enables development with separate frontend and backend servers.

### 7. ResourceList Concept Enhancements

#### New Action: moveResource (Commits: 43ae97f, 58b270c)

**Added**: `moveResource` action to ResourceList concept

- **Specification Update**: `design/concepts/ResourceList/ResourceList.md`
  - New action: `moveResource(resourceList: ResourceList, oldIndex: Number, newIndex: Number)`
  - Allows moving resources from one index to another within a list
  - Automatically adjusts indices of other resources

- **Implementation**: `src/concepts/ResourceList/ResourceListConcept.ts`
  - Handles forward and backward moves
  - Validates indices and prevents invalid operations
  - Properly re-indexes affected resources

- **Tests**: `src/concepts/ResourceList/ResourceListConcept.test.ts`
  - Comprehensive test coverage for forward/backward moves
  - Edge case testing (invalid indices, same index, non-existent list)

- **API Documentation**: `design/concepts/ResourceList/API.md`
  - Complete endpoint documentation for `moveResource`

This enhancement provides more ergonomic interaction for frontend applications that
need to reorder resources in lists.

### 8. README Update (Commit: f4b8a34)

**Changed**: `README.md`

Completely rewrote the README to:

- Provide comprehensive backend documentation
- Document the concept-based architecture
- Include setup instructions
- Document all available concepts
- Provide API usage examples
- Include development guidelines
- Document testing procedures
- Add project structure overview

The new README serves as a complete guide for developers working with the backend.

## File Changes Summary

### New Files Added

- 4 new concept implementations (UserAuthentication, Sessioning, Sharing,
FileUploading)
- 1 new concept implementation (ObjectChecker)
- 8+ API documentation files
- Multiple test files
- Implementation and troubleshooting documentation

### Modified Files

- `src/concept_server.ts` - CORS configuration
- `src/concepts/ResourceList/ResourceListConcept.ts` - moveResource implementation
- `src/concepts/ResourceList/ResourceListConcept.test.ts` - moveResource tests
- `design/concepts/ResourceList/ResourceList.md` - moveResource specification
- `design/concepts/ResourceList/API.md` - moveResource API docs
- `README.md` - Complete rewrite
- `deno.lock` - Dependency updates

## Architecture Impact

### New Capabilities

1. **User Management**: Complete authentication and session management system
2. **Resource Sharing**: Ability to share resources between users
3. **File Handling**: File upload and management capabilities
4. **Enhanced List Operations**: More flexible resource list manipulation
5. **Object Validation**: Generic object checking capabilities

### Integration Points

- **Requesting Concept**: All concepts can now be accessed via HTTP API
- **Synchronization Engine**: Concepts can interact through synchronizations
- **Concept Server**: Automatic endpoint generation for all concepts

## Testing Coverage

All new concepts include comprehensive test suites:

- ObjectChecker: Full test coverage with assessment documentation
- ResourceList: Enhanced tests for moveResource action
- UserAuthentication, Sessioning, Sharing, FileUploading: Tests from ConceptBox

## Documentation Status

All concepts now have:

- ✅ Concept specifications (`{ConceptName}.md`)
- ✅ API documentation (`API.md`)
- ✅ Implementation files
- ✅ Test files

## Assignment 4c: Synchronization Implementation

Implemented comprehensive synchronizations for all concepts to enable HTTP API access with authentication and authorization. This completes the integration of concepts with the Requesting concept and establishes a secure API layer.

### Implementation Phases

The synchronization implementation was done in phases:

1. **Initial Phase**: Core authentication and sessioning synchronizations were implemented first to establish the foundation for secure API access
   - `auth.sync.ts` - Core authentication (register, login, logout) and session management

2. **Expansion Phase**: Once authentication was in place, synchronizations for all other concepts were implemented:
   - `objectManager.sync.ts` - Object management operations
   - `resourceList.sync.ts` - Resource list operations
   - `enrichedDAG.sync.ts` - Graph operations
   - `objectChecker.sync.ts` - Object checking operations
   - `sharing.sync.ts` - File sharing operations
   - `fileUploading.sync.ts` - File upload operations

### Overview

Created 7 synchronization files covering all major concepts:

- `auth.sync.ts` - Core authentication (register, login, logout) - *Implemented first*
- `objectManager.sync.ts` - Object management operations
- `resourceList.sync.ts` - Resource list operations
- `enrichedDAG.sync.ts` - Graph operations
- `objectChecker.sync.ts` - Object checking operations
- `sharing.sync.ts` - File sharing operations
- `fileUploading.sync.ts` - File upload operations

### Patterns Discovered

#### 1. Request-Response Pattern

All syncs follow a consistent three-part pattern:

- **Request Sync**: Catches `Requesting.request` with specific path, authenticates via `Sessioning._getUser` in `where` clause, triggers concept action
- **Response Sync**: Matches both the original request and action result, responds via `Requesting.respond`
- **Error Handling**: Separate error response syncs where needed (e.g., login failures)

#### 2. Authentication Pattern

All authenticated operations use the same authentication pattern:

```typescript
where: async (frames) => {
  return await frames.query(Sessioning._getUser, { session }, { user });
}
```

This ensures that only authenticated users can perform actions, and the `user` variable is available for authorization checks.

#### 3. Query Handling Pattern

Queries require special handling for empty results to prevent timeouts:

```typescript
where: async (frames) => {
  const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
  if (userFrames.length === 0) {
    const originalFrame = frames[0];
    return new Frames({ ...originalFrame, [results]: { error: "Invalid or expired session." } });
  }
  
  const resultFrames = await userFrames.query(Concept._query, { ... }, { doc });
  if (resultFrames.length === 0) {
    const emptyResultFrame = { ...userFrames[0], [results]: [] };
    return new Frames(emptyResultFrame);
  }
  
  return resultFrames.collectAs([doc], results);
}
```

#### 4. Authorization Pattern

For operations requiring ownership checks (e.g., file deletion), we query ownership and filter:

```typescript
where: async (frames) => {
  const userFrames = await frames.query(Sessioning._getUser, { session }, { user });
  if (userFrames.length === 0) {
    return new Frames();
  }
  
  const ownerFrames = await userFrames.query(FileUploading._getOwner, { file }, { owner });
  // Filter to only allow if authenticated user is the owner
  return ownerFrames.filter((frame) => frame[owner] === frame[user]);
}
```

### Challenges and Solutions

#### Challenge 1: Empty Query Results

**Problem**: Queries that return empty arrays would cause syncs to not fire, leading to request timeouts.

**Solution**: Explicitly check for empty results and return a frame with an empty array or error message. This ensures the response sync always fires.

#### Challenge 2: Variable Name Conflicts

**Problem**: In Sharing syncs, the concept uses `user` parameter, but we also need `user` for the authenticated user.

**Solution**: Use aliased variable names like `authenticatedUser` and `shareUser` to distinguish between the authenticated user and the user being shared with.

#### Challenge 3: Single Document Queries

**Problem**: Some queries return a single document or null (e.g., `_getCheck`, `_getResourceList`), not arrays.

**Solution**: Handle these by checking if the result is empty and returning `null` in the results, or using `collectAs` appropriately.

#### Challenge 4: Login Flow Complexity

**Problem**: Login needs to create a session after successful authentication, then respond with the session ID.

**Solution**: Use a chain of syncs:

1. `UserLoginRequest` triggers `UserAuthentication.login`
2. `UserLoginSuccess` triggers `Sessioning.create` when login succeeds
3. `UserLoginResponse` matches both the request and session creation, then responds
4. `UserLoginErrorResponse` handles login failures separately

#### Challenge 5: Mutually Exclusive Action Outputs

**Problem**: Actions that return either success or error (e.g., `UserAuthentication.register` returns either `{ user }` OR `{ error }`) cannot be matched in a single sync that expects both fields. The sync engine's `matchArguments` function fails when a key in the output pattern is missing from the actual output (returns `undefined`).

**Discovery**: This issue was widespread across many syncs. Initially discovered in `UserRegistrationResponse`, but a comprehensive review found the same pattern in:

- **UserAuthentication**: `UserRegistrationResponse` (fixed)
- **ObjectManager**: `CreateAssignedObjectResponse`, `AccessObjectResponse`, `SuggestTitleResponse`
- **ResourceList**: `CreateResourceListResponse`, `AccessResourceListResponse`, `AppendResourceResponse`, `AccessResourceResponse`
- **EnrichedDAG**: `CreateEmptyGraphResponse`, `AccessGraphResponse`, `AddNodeResponse`, `AccessNodeResponse`, `AddEdgeResponse`, `AccessEdgeResponse`, `SuggestNodeTitleResponse`, `SuggestEdgeResponse`
- **ObjectChecker**: `CreateCheckResponse`
- **FileUploading**: `RequestUploadURLResponse`, `ConfirmUploadResponse`

**Solution**: Split all affected response syncs into separate success and error handlers:

- Success syncs match only the success output (e.g., `{ assignedObject }`, `{ newGraph }`, etc.)
- Error syncs match only the error output (e.g., `{ error }`)

This pattern matches the login flow (`UserLoginResponse` and `UserLoginErrorResponse`) and ensures that each sync only matches when its specific output is present. This is a critical pattern for any action that has mutually exclusive success/error outputs.

**Impact**: Fixed 18 response syncs across 5 concept files, splitting each into success/error pairs. This increased the total sync count but ensures all syncs work correctly with the sync engine's matching logic.

**Additional Discovery**: After fixing the initial issue, we discovered that actions returning `Empty | { error }` (where `Empty` is `{}`) also had the same problem. Response syncs that only matched `{ error }` would never fire for successful operations that return `{}`. Fixed an additional 15 response syncs:

- **EnrichedDAG**: `ChangeNodeTitleResponse`, `RemoveNodeResponse`, `RemoveEdgeResponse`, `DeleteGraphResponse`
- **ResourceList**: `RenameResourceListResponse`, `DeleteResourceResponse`, `SwapResourcesResponse`, `MoveResourceResponse`, `DeleteResourceListResponse`, `RenameIndexedResourceResponse`
- **ObjectManager**: `DeleteAssignedObjectResponse`, `ChangeTitleResponse`, `ChangeDescriptionResponse`
- **ObjectChecker**: `DeleteCheckResponse`
- **Auth**: `UserLogoutResponse` (already fixed by user)

**Total Impact**: 33 response syncs split into success/error pairs across all concept files.

#### Challenge 6: Query Output Pattern Matching and Response Format Consistency

**Problem**: Two related issues were discovered with the `GetUserSuccessRequest` and `GetUserErrorRequest` syncs:

1. **Query Pattern Matching**: The `GetUserErrorRequest` sync was trying to query `Sessioning._getUser` with an output pattern `{ error }` even when the session was valid. When a valid session exists, the query returns `[{ user: ... }]` (not `{ error }`), causing the query pattern matching to fail. This resulted in a "Missing binding: Symbol(error) in frame" error when trying to respond to the request.

2. **Response Format Inconsistency**: Both syncs were responding with `{ request, user }` or `{ request, error }` directly, but the frontend's `callConceptQuery` helper expects all query responses to be wrapped in a `results` array format: `{ results: [...] }`. This caused the frontend to fail when trying to parse the response, showing "Failed to get user from session" even though the backend was returning the correct data.

**Root Causes**: 
- The sync engine's query matching requires all keys in the output pattern to be present in the query result. When `GetUserErrorRequest` queried for `error` on a valid session, the query returned `{ user }` instead, causing the pattern match to fail.
- The syncs were not following the same response format pattern as other query syncs, which use `collectAs` to wrap results in a `results` field.

**Solution**: Fixed both syncs to:
1. **Handle query pattern matching correctly**: Modified `GetUserErrorRequest` to check for the success case first before querying for error:
   - First query for `user` (using a temporary symbol) to check if the session is valid
   - If a user is found, return empty frames so this sync doesn't fire (the success sync will handle it)
   - Only if no user is found, then query for `error`
   - If error is found, wrap it in results using `collectAs`

2. **Use consistent response format**: Updated both syncs to wrap responses in `results` arrays:
   - `GetUserSuccessRequest`: Uses `collectAs([user], results)` to wrap the user in a results array, responds with `{ request, results }`
   - `GetUserErrorRequest`: Uses `collectAs([error], results)` to wrap the error in a results array, responds with `{ request, results }`

This ensures that:
- Valid sessions: `GetUserSuccessRequest` fires and responds with `{ results: [{ user: '...' }] }`
- Invalid sessions: `GetUserErrorRequest` fires and responds with `{ results: [{ error: '...' }] }`

**Impact**: Fixed both the "Missing binding: Symbol(error) in frame" error and the "Failed to get user from session" frontend error. This pattern should be applied to any query syncs that need to handle both success and error cases, and all query syncs should use `collectAs` to wrap results for consistency with the frontend's expectations.

### Implementation Statistics

- **Total Sync Files**: 8
- **Total Syncs**: ~115+ individual synchronizations (increased from ~80+ after fixing mutually exclusive output issues)
- **Concepts Covered**: 7 (excluding Requesting which is the bootstrap concept)
- **Authentication Required**: All syncs except registration and public queries
- **Response Syncs Fixed**: 33 syncs split into success/error pairs to handle mutually exclusive outputs
  - 18 syncs for actions returning `{ successField } | { error }`
  - 15 syncs for actions returning `Empty | { error }` (where `Empty` is `{}`)

### Testing Approach

The synchronizations follow the documented patterns from `implementing-synchronizations.md`. Key testing considerations:

1. **Authentication**: Verify that unauthenticated requests are rejected
2. **Authorization**: Verify that users can only access/modify their own resources
3. **Empty Results**: Verify that queries with no results return appropriate empty arrays/null values
4. **Error Propagation**: Verify that concept errors are properly propagated through syncs to HTTP responses
5. **Request-Response Matching**: Verify that responses match their corresponding requests correctly

### Interesting Observations

1. **Frame Evolution**: The frame system elegantly handles the evolution of bindings through query chains. Each query enriches the frame with new bindings, making complex authorization checks straightforward.

2. **Flow Preservation**: The sync engine's flow preservation allows matching requests with their corresponding responses even when multiple actions occur in between (e.g., login → session creation → response).

3. **Pattern Reusability**: The authentication pattern is so consistent that it could potentially be abstracted into a helper function, though the explicit pattern makes the code more readable.

4. **Query Return Types**: The distinction between queries that return arrays vs. single documents requires careful handling, especially for empty cases.

5. **collectAs Utility**: The `collectAs` method is powerful for aggregating multiple query results into a single response, making it easy to return lists of resources.

### Files Created

- `src/syncs/auth.sync.ts` - 13 syncs (updated from 8 - registration response split, logout response split, _getUser query added with success/error split)
- `src/syncs/objectManager.sync.ts` - 14 syncs (updated from 8 - 3 response syncs with success fields split, 3 response syncs with Empty split)
- `src/syncs/resourceList.sync.ts` - 30 syncs (updated from 20 - 4 response syncs with success fields split, 6 response syncs with Empty split)
- `src/syncs/enrichedDAG.sync.ts` - 32 syncs (updated from 20 - 8 response syncs with success fields split, 4 response syncs with Empty split)
- `src/syncs/objectChecker.sync.ts` - 12 syncs (updated from 9 - 1 response sync with success field split, 2 response syncs with Empty split, 1 already had success/error split)
- `src/syncs/sharing.sync.ts` - 5 syncs (already had success/error split)
- `src/syncs/fileUploading.sync.ts` - 11 syncs (updated from 9 - 2 response syncs with success fields split, delete already had success/error split)

All syncs are automatically discovered by the import generation system and registered with the sync engine.

### Cascade Deletion Synchronizations

While the current synchronizations handle request/response cycles and authentication, cascade deletion synchronizations improve data consistency and prevent orphaned records:

#### 1. File Deletion → Sharing Cleanup ✅ IMPLEMENTED

**Priority**: High

**Issue**: When a file is deleted in `FileUploading`, the sharing relationships in `Sharing` are not automatically cleaned up, leaving orphaned sharing records.

**Implementation**:

- ✅ Added `deleteFile` action to the `Sharing` concept (`SharingConcept.ts`)
- ✅ Created cascade deletion synchronization (`cascadeDeletions.sync.ts`):

  ```typescript
  when: FileUploading.delete (file)
  then: Sharing.deleteFile (file)
  ```

- ✅ Updated `Sharing.md` specification to include the new action
- ✅ Updated `Sharing/API.md` to document the new endpoint
- ✅ Added route exclusion in `passthrough.ts` (action is called automatically via sync, not via HTTP)

**Files Modified**:

- `src/concepts/Sharing/SharingConcept.ts` - Added `deleteFile` action
- `design/concepts/Sharing/Sharing.md` - Updated specification
- `design/concepts/Sharing/API.md` - Added API documentation
- `src/syncs/cascadeDeletions.sync.ts` - New file with cascade deletion sync
- `src/concepts/Requesting/passthrough.ts` - Added exclusion for deleteFile route

**Status**: ✅ Completed

#### 2. Object Deletion → ObjectChecker and ObjectManager Cleanup

**Priority**: Medium (depends on whether object deletion exists)

**Issue**: If objects can be deleted, related checks in `ObjectChecker` and assigned objects in `ObjectManager` should be cleaned up to prevent orphaned references.

**Proposed Solution**:

- When an object is deleted → delete all `ObjectChecker` checks for that object
  - Use `ObjectChecker._getObjectChecks` to find all checks
  - Delete each check via `ObjectChecker.deleteCheck`
- When an object is deleted → delete all `ObjectManager` assigned objects for that object
  - Use `ObjectManager._getObjectAssignments` to find all assigned objects
  - Delete each assigned object via `ObjectManager.deleteAssignedObject`

**Queries Available**:

- `ObjectChecker._getObjectChecks` ✅
- `ObjectManager._getObjectAssignments` ✅

**Status**: Requires object deletion action to exist first.

#### 3. User Deletion → Comprehensive Cleanup

**Priority**: Medium (depends on whether user deletion exists)

**Issue**: If users can be deleted, all their resources across all concepts should be cleaned up to maintain data integrity.

**Proposed Cleanup Targets**:

- **Sessions**: Delete all sessions for the user (requires `_getSessionsByUser` query)
- **Assigned Objects**: Delete via `ObjectManager._getUserAssignedObjects` ✅
- **Resource Lists**: Delete via `ResourceList._getUserResourceLists` ✅
- **Graphs**: Delete all graphs owned by user (requires `_getGraphsByOwner` query)
- **Checks**: Delete via `ObjectChecker._getUserChecks` ✅
- **Files**: Delete via `FileUploading._getFilesByOwner` ✅
- **Sharing Relationships**: Remove user from all `sharedWith` arrays (requires query to find all files shared with user)

**Queries Available**:

- `ObjectManager._getUserAssignedObjects` ✅
- `ResourceList._getUserResourceLists` ✅
- `ObjectChecker._getUserChecks` ✅
- `FileUploading._getFilesByOwner` ✅

**Queries Needed**:

- `Sessioning._getSessionsByUser` (does not exist)
- `EnrichedDAG._getGraphsByOwner` (does not exist)
- `Sharing._getFilesSharedWithUser` ✅ (exists, but may need modification)

**Status**: Requires user deletion action and additional queries.

#### 4. AssignedObject Deletion → No Cleanup Needed

**Status**: No cascade needed - when an `AssignedObject` is deleted, the underlying `Object` still exists, so no cleanup is required.

### Implementation Priority

1. ✅ **File → Sharing Cleanup** - COMPLETED
   - Most commonly needed
   - Simple implementation once `deleteFile` action was added to Sharing

2. **Object → ObjectChecker/ObjectManager Cleanup** (Medium Priority)
   - Depends on object deletion functionality existing
   - Important for data integrity if objects can be deleted

3. **User → Everything Cleanup** (Medium Priority)
   - Most comprehensive cleanup
   - Requires additional queries to be added
   - Important for GDPR compliance and data management

### Notes

- Cascade deletion synchronizations follow the pattern described in the concept design overview
- They maintain referential integrity across concepts without violating concept independence
- Cascade deletions are implemented in `cascadeDeletions.sync.ts` to keep them organized
- Unlike request/response syncs, cascade deletions don't require authentication in the `where` clause since they're triggered by concept actions, not HTTP requests

## Recent Fixes: Resource Content and Checkmark Functionality

### Issue 1: Resource Completion Toggle Timeouts

**Problem**: When toggling resource completion (checkmarks), requests would timeout after 10 seconds. Backend trace showed `ObjectChecker.markObject` and `ObjectChecker.unmarkObject` actions succeeding but no response being sent.

**Root Cause**: The `MarkObjectResponse` and `UnmarkObjectResponse` syncs only handled error cases. Both `markObject` and `unmarkObject` return `{}` on success or `{ error }` on error (mutually exclusive outputs), requiring separate success and error response syncs.

**Solution**: Split both syncs into success/error pairs:
- `MarkObjectSuccessResponse` - handles `{}` success return
- `MarkObjectErrorResponse` - handles `{ error }` error return
- `UnmarkObjectSuccessResponse` - handles `{}` success return
- `UnmarkObjectErrorResponse` - handles `{ error }` error return

**Files Modified**: `src/syncs/objectChecker.sync.ts`

### Issue 2: Checkmark Query "functionOutputArray is not iterable" Error

**Problem**: When appending resources to nodes, backend errors showed "functionOutputArray is not iterable" during `ObjectChecker._getCheck` calls.

**Root Cause**: The `_getCheck` query returned `CheckDoc | null`, but the sync engine's query processing expects arrays. The query needed to return `{ doc: CheckDoc }[]` (array with one item or empty).

**Solution**:
1. Updated `ObjectChecker._getCheck` query to return `{ doc: CheckDoc }[]` instead of `CheckDoc | null`
2. Updated `GetCheckRequest` sync to manually extract the `CheckDoc` from the first frame and wrap it in a `results` array: `[{ doc: CheckDoc }]` or `[]` if no check exists
3. Updated `ObjectCheckerConcept.test.ts` to unwrap the `doc` field from the returned array

**Files Modified**:
- `src/concepts/ObjectChecker/ObjectCheckerConcept.ts`
- `src/syncs/objectChecker.sync.ts`
- `src/concepts/ObjectChecker/ObjectCheckerConcept.test.ts`

### Issue 3: Resource Content Disappearing on Reload

**Problem**: Markdown content added to resources would disappear after page reload or login/logout.

**Root Causes**: Two separate issues:
1. **File Deletion Timeout**: `DeleteFileResponse` sync only handled error cases, but `FileUploading.delete` returns `{}` on success, causing timeouts when deleting old files before creating new ones
2. **Download URL Response Format**: `GetDownloadURLRequest` sync responded with `{ request, downloadURL }` directly, but the frontend's `callConceptQuery` expects responses wrapped in a `results` array

**Solutions**:
1. Split `DeleteFileResponse` into `DeleteFileSuccessResponse` (handles `{}`) and `DeleteFileErrorResponse` (handles `{ error }`)
2. Updated `GetDownloadURLRequest` to:
   - Extract the `downloadURL` value from the query result
   - Wrap it in an array: `[{ downloadURL: urlValue }]`
   - Store in `results` and respond with `{ request, results }`

**Files Modified**: `src/syncs/fileUploading.sync.ts`

### Pattern Consistency

All fixes follow the established patterns:
- **Mutually Exclusive Outputs**: Actions returning either success (`{}` or `{ data }`) or error (`{ error }`) require separate success/error response syncs
- **Query Response Format**: All query syncs must wrap results in a `results` array to match frontend expectations: `{ results: [...] }`
- **Array Return Types**: Queries must return arrays (even if single-item or empty) to work with the sync engine's query processing

**Impact**: Fixed resource completion toggling, checkmark loading, and resource content persistence. All three issues were related to the same underlying pattern: syncs not properly handling mutually exclusive action outputs or query response formats.

### Issue 4: Shared Roadmap Viewing and Resource Content Access

**Problem**: Users could not see roadmaps shared with them, and even when they could see the roadmap structure, they couldn't view the markdown content of resources in shared roadmaps.

**Root Causes**: Multiple issues:
1. **GetFilesSharedWithUserRequest sync**: Used `authenticatedUser` symbol in query parameters, but the sync engine couldn't resolve it from the frame. Should use `user` instead.
2. **Missing GetObjectAssignmentsRequest sync**: The `_getObjectAssignments` query was excluded from passthrough but had no sync, causing timeouts when trying to load shared roadmap details.
3. **Resource content loading**: `loadResourceContent` only checked files owned by the user, not files shared with them.

**Solutions**:
1. Fixed `GetFilesSharedWithUserRequest` to use `user` instead of `authenticatedUser` for consistency with other syncs.
2. Created `GetObjectAssignmentsRequest` sync in `objectManager.sync.ts` following the same pattern as `GetUserAssignedObjectsRequest`.
3. Updated `_getObjectAssignments` query to return wrapped documents (`{ doc: AssignedObjectDoc }[]`) for consistency.
4. Updated frontend `loadResourceContent` to:
   - First check files owned by the user
   - If not found and viewing a shared roadmap, also check files shared with the user
   - Get filenames for all shared files in parallel and match by filename
   - Use the matched file to get download URL (which works for shared files since `_getDownloadURL` doesn't check ownership)

**Files Modified**:
- `src/syncs/sharing.sync.ts` - Fixed `GetFilesSharedWithUserRequest` to use `user` symbol
- `src/syncs/objectManager.sync.ts` - Added `GetObjectAssignmentsRequest` sync
- `src/concepts/ObjectManager/ObjectManagerConcept.ts` - Updated `_getObjectAssignments` to return wrapped documents
- `roadbuilder_frontend/src/stores/roadmap.ts` - Updated `loadResourceContent` to check shared files

### Issue 5: Checkmarks Entangled Across Users

**Problem**: Checkmarks from different users were getting mixed up. Users viewing shared roadmaps would see checkmarks from other users instead of their own.

**Root Cause**: The frontend cache for resource checks used only `resourceId` as the key, so checkmarks were shared across users. When User A loaded a check for resource X, and then User B loaded a check for resource X, User B would see User A's cached check.

**Solution**: Made the cache key user-specific by using a composite key `${userId}-${resourceId}`:
- Updated `loadResourceCheck` to use composite key
- Updated `toggleResourceCompletion` to use composite key
- Updated `isResourceChecked` in `NodeContentPanel.vue` to use composite key
- Updated `calculateNodeProgress` in `RoadmapEditor.vue` to use composite key
- Added `clearResourceChecks()` function and call it on logout to free memory

**Files Modified**:
- `roadbuilder_frontend/src/stores/roadmap.ts` - Updated cache key to be user-specific, added `clearResourceChecks()`
- `roadbuilder_frontend/src/components/NodeContentPanel.vue` - Updated to use composite cache key
- `roadbuilder_frontend/src/components/RoadmapEditor.vue` - Updated to use composite cache key
- `roadbuilder_frontend/src/stores/auth.ts` - Added call to `clearResourceChecks()` on logout

**Note**: The backend was already correctly filtering checks by user (the `_getCheck` query takes both `user` and `object` as parameters), so the issue was purely in the frontend cache.

### Issue 6: Resource Editor State Persistence Across Node Switches

**Problem**: When switching between nodes, the markdown editor would show content from the previous node's resource instead of clearing.

**Root Cause**: The `editingResource` and `editingResourceContent` refs were not being cleared when the `selectedNode` changed.

**Solution**: Updated the `watch` handler for `selectedNode` to clear the resource editor state when switching between different nodes or when the node is closed.

**Files Modified**:
- `roadbuilder_frontend/src/components/NodeContentPanel.vue` - Added logic to clear resource editor on node change

### Feature Addition: Roadmap Title and Description Editing

**Implementation**: Added ability to edit roadmap title and description directly from the roadmap view page.

**Features**:
- Edit button (✏️) next to roadmap title (only visible for non-shared roadmaps)
- Inline editing form with title and description fields
- Duplicate title validation (both client-side and server-side)
- Preserves invariant that titles must be unique per user
- Updates both local state and backend

**Implementation Details**:
- Added `updateRoadmapTitle` and `updateRoadmapDescription` functions to roadmap store
- Both functions check for duplicate titles before updating
- Backend validates uniqueness via `ObjectManager.changeAssignedObjectTitle` action
- Form includes error handling and visual feedback for duplicate titles

**Files Modified**:
- `roadbuilder_frontend/src/stores/roadmap.ts` - Added `updateRoadmapTitle` and `updateRoadmapDescription` functions
- `roadbuilder_frontend/src/views/RoadmapView.vue` - Added edit UI, form, and handlers

## Next Steps / Future Considerations

1. **Synchronizations**: ✅ Completed - All major concepts now have synchronizations
2. **Cascade Deletions**: ✅ File → Sharing cleanup implemented; Object and User cleanup documented for future implementation
3. **Additional Concepts**: Evaluate need for domain-specific concepts
4. **API Gateway**: Authentication/authorization layer is now implemented via syncs
5. **Performance**: Monitor and optimize database queries
6. **Documentation**: Continue maintaining API docs as concepts evolve
