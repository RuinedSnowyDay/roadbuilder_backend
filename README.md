# RoadBuilder Backend

A backend application built using **concept-based architecture**, where functionality
is organized into self-contained, modular concepts that interact through
synchronizations. This architecture enables clean separation of concerns and
composable functionality.

## 🏗️ Architecture Overview

This backend uses a **concept design approach** that structures functionality around
two fundamental building blocks:

1. **Concepts**: Self-contained, modular increments of functionality (e.g.,
`UserAuthentication`, `ResourceList`, `Sharing`)
2. **Synchronizations**: Rules that orchestrate interactions between concepts (e.g.,
"when a user is deleted, clean up their resources")

Concepts are independently implemented TypeScript classes that expose actions and
queries, while synchronizations define how concepts interact with each other. This
design allows for:

- **Modularity**: Each concept is self-contained and independently testable
- **Composability**: Concepts can be combined through synchronizations
- **Separation of Concerns**: Business logic is cleanly separated by domain

For detailed information about concept design, see
[`design/background/architecture.md`](design/background/architecture.md).

## 📋 Available Concepts

The following concepts are currently implemented:

- **UserAuthentication**: User registration and authentication
- **Sessioning**: Session management
- **ResourceList**: Ordered lists of resources with index-based operations
- **ObjectManager**: Generic object management
- **ObjectChecker**: Object validation and checking
- **EnrichedDAG**: Directed acyclic graph with enriched nodes
- **Sharing**: Resource sharing functionality
- **FileUploading**: File upload and management
- **Requesting**: HTTP request handling and routing (bootstrap concept)

Each concept has its own API documentation in `design/concepts/{ConceptName}/API.md`.

## 🛠️ Tech Stack

