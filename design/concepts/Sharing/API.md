# API Specification: Sharing Concept

**Purpose:** To allow file owners to grant access to other users.

---

## API Endpoints

### POST /api/Sharing/shareWithUser

**Description:** Grants a user access to a file by adding them to the file's sharedWith set.

**Requirements:**
- `user` is not already in the `sharedWith` set for `file`.

**Effects:**
- Adds the `user` to the `sharedWith` set for `file`.
- If the file has no entry, it will be created.

**Request Body:**
```json
{
  "file": "ID",
  "user": "ID"
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

### POST /api/Sharing/revokeAccess

**Description:** Removes a user's access to a file by removing them from the file's sharedWith set.

**Requirements:**
- `user` is in the `sharedWith` set for `file`.

**Effects:**
- Removes the `user` from the `sharedWith` set for `file`.

**Request Body:**
```json
{
  "file": "ID",
  "user": "ID"
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

### POST /api/Sharing/_isSharedWith

**Description:** Query that checks whether a user has access to a file.

**Requirements:**
- `file` and `user` exist.

**Effects:**
- Returns `true` if the `user` is in the `sharedWith` set for the `file`, false otherwise.

**Request Body:**
```json
{
  "file": "ID",
  "user": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "access": "boolean"
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

### POST /api/Sharing/_getFilesSharedWithUser

**Description:** Query that retrieves all files that have been shared with a specific user.

**Requirements:**
- user exists.

**Effects:**
- Returns the set of all `file`s that have `user` in their `sharedWith` set.

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
    "file": "ID"
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
