import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "ObjectChecker" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Object = ID;

// Internal entity types, represented as IDs
type Check = ID;

/**
 * State: A set of Checks with user User, object Object, and checked Boolean.
 */
interface CheckDoc {
  _id: Check;
  user: User;
  object: Object;
  checked: boolean;
}

/**
 * @concept ObjectChecker
 * @purpose track user-specific markings on objects
 */
export default class ObjectCheckerConcept {
  checks: Collection<CheckDoc>;

  constructor(private readonly db: Db) {
    this.checks = this.db.collection(PREFIX + "checks");
  }

  /**
   * Action: Creates a new check for a user and object.
   * @requires There is no Check with the same user and object in the set of Checks
   * @effects Adds a new Check with provided user, object, checked set to false. Returns the new Check.
   */
  async createCheck(
    { user, object }: { user: User; object: Object },
  ): Promise<{ newCheck: Check } | { error: string }> {
    // Check if a check already exists for this user and object
    const existing = await this.checks.findOne({ user, object });
    if (existing) {
      return {
        error: "A check already exists for this user and object",
      };
    }

    const checkId = freshID();
    await this.checks.insertOne({
      _id: checkId as Check,
      user,
      object,
      checked: false,
    });

    return { newCheck: checkId as Check };
  }

  /**
   * Action: Marks a check as checked.
   * @requires check is in the set of Checks
   * @effects Updates the checked field of the provided check to true
   */
  async markObject(
    { check }: { check: Check },
  ): Promise<Empty | { error: string }> {
    const result = await this.checks.updateOne(
      { _id: check },
      { $set: { checked: true } },
    );

    if (result.matchedCount === 0) {
      return { error: "No check found with the provided check ID" };
    }

    return {};
  }

  /**
   * Action: Unmarks a check (sets checked to false).
   * @requires check is in the set of Checks
   * @effects Updates the checked field of the provided check to false
   */
  async unmarkObject(
    { check }: { check: Check },
  ): Promise<Empty | { error: string }> {
    const result = await this.checks.updateOne(
      { _id: check },
      { $set: { checked: false } },
    );

    if (result.matchedCount === 0) {
      return { error: "No check found with the provided check ID" };
    }

    return {};
  }

  /**
   * Action: Deletes a check.
   * @requires check is in the set of Checks
   * @effects Removes the provided check from the set of Checks
   */
  async deleteCheck(
    { check }: { check: Check },
  ): Promise<Empty | { error: string }> {
    const result = await this.checks.deleteOne({ _id: check });

    if (result.deletedCount === 0) {
      return { error: "No check found with the provided check ID to delete" };
    }

    return {};
  }

  /**
   * Query: Retrieves all checks for a given user.
   */
  async _getUserChecks({ user }: { user: User }): Promise<CheckDoc[]> {
    return await this.checks.find({ user }).toArray();
  }

  /**
   * Query: Retrieves all checks for a given object.
   */
  async _getObjectChecks({ object }: { object: Object }): Promise<CheckDoc[]> {
    return await this.checks.find({ object }).toArray();
  }

  /**
   * Query: Retrieves a check by user and object.
   */
  async _getCheck(
    { user, object }: { user: User; object: Object },
  ): Promise<{ doc: CheckDoc }[]> {
    const doc = await this.checks.findOne({ user, object });
    if (doc === null) {
      return [];
    }
    return [{ doc }];
  }
}
