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

### Implementation Statistics

- **Total Sync Files**: 8
- **Total Syncs**: ~100+ individual synchronizations (increased from ~80+ after fixing mutually exclusive output issues)
- **Concepts Covered**: 7 (excluding Requesting which is the bootstrap concept)
- **Authentication Required**: All syncs except registration and public queries
- **Response Syncs Fixed**: 18 syncs split into success/error pairs to handle mutually exclusive outputs

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

- `src/syncs/auth.sync.ts` - 10 syncs (updated from 8 - registration response split into success/error)
- `src/syncs/objectManager.sync.ts` - 11 syncs (updated from 8 - 3 response syncs split into success/error pairs)
- `src/syncs/resourceList.sync.ts` - 24 syncs (updated from 20 - 4 response syncs split into success/error pairs)
- `src/syncs/enrichedDAG.sync.ts` - 28 syncs (updated from 20 - 8 response syncs split into success/error pairs)
- `src/syncs/objectChecker.sync.ts` - 10 syncs (updated from 9 - 1 response sync split into success/error pair)
- `src/syncs/sharing.sync.ts` - 5 syncs
- `src/syncs/fileUploading.sync.ts` - 11 syncs (updated from 9 - 2 response syncs split into success/error pairs)

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

## Next Steps / Future Considerations

1. **Synchronizations**: ✅ Completed - All major concepts now have synchronizations
2. **Cascade Deletions**: ✅ File → Sharing cleanup implemented; Object and User cleanup documented for future implementation
3. **Additional Concepts**: Evaluate need for domain-specific concepts
4. **API Gateway**: Authentication/authorization layer is now implemented via syncs
5. **Performance**: Monitor and optimize database queries
6. **Documentation**: Continue maintaining API docs as concepts evolve
