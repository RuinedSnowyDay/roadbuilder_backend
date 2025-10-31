# API Specification: ObjectManager Concept

**Purpose:** manage the creation, deletion, and modification of named and described objects for a given user

---

## API Endpoints

### POST /api/ObjectManager/createAssignedObject

**Description:** Creates a new assigned object for a user with a title and description.

**Requirements:**
- There are no AssignedObjects with the same object Object as input object, and also with the same owner User and title String at the same time

**Effects:**
- Adds new AssignedObject with provided owner User, object, title, and description to the set of AssignedObjects
- Returns the added AssignedObject

**Request Body:**
```json
{
  "owner": "ID",
  "object": "ID",
  "title": "string",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "assignedObject": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ObjectManager/accessObject

**Description:** Accesses an object by its owner and title.

**Requirements:**
- There is an AssignedObject with provided owner User and title

**Effects:**
- Returns the Object associated with given user and title

**Request Body:**
```json
{
  "owner": "ID",
  "title": "string"
}
```

**Success Response Body (Action):**
```json
{
  "accessedObject": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ObjectManager/deleteAssignedObject

**Description:** Deletes an assigned object for a user.

**Requirements:**
- There is an AssignedObject with provided owner User and title

**Effects:**
- Removes the AssignedObject associated with input owner and title from the set of AssignedObjects

**Request Body:**
```json
{
  "owner": "ID",
  "title": "string"
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

### POST /api/ObjectManager/changeAssignedObjectTitle

**Description:** Changes the title of an assigned object.

**Requirements:**
- There is an AssignedObject with provided owner User and oldTitle
- There are no AssignedObjects with the owner User and newTitle

**Effects:**
- Changes the title of the AssignedObject associated with input owner and oldTitle to newTitle

**Request Body:**
```json
{
  "owner": "ID",
  "oldTitle": "string",
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

### POST /api/ObjectManager/changeAssignedObjectDescription

**Description:** Changes the description of an assigned object.

**Requirements:**
- There is an AssignedObject with provided owner User and title

**Effects:**
- Changes the description of the AssignedObject associated with input owner and title to newDescription

**Request Body:**
```json
{
  "owner": "ID",
  "title": "string",
  "newDescription": "string"
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

### POST /api/ObjectManager/suggestTitle

**Description:** Returns an AI-generated suggestion for a new title based on existing assigned objects.

**Requirements:**
- There is at least one AssignedObject associated with input owner User in the set of AssignedObjects

**Effects:**
- Returns a title String suggested by AI based on titles of AssignedObjects associated with provided owner User

**Request Body:**
```json
{
  "owner": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "titleSuggestion": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ObjectManager/_getUserAssignedObjects

**Description:** Query that retrieves all assigned objects for a given user.

**Requirements:**
- owner is a valid User ID

**Effects:**
- Returns all AssignedObjects associated with the provided owner User

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
    "owner": "ID",
    "object": "ID",
    "title": "string",
    "description": "string"
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

### POST /api/ObjectManager/_getObjectAssignments

**Description:** Query that retrieves all assigned objects for a given object.

**Requirements:**
- object is a valid Object ID

**Effects:**
- Returns all AssignedObjects associated with the provided object

**Request Body:**
```json
{
  "object": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "owner": "ID",
    "object": "ID",
    "title": "string",
    "description": "string"
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

### POST /api/ObjectManager/_getAssignedObject

**Description:** Query that retrieves an assigned object by owner and title.

**Requirements:**
- There is an AssignedObject with provided owner User and title

**Effects:**
- Returns the AssignedObject associated with given owner and title, or null if not found

**Request Body:**
```json
{
  "owner": "ID",
  "title": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "owner": "ID",
    "object": "ID",
    "title": "string",
    "description": "string"
  }
]
```

**Note:** This query returns an array with at most one element. If no object is found, the array will be empty.

**Error Response Body:**
```json
{
  "error": "string"
}
```

