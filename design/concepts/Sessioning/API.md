# API Specification: Sessioning Concept

**Purpose:** To maintain a user's logged-in state across multiple requests without re-sending credentials.

---

## API Endpoints

### POST /api/Sessioning/create

**Description:** Creates a new session for a user and associates it with them.

**Requirements:**
- true

**Effects:**
- Creates a new Session `s`; associates it with the given `user`; returns `s` as `session`.

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body (Action):**
```json
{
  "session": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Sessioning/delete

**Description:** Removes a session, effectively logging out the user.

**Requirements:**
- The given `session` exists.

**Effects:**
- Removes the session `s`.

**Request Body:**
```json
{
  "session": "ID"
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

### POST /api/Sessioning/_getUser

**Description:** Query that retrieves the user associated with a session.

**Requirements:**
- The given `session` exists.

**Effects:**
- Returns the user associated with the session.

**Request Body:**
```json
{
  "session": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "user": "ID"
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
