# API Specification: ObjectChecker Concept

**Purpose:** track user-specific markings on objects

---

## API Endpoints

### POST /api/ObjectChecker/createCheck

**Description:** Creates a new check for a user and object, initially set to unchecked.

**Requirements:**
- There is no Check with the same user and object in the set of Checks

**Effects:**
- Adds a new Check with provided user, object, checked set to false
- Returns the new Check

**Request Body:**
```json
{
  "user": "ID",
  "object": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "newCheck": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ObjectChecker/markObject

**Description:** Marks a check as checked (sets the checked field to true).

**Requirements:**
- check is in the set of Checks

**Effects:**
- Updates the checked field of the provided check to true

**Request Body:**
```json
{
  "check": "ID"
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

### POST /api/ObjectChecker/unmarkObject

**Description:** Unmarks a check (sets the checked field to false).

**Requirements:**
- check is in the set of Checks

**Effects:**
- Updates the checked field of the provided check to false

**Request Body:**
```json
{
  "check": "ID"
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

### POST /api/ObjectChecker/deleteCheck

**Description:** Deletes a check from the system.

**Requirements:**
- check is in the set of Checks

**Effects:**
- Removes the provided check from the set of Checks

**Request Body:**
```json
{
  "check": "ID"
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

### POST /api/ObjectChecker/_getUserChecks

**Description:** Query that retrieves all checks for a given user.

**Requirements:**
- user is a valid User ID

**Effects:**
- Returns all Checks associated with the provided user User

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "user": "ID",
    "object": "ID",
    "checked": "boolean"
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

### POST /api/ObjectChecker/_getObjectChecks

**Description:** Query that retrieves all checks for a given object.

**Requirements:**
- object is a valid Object ID

**Effects:**
- Returns all Checks associated with the provided object Object

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
    "user": "ID",
    "object": "ID",
    "checked": "boolean"
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

### POST /api/ObjectChecker/_getCheck

**Description:** Query that retrieves a specific check by user and object.

**Requirements:**
- user is a valid User ID
- object is a valid Object ID

**Effects:**
- Returns the Check associated with the provided user and object, or null if not found

**Request Body:**
```json
{
  "user": "ID",
  "object": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "_id": "ID",
    "user": "ID",
    "object": "ID",
    "checked": "boolean"
  }
]
```

**Note:** This query returns an array with at most one element. If no check is found, the array will be empty.

**Error Response Body:**
```json
{
  "error": "string"
}
```

