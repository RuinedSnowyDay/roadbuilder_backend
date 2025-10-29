import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "ResourceList" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Resource = ID;

// Internal entity types, represented as IDs
type ResourceList = ID;
type IndexedResource = ID;

/**
 * State: A set of ResourceLists with title String, owner User, and length Number.
 */
interface ResourceListDoc {
  _id: ResourceList;
  owner: User;
  title: string;
  length: number;
}

/**
 * State: A set of IndexedResources with resource Resource, title String, list ResourceList, and index Number.
 */
interface IndexedResourceDoc {
  _id: IndexedResource;
  resource: Resource;
  title: string;
  list: ResourceList;
  index: number;
}

/**
 * @concept ResourceList
 * @purpose store resources in an ordered manner
 */
export default class ResourceListConcept {
  resourceLists: Collection<ResourceListDoc>;
  indexedResources: Collection<IndexedResourceDoc>;

  constructor(private readonly db: Db) {
    this.resourceLists = this.db.collection(PREFIX + "resourceLists");
    this.indexedResources = this.db.collection(PREFIX + "indexedResources");
  }

  /**
   * Action: Creates a new resource list.
   * @requires There are no ResourceLists with the same owner User and listTitle String in the set of ResourceLists.
   * @effects Adds new ResourceList with provided owner and listTitle, with length set to 0. Returns the new ResourceList.
   */
  async createResourceList(
    { owner, listTitle }: { owner: User; listTitle: string },
  ): Promise<{ newResourceList: ResourceList } | { error: string }> {
    // Check for duplicate list
    const existing = await this.resourceLists.findOne({
      owner,
      title: listTitle,
    });
    if (existing) {
      return { error: "A list with this title already exists for this user" };
    }

    const listId = freshID();
    await this.resourceLists.insertOne({
      _id: listId as ResourceList,
      owner,
      title: listTitle,
      length: 0,
    });

    return { newResourceList: listId as ResourceList };
  }

  /**
   * Action: Accesses a resource list by owner and title.
   * @requires There is a ResourceList with the same owner User and listTitle title String in the set of ResourceLists.
   * @effects Returns the ResourceList that has the same owner User and listTitle title String.
   */
  async accessResourceList(
    { owner, listTitle }: { owner: User; listTitle: string },
  ): Promise<{ accessedResourceList: ResourceList } | { error: string }> {
    const list = await this.resourceLists.findOne({ owner, title: listTitle });
    if (!list) {
      return { error: "No resource list found with this owner and title" };
    }

    return { accessedResourceList: list._id };
  }

  /**
   * Action: Renames a resource list.
   * @requires ResourceList is in the set of ResourceLists.
   * @effects Sets the title of provided resourceList to newTitle.
   */
  async renameResourceList(
    { resourceList, newTitle }: {
      resourceList: ResourceList;
      newTitle: string;
    },
  ): Promise<Empty | { error: string }> {
    const result = await this.resourceLists.updateOne(
      { _id: resourceList },
      { $set: { title: newTitle } },
    );

    if (result.matchedCount === 0) {
      return { error: "Resource list not found" };
    }

    return {};
  }

  /**
   * Action: Appends a resource to a list.
   * @requires ResourceList is in the set of ResourceLists.
   * @effects Adds a new IndexedResource with the provided resource, resourceTitle, and index set to the length of the ResourceList. Increments the length of the ResourceList by 1.
   */
  async appendResource(
    { resourceList, resource, resourceTitle }: {
      resourceList: ResourceList;
      resource: Resource;
      resourceTitle: string;
    },
  ): Promise<{ newIndexedResource: IndexedResource } | { error: string }> {
    // Check list exists
    const list = await this.resourceLists.findOne({ _id: resourceList });
    if (!list) {
      return { error: "Resource list not found" };
    }

    const index = list.length;
    const indexedResourceId = freshID();
    await this.indexedResources.insertOne({
      _id: indexedResourceId as IndexedResource,
      resource,
      title: resourceTitle,
      list: resourceList,
      index,
    });

    // Increment the list length
    await this.resourceLists.updateOne(
      { _id: resourceList },
      { $inc: { length: 1 } },
    );

    return { newIndexedResource: indexedResourceId as IndexedResource };
  }

  /**
   * Action: Accesses a resource at a specific index.
   * @requires ResourceList is in the set of ResourceLists, index is a non-negative integer less than the length of the ResourceList.
   * @effects Returns the IndexedResource at the provided index in the ResourceList.
   */
  async accessResource(
    { resourceList, index }: { resourceList: ResourceList; index: number },
  ): Promise<{ accessedIndexedResource: IndexedResource } | { error: string }> {
    const list = await this.resourceLists.findOne({ _id: resourceList });
    if (!list) {
      return { error: "Resource list not found" };
    }

    if (index < 0 || index >= list.length) {
      return { error: "Index out of bounds" };
    }

    const indexedResource = await this.indexedResources.findOne({
      list: resourceList,
      index,
    });
    if (!indexedResource) {
      return { error: "Indexed resource not found at this index" };
    }

    return { accessedIndexedResource: indexedResource._id };
  }

