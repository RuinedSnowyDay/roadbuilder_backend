# Concept: ObjectManager

+ **concept** ObjectManager[User, Object]
+ **purpose** manage the creation, deletion, and modification of named and described
  objects for a given user
+ **principle** given an object, a user can give it a name and description, becoming
  an owner of this object. The user that owns the object can later change its name
  and description, but not the object binding itself. User can also differentiate
  between the objects they use by their titles: for one user they should be unique.
+ **state**
  + a set of AssignedObjects with
    + an owner User
    + an object Object
    + a title String
    + a description String
+ **actions**
  + createAssignedObject(owner: User, object: Object, title: String, description:
    String): (assignedObject: AssignedObject)
    + **requires** there are no AssignedObjects with the same object Object as input
      object, and also with the same owner User and title String at the same time.
    + **effects** adds new AssignedObject with provided owner User, object, title,
      and description to the set of AssignedObjects. Returns the added AssignedObject.
  + accessObject(owner: User, title: String): (accessedObject: Object)
    + **requires** there is an AssignedObject with provided owner User and title
    + **effects** returns the Object associated with given user and title
  + deleteAssignedObject(owner: User, title: String)
    + **requires** there is an AssignedObject with provided owner User and title
    + **effects** removes the AssignedObject associated with input owner and title
      from the set of AssignedObjects.
  + changeAssignedObjectTitle(owner: User, oldTitle: String, newTitle: string)
    + **requires** there is an AssignedObject with provided owner User and oldTitle,
      there are no AssignedObjects with the owner User and newTitle.
    + **effects** changes the title of the AssignedObject associated with input owner
      and oldTitle to newTitle
  + changeAssignedObjectDescription(owner: User, title: String, newDescription:
    string)
    + **requires** there is an AssignedObject with provided owner User and title
    + **effects** changes the description of the AssignedObject associated with input
      owner and title to newDescription
  + *async* suggestTitle(owner: User): (titleSuggestion: String)
    + **requires** there is at least one AssignedObject associated with input owner
      User in the set of AssignedObjects
    + **effects** returns a title String suggested by ✨AI✨ based on titles of
      AssignedObjects associated with provided owner User
+ **Invariants**
  + There are no AssignedObjects with the same Object
  + There are no AssignedObjects with the same owner User and title String at the same
    time
  