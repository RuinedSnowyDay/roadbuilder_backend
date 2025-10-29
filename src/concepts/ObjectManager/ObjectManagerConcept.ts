import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "ObjectManager" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Object = ID;

// Internal entity types, represented as IDs
type AssignedObject = ID;

/**
 * State: A set of AssignedObjects with owner User, object Object, title String, and description String.
 */
interface AssignedObjectDoc {
  _id: AssignedObject;
  owner: User;
  object: Object;
  title: string;
  description: string;
}

/**
 * @concept ObjectManager
 * @purpose manage the creation, deletion, and modification of named and described objects for a given user
 */
export default class ObjectManagerConcept {
  assignedObjects: Collection<AssignedObjectDoc>;

  constructor(private readonly db: Db) {
    this.assignedObjects = this.db.collection(PREFIX + "assignedObjects");
  }

  /**
   * Action: Creates a new assigned object for a user.
   * @requires There are no AssignedObjects with the same object, and also with the same owner User and title String at the same time.
   * @effects A new AssignedObject is created with provided owner, object, title, and description. Returns the new AssignedObject.
   */
  async createAssignedObject(
    { owner, object, title, description }: {
      owner: User;
      object: Object;
      title: string;
      description: string;
    },
  ): Promise<{ assignedObject: AssignedObject } | { error: string }> {
    // Check invariant: no AssignedObjects with the same Object
    const existingByObject = await this.assignedObjects.findOne({ object });
    if (existingByObject) {
      return { error: "Object has already been assigned to another user" };
    }

    // Check invariant: no AssignedObjects with the same owner and title
    const existingByOwnerAndTitle = await this.assignedObjects.findOne({
      owner,
      title,
    });
    if (existingByOwnerAndTitle) {
      return {
        error: "User already has an assigned object with this title",
      };
    }

    const assignedObjectId = freshID();
    await this.assignedObjects.insertOne({
      _id: assignedObjectId as AssignedObject,
      owner,
      object,
      title,
      description,
    });

    return { assignedObject: assignedObjectId as AssignedObject };
  }

  /**
   * Action: Accesses the object associated with a given owner and title.
   * @requires There is an AssignedObject with provided owner and title.
   * @effects Returns the Object associated with given user and title.
   */
  async accessObject(
    { owner, title }: { owner: User; title: string },
  ): Promise<{ object: Object } | { error: string }> {
    const assignedObject = await this.assignedObjects.findOne({ owner, title });
    if (!assignedObject) {
      return { error: "No assigned object found with this owner and title" };
    }

    return { object: assignedObject.object };
  }

  /**
   * Action: Deletes an assigned object.
   * @requires There is an AssignedObject with provided owner and title.
   * @effects Removes the AssignedObject associated with input owner and title from the set of AssignedObjects.
   */
  async deleteAssignedObject(
    { owner, title }: { owner: User; title: string },
  ): Promise<Empty | { error: string }> {
    const result = await this.assignedObjects.deleteOne({ owner, title });
    if (result.deletedCount === 0) {
      return {
        error: "No assigned object found with this owner and title to delete",
      };
    }

    return {};
  }

  /**
   * Action: Changes the title of an assigned object.
   * @requires There is an AssignedObject with provided owner and oldTitle, and there are no AssignedObjects with the owner and newTitle.
   * @effects Changes the title of the AssignedObject associated with input owner and oldTitle to newTitle.
   */
  async changeAssignedObjectTitle(
    { owner, oldTitle, newTitle }: {
      owner: User;
      oldTitle: string;
      newTitle: string;
    },
  ): Promise<Empty | { error: string }> {
    // Check if the AssignedObject with oldTitle exists
    const existingOld = await this.assignedObjects.findOne({
      owner,
      title: oldTitle,
    });
    if (!existingOld) {
      return {
        error: "No assigned object found with this owner and old title",
      };
    }

    // Check if there's already an AssignedObject with newTitle (different from the old one being changed)
    const existingNew = await this.assignedObjects.findOne({
      owner,
      title: newTitle,
    });
    if (existingNew) {
      return {
        error: "User already has an assigned object with this new title",
      };
    }

    await this.assignedObjects.updateOne(
      { owner, title: oldTitle },
      { $set: { title: newTitle } },
    );

    return {};
  }

  /**
   * Action: Changes the description of an assigned object.
   * @requires There is an AssignedObject with provided owner and title.
   * @effects Changes the description of the AssignedObject associated with input owner and title to newDescription.
   */
  async changeAssignedObjectDescription(
    { owner, title, newDescription }: {
      owner: User;
      title: string;
      newDescription: string;
    },
  ): Promise<Empty | { error: string }> {
    const result = await this.assignedObjects.updateOne(
      { owner, title },
      { $set: { description: newDescription } },
    );

    if (result.matchedCount === 0) {
      return {
        error: "No assigned object found with this owner and title to update",
      };
    }

    return {};
  }

  /**
   * Action: Suggests a title based on the user's existing assigned objects.
   * @async
   * @requires There is at least one AssignedObject associated with input owner.
   * @effects Returns a title String suggested by AI based on titles of AssignedObjects associated with provided owner.
   */
  async suggestTitle(
    { owner }: { owner: User },
  ): Promise<{ titleSuggestion: string } | { error: string }> {
    const assignedObjects = await this.assignedObjects
      .find({ owner })
      .limit(10)
      .toArray();

    if (assignedObjects.length === 0) {
      return {
        error: "No assigned objects found for this user to suggest a title",
      };
    }

    // Simple AI suggestion: return a generic title with a number
    // In a real implementation, this might use an AI service
    const count = await this.assignedObjects.countDocuments({ owner });
    const titleSuggestion = `My Object ${count + 1}`;

    return { titleSuggestion };
  }

  /**
   * Query: Retrieves all assigned objects for a given user.
   */
  async _getUserAssignedObjects(
    { owner }: { owner: User },
  ): Promise<AssignedObjectDoc[]> {
    return await this.assignedObjects.find({ owner }).toArray();
  }

  /**
   * Query: Retrieves all assigned objects for a given object.
   */
  async _getObjectAssignments(
    { object }: { object: Object },
  ): Promise<AssignedObjectDoc[]> {
    return await this.assignedObjects.find({ object }).toArray();
  }

  /**
   * Query: Retrieves an assigned object by owner and title.
   */
  async _getAssignedObject(
    { owner, title }: { owner: User; title: string },
  ): Promise<AssignedObjectDoc | null> {
    return await this.assignedObjects.findOne({ owner, title });
  }
}