- **Runtime**: [Deno](https://deno.com) - Modern JavaScript/TypeScript runtime
- **Database**: [MongoDB](https://www.mongodb.com) (via MongoDB Atlas)
- **Web Framework**: [Hono](https://hono.dev) - Fast web framework for Deno
- **Language**: TypeScript
- **Testing**: Deno Test Framework

## 📦 Prerequisites

- [Deno](https://deno.com) installed (version 1.40+)
- MongoDB Atlas account (free tier works)
- Gemini API key (for LLM features, optional)
- [Obsidian](https://obsidian.md) (recommended for design documentation)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd roadbuilder_backend
```

### 2. Install Dependencies

Deno handles dependencies automatically. No `npm install` needed!

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=roadbuilder

# Gemini API (optional, for LLM features)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Server Configuration (optional)
PORT=8000
REQUESTING_BASE_URL=/api
REQUESTING_TIMEOUT=10000
```

### 4. MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account
2. Create a free M0 cluster
3. Configure network access to allow connections from anywhere (for development)
4. Create a database user and get your connection string
5. Add the connection string to `.env` as `MONGODB_URL`

### 5. Generate Imports

Before running the server, generate the concept imports:

```bash
deno task import
# or
deno run src/utils/generate_imports.ts
```

This scans `src/concepts/` and `src/syncs/` and generates the necessary import files.

### 6. Start the Server

**Option A: Concept Server (HTTP API)**

```bash
deno task concepts
# or
deno run --allow-net --allow-read --allow-sys --allow-env src/concept_server.ts --port 8000 --baseUrl /api
```

This starts an HTTP server that automatically exposes all concept actions as REST
endpoints at `/api/{ConceptName}/{actionName}`.

**Option B: Full Application (with Synchronizations)**

```bash
deno task start
# or
deno run --allow-net --allow-write --allow-read --allow-sys --allow-env src/main.ts
```

This starts the full application with synchronizations enabled.

The server will be available at `http://localhost:8000`.

## 📚 API Documentation

The backend exposes concept actions as REST endpoints. All endpoints use `POST` method and accept JSON bodies.

### Endpoint Format

```
POST /api/{ConceptName}/{actionName}
```

### Example Request

```bash
curl -X POST http://localhost:8000/api/ResourceList/createResourceList \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "user:123",
    "listTitle": "My Reading List"
  }'
```

### Example Response

```json
{
  "newResourceList": "019a4f93-6e58-71b7-9097-f49bfb542452"
}
```

### Available Endpoints

Each concept automatically exposes its actions as endpoints. To see all available
endpoints, start the server and check the console output, which lists all registered
routes.

For detailed API documentation, see:
- [`design/concepts/ResourceList/API.md`](design/concepts/ResourceList/API.md)
- [`design/concepts/UserAuthentication/API.md`](design/concepts/UserAuthentication/API.md)
- [`design/concepts/ObjectManager/API.md`](design/concepts/ObjectManager/API.md)
- ... and other concept API docs in `design/concepts/`

## 🧪 Testing

### Run All Tests

```bash
deno test -A
```

This will:

- Run all test files matching `*.test.ts`
- Automatically create a test database (`test-{DB_NAME}`)
- Clean the test database before each test run

### Run Specific Tests

```bash
deno test src/concepts/ResourceList/ResourceListConcept.test.ts -A
```

### Test Structure

Each concept should have a corresponding test file:

- `{ConceptName}Concept.test.ts` - Tests for the concept's actions and queries
- Tests use `testDb()` helper which provides a clean database for each test
- Tests verify both **requires** (preconditions) and **effects** (postconditions) from
  the concept specification

For more on testing, see
[`design/background/testing-concepts.md`](design/background/testing-concepts.md).

## 📁 Project Structure

```
roadbuilder_backend/
├── src/
│   ├── concepts/          # Concept implementations
│   │   ├── UserAuthentication/
│   │   ├── ResourceList/
│   │   └── ...
│   ├── syncs/             # Synchronizations between concepts
│   │   └── sample.sync.ts
│   ├── engine/            # Concept engine framework
│   │   ├── sync.ts        # Synchronization engine
│   │   ├── frames.ts      # Frame system
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── database.ts    # MongoDB helpers
│   │   └── types.ts       # Type definitions
│   ├── concept_server.ts  # HTTP API server
│   └── main.ts            # Application entry point
│
├── design/
│   ├── background/        # Design documentation
│   │   ├── architecture.md
│   │   ├── concept-specifications.md
│   │   ├── implementing-concepts.md
│   │   └── testing-concepts.md
│   ├── concepts/          # Concept specifications
│   │   ├── ResourceList/
│   │   │   ├── ResourceList.md    # Concept spec
│   │   │   ├── API.md             # API documentation
│   │   │   └── ...
│   │   └── ...
│   └── tools/             # Design tools
│
├── context/               # Immutable design history (Context tool)
├── deno.json              # Deno configuration
├── geminiConfig.json      # Gemini LLM configuration
└── README.md
```

## 🔧 Development Guide

### Adding a New Concept

1. **Design the Concept**
   - Create a specification in `design/concepts/{ConceptName}/{ConceptName}.md`
   - Define state, actions, and queries
   - See [`design/background/concept-specifications.md`](design/background/concept-specifications.md) for format

2. **Implement the Concept**
   - Create `src/concepts/{ConceptName}/{ConceptName}Concept.ts`
   - Implement as a TypeScript class extending no base class
   - Each action/query is a method
   - See [`design/background/implementing-concepts.md`](design/background/implementing-concepts.md) for details

3. **Write Tests**
   - Create `src/concepts/{ConceptName}/{ConceptName}Concept.test.ts`
   - Test all actions and edge cases
   - See [`design/background/testing-concepts.md`](design/background/testing-concepts.md)

4. **Generate API Documentation**
   - Use the API extraction tools in `design/tools/`
   - Or manually create `design/concepts/{ConceptName}/API.md`

5. **Regenerate Imports**
   ```bash
   deno task import
   ```

### Adding Synchronizations

Synchronizations define how concepts interact. They are defined in `src/syncs/`:

```typescript
import { actions, Sync } from "@engine";
import { Requesting } from "@concepts";
import { Sessioning } from "@concepts";

const MySync: Sync = ({ path, session, user }) => ({
  when: actions(
    [Requesting.request, { path: "/my/endpoint", session }, {}],
  ),
  where: (frames) => {
    return frames.query(Sessioning.getUser, { session }, { user });
  },
  then: actions(
    // Your concept actions here
  ),
});

export default [MySync];
```

See [`design/background/implementing-synchronizations.md`](design/background/implementing-synchronizations.md) for details.

### Concept Implementation Rules

1. **No cross-concept imports**: Concepts cannot import other concepts
2. **Dictionary arguments**: All actions take a single dictionary/JSON object
3. **Dictionary returns**: All actions return a single dictionary/JSON object
4. **Query methods**: Queries must start with `_` and return arrays
5. **Error handling**: Return `{ error: "message" }` instead of throwing

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URL` | MongoDB connection string | Yes | - |
| `DB_NAME` | Database name | Yes | - |
| `GEMINI_API_KEY` | Gemini API key for LLM features | No | - |
| `GEMINI_MODEL` | Gemini model to use | No | `gemini-2.5-flash` |
| `PORT` | Server port | No | `8000` |
| `REQUESTING_BASE_URL` | API base URL prefix | No | `/api` |
| `REQUESTING_TIMEOUT` | Request timeout (ms) | No | `10000` |

## 📖 Additional Resources

### Design Documentation

- [Architecture Overview](design/background/architecture.md)
- [Concept Specifications Guide](design/background/concept-specifications.md)
- [Implementing Concepts](design/background/implementing-concepts.md)
- [Testing Concepts](design/background/testing-concepts.md)
- [Implementing Synchronizations](design/background/implementing-synchronizations.md)

### External Links

- [Deno Documentation](https://docs.deno.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Hono Framework](https://hono.dev)
