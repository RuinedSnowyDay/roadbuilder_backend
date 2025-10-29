# Concept: ResourceList

+ **concept** ResourceList[User, Resource]
+ **purpose** store resources in an ordered manner
+ **principle** users can create their named lists of resources. List in this context
  means that resources in one list can be distinguished by both title and index. They
  can later add, remove, or swap resources in their lists.
+ **state**
  + a set of ResourceLists with
    + a title String
    + an owner User
    + a length Number
  + a set of IndexedResources with
    + a resource Resource
    + a title String
    + a list ResourceList
    + an index Number
+ **actions**
  + createResourceList(owner: User, listTitle: String): (newResourceList:
    ResourceList)
    + **requires** there are no ResourceLists with the same owner User and listTitle
      title String in the set of ResouceLists
    + **effects** adds new ResourceList with provided owner User and listTitle title
      String, and with length set to 0 to the set of ResourceLists and returns this
      new ResourceList
  + accessResourceList(owner: User, listTitle: String): (accessedResouceList:
    ResourceList)
    + **requires** there is a ResourceList with the same owner User and listTitle
      title String in the set of ResourceLists
    + **effects** returns the ResourceList that has the same owner User and listTitle
      title String the set of ResourceLists and returns this new ResourceList
  + renameResourceList(resourceList: ResourceList)
    + **requires** resourceList is in the set of ResourceLists
    + **effects** renames the ResourceList to the new title String
  + appendResource(resourceList: ResourceList, resource: Resource, resourceTitle:
    String): (newIndexedResource: IndexedResource)
    + **requires** resourceList is in the set of ResourceLists
    + **effects** adds a new IndexedResource with the provided resource,
      resourceTitle, and index set to the length of the ResourceList to the set of
      IndexedResources and returns this new IndexedResource. Increments the length of
      the ResourceList by 1.
  + accessResource(resourceList: ResourceList, index: Number): (accessedIndexedResource:
    IndexedResource)
    + **requires** resourceList is in the set of ResourceLists, index is a non-negative
      integer less than the length of the ResourceList
    + **effects** returns the IndexedResource at the provided index in the ResourceList
  + deleteResource(resourceList: ResourceList, index: Number)
    + **requires** resourceList is in the set of ResourceLists, index is a non-negative
      integer less than the length of the ResourceList
    + **effects** removes the IndexedResource at the provided index from the set of
      IndexedResources. Decrements the length of the ResourceList by 1.
  + swapResources(resourceList: ResourceList, index1: Number, index2: Number)
    + **requires** resourceList is in the set of ResourceLists, index1 and index2 are
      non-negative integers less than the length of the ResourceList
    + **effects** swaps the IndexedResources at the provided indices in the ResourceList.
  + deleteResourceList(resourceList: ResourceList)
    + **requires** resourceList is in the set of ResourceLists
    + **effects** removes the ResourceList from the set of ResourceLists. Also removes all
      IndexedResources associated with the ResourceList from the set of IndexedResources.