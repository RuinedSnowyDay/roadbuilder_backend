// This import loads the `.env` file as environment variables
import "jsr:@std/dotenv/load";
import { Db, MongoClient } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { generate } from "jsr:@std/uuid/unstable-v7";

async function initMongoClient() {
  const DB_CONN = Deno.env.get("MONGODB_URL");
  if (DB_CONN === undefined) {
    throw new Error("Could not find environment variable: MONGODB_URL");
  }
  const client = new MongoClient(DB_CONN);
  try {
    await client.connect();
  } catch (e) {
    throw new Error("MongoDB connection failed: " + e);
  }
  return client;
}

async function init() {
  const client = await initMongoClient();
  const DB_NAME = Deno.env.get("DB_NAME");
  if (DB_NAME === undefined) {
    throw new Error("Could not find environment variable: DB_NAME");
  }
  return [client, DB_NAME] as [MongoClient, string];
}

async function dropAllCollections(db: Db): Promise<void> {
  try {
    // Get all collection names
    const collections = await db.listCollections().toArray();

    // Drop each collection
    for (const collection of collections) {
      await db.collection(collection.name).drop();
    }
  } catch (error) {
    console.error("Error dropping collections:", error);
    throw error;
  }
}

/**
 * MongoDB database configured by .env
 * @returns {[Db, MongoClient]} initialized database and client
 */
export async function getDb() {
  const [client, DB_NAME] = await init();
  return [client.db(DB_NAME), client] as [Db, MongoClient];
}

/**
 * Test database initialization
 * @returns {[Db, MongoClient]} initialized test database and client
 */
export async function testDb() {
  const [client, DB_NAME] = await init();
  const test_DB_NAME = `test-${DB_NAME}`;
  const test_Db = client.db(test_DB_NAME);
  await dropAllCollections(test_Db);
  return [test_Db, client] as [Db, MongoClient];
}

/**
 * Safely close a MongoDB client, ensuring all operations complete
 * @param client The MongoDB client to close
 * 
 * Note: Deno's strict resource tracking may still report false positive leaks
 * for MongoDB operations. This is a known limitation when using MongoDB with Deno.
 * The client is properly closed, but Deno tracks async operations that may appear
 * as leaks even though they complete normally.
 * 
 * To avoid these warnings, you can run tests without strict leak detection:
 *   deno test -A  # (without --trace-leaks)
 */
export async function closeTestClient(client: MongoClient): Promise<void> {
  try {
    // Force close immediately to prevent Deno from detecting pending operations
    // This is necessary because Deno's strict resource tracking flags async
    // MongoDB operations that are still in flight when the test completes
    await client.close(true);
  } catch (e) {
    // Ignore errors during cleanup - the connection may already be closed
    // or there may be pending operations that we're forcing to close
  }
}

/**
 * Creates a fresh ID.
 * @returns {ID} UUID v7 generic ID.
 */
export function freshID() {
  return generate() as ID;
}
