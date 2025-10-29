# Concept: ObjectChecker

+ **concept** ObjectChecker[User, Object]
+ **purpose** track user-specific markings on objects
+ **principle** users can independently mark objects of interest and later check or
remove their markings. Each user's markings are independent, meaning multiple users
can mark the same object without affecting each other's state.
+ **state**
  + a set of Checks with
    + a user User
    + an object Object
    + a checked Boolean
+ **actions**
  + createCheck(user: User, object: Object) : (newCheck: Check)
    + **requires** there is no Check with the same user and object in the set of Checks
    + **effects** adds a new Check with provided user, object, checked set to false.
  + markObject(check: Check)
    + **requires** check is in the set of Checks
    + **effects** updates the checked field of the provided check to true
  + unmarkObject(check: Check)
    + **requires** check is in the set of Checks
    + **effects** updates the checked field of the provided check to false
  + deleteCheck(check: Check)
    + **requires** check is in the set of Checks
    + **effects** removes the provided check from the set of Checks