  /**
   * Action: Deletes a resource at a specific index.
   * @requires ResourceList is in the set of ResourceLists, index is a non-negative integer less than the length of the ResourceList.
   * @effects Removes the IndexedResource at the provided index from the set of IndexedResources. Decrements the length of the ResourceList by 1. Decrements indices of all IndexedResources with list being provided resourceList and index greater than provided index by 1.
   */
  async deleteResource(
    { resourceList, index }: { resourceList: ResourceList; index: number },
  ): Promise<Empty | { error: string }> {
    const list = await this.resourceLists.findOne({ _id: resourceList });
    if (!list) {
      return { error: "Resource list not found" };
    }

    if (index < 0 || index >= list.length) {
      return { error: "Index out of bounds" };
    }

    // Delete the resource at the index
    await this.indexedResources.deleteOne({
      list: resourceList,
      index,
    });

    // Decrement the indices of all resources after the deleted one
    await this.indexedResources.updateMany(
      {
        list: resourceList,
        index: { $gt: index },
      },
      { $inc: { index: -1 } },
    );

    // Decrement the list length
    await this.resourceLists.updateOne(
      { _id: resourceList },
      { $inc: { length: -1 } },
    );

    return {};
  }

  /**
   * Action: Swaps two resources in a list.
   * @requires ResourceList is in the set of ResourceLists, index1 and index2 are non-negative integers less than the length of the ResourceList.
   * @effects Swaps the IndexedResources at the provided indices in the ResourceList.
   */
  async swapResources(
    { resourceList, index1, index2 }: {
      resourceList: ResourceList;
      index1: number;
      index2: number;
    },
  ): Promise<Empty | { error: string }> {
    const list = await this.resourceLists.findOne({ _id: resourceList });
    if (!list) {
      return { error: "Resource list not found" };
    }

    if (
      index1 < 0 || index1 >= list.length || index2 < 0 ||
      index2 >= list.length
    ) {
      return { error: "Index out of bounds" };
    }

    // Get both resources
    const resource1 = await this.indexedResources.findOne({
      list: resourceList,
      index: index1,
    });
    const resource2 = await this.indexedResources.findOne({
      list: resourceList,
      index: index2,
    });

    if (!resource1 || !resource2) {
      return { error: "One or both resources not found" };
    }

    // Swap the indices
    await this.indexedResources.updateOne(
      { _id: resource1._id },
      { $set: { index: index2 } },
    );
    await this.indexedResources.updateOne(
      { _id: resource2._id },
      { $set: { index: index1 } },
    );

    return {};
  }

  /**
   * Action: Deletes a resource list.
   * @requires ResourceList is in the set of ResourceLists.
   * @effects Removes the ResourceList from the set of ResourceLists. Also removes all IndexedResources associated with the ResourceList from the set of IndexedResources.
   */
  async deleteResourceList(
    { resourceList }: { resourceList: ResourceList },
  ): Promise<Empty | { error: string }> {
    const existingList = await this.resourceLists.findOne({
      _id: resourceList,
    });
    if (!existingList) {
      return { error: "Resource list not found" };
    }

    // Remove all indexed resources associated with this list
    await this.indexedResources.deleteMany({ list: resourceList });

    // Remove the list
    await this.resourceLists.deleteOne({ _id: resourceList });

    return {};
  }

  /**
   * Action: Renames an indexed resource.
   * @requires IndexedResource is in the set of IndexedResources.
   * @effects Sets the title of provided indexedResource to newTitle.
   */
  async renameIndexedResource(
    { indexedResource, newTitle }: {
      indexedResource: IndexedResource;
      newTitle: string;
    },
  ): Promise<Empty | { error: string }> {
    const result = await this.indexedResources.updateOne(
      { _id: indexedResource },
      { $set: { title: newTitle } },
    );

    if (result.matchedCount === 0) {
      return { error: "Indexed resource not found" };
    }

    return {};
  }

  /**
   * Query: Retrieves all resources in a list.
   */
  async _getListResources(
    { resourceList }: { resourceList: ResourceList },
  ): Promise<IndexedResourceDoc[]> {
    return await this.indexedResources
      .find({ list: resourceList })
      .sort({ index: 1 })
      .toArray();
  }

  /**
   * Query: Retrieves a resource list by owner and title.
   */
  async _getResourceList(
    { owner, listTitle }: { owner: User; listTitle: string },
  ): Promise<ResourceListDoc | null> {
    return await this.resourceLists.findOne({ owner, title: listTitle });
  }

  /**
   * Query: Retrieves all resource lists for a user.
   */
  async _getUserResourceLists(
    { owner }: { owner: User },
  ): Promise<ResourceListDoc[]> {
    return await this.resourceLists.find({ owner }).toArray();
  }
}
