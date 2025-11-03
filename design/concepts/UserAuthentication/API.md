# API Specification: UserAuthentication Concept

**Purpose:** To securely verify a user's identity based on credentials.

---

## API Endpoints

### POST /api/UserAuthentication/register

**Description:** Creates a new user account with a username and password.

**Requirements:**
- No User exists with the given `username`.
- OR a User already exists with the given `username` (error case).

**Effects:**
- Creates a new User `u`; sets their `username` and a hash of their `password`; returns `u` as `user`.
- OR returns an error message if the username already exists.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuthentication/login

**Description:** Authenticates a user by verifying their username and password credentials.

**Requirements:**
- A User exists with the given `username` and the `password` matches their `passwordHash`.
- OR no User exists with the given `username` or the `password` does not match (error case).

**Effects:**
- Returns the matching User `u` as `user`.
- OR returns an error message if authentication fails.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuthentication/_getUserByUsername

**Description:** Query that retrieves a user by their username.

**Requirements:**
- A User with the given `username` exists.

**Effects:**
- Returns the corresponding User.

**Request Body:**
```json
{
  "username": "string"
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

### POST /api/UserAuthentication/_getUsername

**Description:** Query that retrieves the username of a user by their ID.

**Requirements:**
- A User with the given `user` ID exists.

**Effects:**
- Returns the username of the corresponding User.

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
    "username": "string"
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
