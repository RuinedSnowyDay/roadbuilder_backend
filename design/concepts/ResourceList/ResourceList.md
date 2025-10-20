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
  + a set of IndexedResources with
    + a resource Resource
    + a title String
    + a list ResourceList
    + an index Number