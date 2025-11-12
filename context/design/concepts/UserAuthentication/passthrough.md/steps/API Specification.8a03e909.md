---
timestamp: 'Mon Nov 10 2025 17:47:09 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251110_174709.92681c4d.md]]'
content_id: 8a03e909859cf7f25210e920dd1409b0794bab04e748af74910f47096b975be8
---

# API Specification: Sessioning Concept

**Purpose:** To maintain a user's logged-in state across multiple requests without re-sending credentials.

***

## API Endpoints

### POST /api/Sessioning/create

**Description:** Creates a new session for a user and associates it with them.

**Requirements:**

* true

**Effects:**

* Creates a new Session `s`; associates it with the given `user`; returns `s` as `session`.

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

***

### POST /api/Sessioning/delete

**Description:** Removes a session, effectively logging out the user.

**Requirements:**

* The given `session` exists.

**Effects:**

* Removes the session `s`.

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

***

### POST /api/Sessioning/\_getUser

**Description:** Query that retrieves the user associated with a session.

**Requirements:**

* The given `session` exists.

**Effects:**

* Returns the user associated with the session.

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

***
