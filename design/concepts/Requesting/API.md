# API Specification: Requesting Concept

**Purpose:** Encapsulate HTTP requests and responses as concept actions, enabling synchronization-based request/response cycles.

---

## API Endpoints

### POST /api/Requesting/request

**Description:** System action triggered by an external HTTP request. Creates a new request record that can be responded to via synchronizations.

**Requirements:**
- true (always allowed)

**Effects:**
- Creates a new Request `r`
- Sets the input of `r` to be the path and all other input parameters
- Returns `r` as `request`

**Request Body:**
```json
{
  "path": "string",
  "...": "any additional parameters"
}
```

**Note:** The `path` parameter represents the action path from the URL (without the base URL prefix). Additional parameters from the request body are also included.

**Example Request Body:**
```json
{
  "path": "/LikertSurvey/createSurvey",
  "author": "user123",
  "title": "Mangos",
  "scaleMin": 1,
  "scaleMax": 5
}
```

**Success Response Body (Action):**
```json
{
  "request": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Requesting/respond

**Description:** Sets the response for a pending request, resolving any waiting queries.

**Requirements:**
- A Request with the given `request` id exists and has no response yet

**Effects:**
- Sets the response of the given Request to the provided key-value pairs
- Resolves any pending `_awaitResponse` queries waiting on this request

**Request Body:**
```json
{
  "request": "ID",
  "...": "any response parameters"
}
```

**Note:** The response can include any key-value pairs. These will be returned to the client that initiated the request.

**Example Request Body:**
```json
{
  "request": "019a22d2-e44d-7f79-be62-92ead8db2d77",
  "survey": "019a22d2-e485-71b4-a668-e7d9e8859b15"
}
```

**Success Response Body (Action):**
```json
{
  "request": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Requesting/_awaitResponse

**Description:** Query that waits for a response to a request, blocking until the response is available or a timeout occurs.

**Requirements:**
- A Request with the given `request` id exists

**Effects:**
- Returns the response associated with the given request, waiting if necessary up to a configured timeout
- If the request times out, throws an error

**Request Body:**
```json
{
  "request": "ID"
}
```

**Success Response Body (Query):**
```json
[
  {
    "response": {
      "...": "response parameters as provided to respond action"
    }
  }
]
```

**Example Success Response:**
```json
[
  {
    "response": {
      "survey": "019a22d2-e485-71b4-a668-e7d9e8859b15"
    }
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

**Note:** Common error messages include:
- `"Request {id} is not pending or does not exist: it may have timed-out."` - The request was already processed or never existed
- `"Request {id} timed out after {timeout}ms"` - The request exceeded the configured timeout period (default 10000ms)

---

## Special Passthrough Routes

The Requesting concept also automatically registers **passthrough routes** for all concept actions and queries. These routes allow direct access to concept functionality without going through the request/response cycle.

### Passthrough Route Format

All passthrough routes follow this pattern:
```
POST /api/{ConceptName}/{actionOrQueryName}
```

### Passthrough Behavior

- **Request Method:** `POST`
- **Request Body:** A single JSON object matching the action's input arguments
- **Response Body:** A single JSON object matching the action's results (for actions) or a JSON array (for queries)
- **Error Handling:** Returns `{ "error": "..." }` on failure

### Example Passthrough Request

For the `EnrichedDAG.createEmptyGraph` action:

**Request:**
```http
POST /api/EnrichedDAG/createEmptyGraph
Content-Type: application/json

{
  "owner": "user:Alice",
  "graphTitle": "Project Dependencies"
}
```

**Response:**
```json
{
  "newGraph": "019a2e07-b3d0-7b57-8ecd-639fa33ee014"
}
```

### Configuring Passthrough Routes

Passthrough routes can be configured via the `passthrough.ts` file:
- **Inclusions:** Routes that are explicitly allowed with justification
- **Exclusions:** Routes that should not passthrough and instead use the Requesting concept

Routes not in either list will be registered but marked as unverified.

---

## Requesting Routes

Any HTTP POST request to paths that don't match a passthrough route will automatically trigger a `Requesting.request` action. The path from the URL (without the base URL prefix) is included as the `path` parameter, along with all other request body parameters.

The server will then:
1. Create a request via `Requesting.request`
2. Wait for synchronizations to trigger `Requesting.respond`
3. Return the response to the client

This enables synchronization-based request handling, allowing multiple concepts to react to requests and coordinate responses.

