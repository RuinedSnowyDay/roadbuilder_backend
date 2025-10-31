# API Specification: ResourceList Concept

**Purpose:** store resources in an ordered manner

---

## API Endpoints

### POST /api/ResourceList/createResourceList

**Description:** Creates a new resource list for a user with a specified title.

**Requirements:**
- There are no ResourceLists with the same owner User and listTitle title String in the set of ResourceLists

**Effects:**
- Adds new ResourceList with provided owner User and listTitle title String, and with length set to 0 to the set of ResourceLists
- Returns this new ResourceList

**Request Body:**
```json
{
  "owner": "ID",
  "listTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "newResourceList": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/accessResourceList

**Description:** Accesses a resource list by owner and title.

**Requirements:**
- There is a ResourceList with the same owner User and listTitle title String in the set of ResourceLists

**Effects:**
- Returns the ResourceList that has the same owner User and listTitle title String in the set of ResourceLists

**Request Body:**
```json
{
  "owner": "ID",
  "listTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "accessedResouceList": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/renameResourceList

**Description:** Renames a resource list.

**Requirements:**
- resourceList is in the set of ResourceLists

**Effects:**
- Sets the title of provided resourceList to newTitle

**Request Body:**
```json
{
  "resourceList": "ID",
  "newTitle": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/appendResource

**Description:** Appends a resource to the end of a resource list.

**Requirements:**
- resourceList is in the set of ResourceLists

**Effects:**
- Adds a new IndexedResource with the provided resource, resourceTitle, and index set to the length of the ResourceList to the set of IndexedResources
- Returns this new IndexedResource
- Increments the length of the ResourceList by 1

**Request Body:**
```json
{
  "resourceList": "ID",
  "resource": "ID",
  "resourceTitle": "string"
}
```

**Success Response Body (Action):**
```json
{
  "newIndexedResource": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/accessResource

**Description:** Accesses a resource in a list by its index.

**Requirements:**
- resourceList is in the set of ResourceLists
- index is a non-negative integer less than the length of the ResourceList

**Effects:**
- Returns the IndexedResource at the provided index in the ResourceList

**Request Body:**
```json
{
  "resourceList": "ID",
  "index": "number"
}
```

**Success Response Body (Action):**
```json
{
  "accessedIndexedResource": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/deleteResource

**Description:** Deletes a resource from a list at a specific index, automatically adjusting subsequent indices.

**Requirements:**
- resourceList is in the set of ResourceLists
- index is a non-negative integer less than the length of the ResourceList

**Effects:**
- Removes the IndexedResource at the provided index from the set of IndexedResources
- Decrements the length of the ResourceList by 1
- Decrements indices of all IndexedResources with list being provided resourceList and index greater than provided index by 1

**Request Body:**
```json
{
  "resourceList": "ID",
  "index": "number"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/swapResources

**Description:** Swaps the positions of two resources in a list.

**Requirements:**
- resourceList is in the set of ResourceLists
- index1 and index2 are non-negative integers less than the length of the ResourceList

**Effects:**
- Swaps the IndexedResources at the provided indices in the ResourceList

**Request Body:**
```json
{
  "resourceList": "ID",
  "index1": "number",
  "index2": "number"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/deleteResourceList

**Description:** Deletes a resource list and all its associated resources.

**Requirements:**
- resourceList is in the set of ResourceLists

**Effects:**
- Removes the ResourceList from the set of ResourceLists
- Also removes all IndexedResources associated with the ResourceList from the set of IndexedResources

**Request Body:**
```json
{
  "resourceList": "ID"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/renameIndexedResource

**Description:** Renames a resource in a list.

**Requirements:**
- indexedResource is in the set of IndexedResources

**Effects:**
- Sets the title of provided indexedResource to newTitle

**Request Body:**
```json
{
  "indexedResource": "ID",
  "newTitle": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/_getListResources

**Description:** Query that retrieves all resources in a list, ordered by index.

**Requirements:**
- resourceList is in the set of ResourceLists

**Effects:**
- Returns all IndexedResources associated with the provided resourceList, sorted by index

**Request Body:**
```json
{
  "resourceList": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "resource": "ID",
    "title": "string",
    "list": "ID",
    "index": "number"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/_getResourceList

**Description:** Query that retrieves a resource list by owner and title.

**Requirements:**
- There is a ResourceList with the same owner User and listTitle title String in the set of ResourceLists

**Effects:**
- Returns the ResourceList that has the same owner User and listTitle title String, or null if not found

**Request Body:**
```json
{
  "owner": "ID",
  "listTitle": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "title": "string",
    "owner": "ID",
    "length": "number"
  }
]
```

**Note:** This query returns an array with at most one element. If no list is found, the array will be empty.

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ResourceList/_getUserResourceLists

**Description:** Query that retrieves all resource lists for a user.

**Requirements:**
- owner is a valid User ID

**Effects:**
- Returns all ResourceLists associated with the provided owner User

**Request Body:**
```json
{
  "owner": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "title": "string",
    "owner": "ID",
    "length": "number"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

