---
timestamp: 'Mon Nov 03 2025 12:48:48 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251103_124848.5be3ec28.md]]'
content_id: e37eb2482f2461aef11584dc8ba8bc0d7529e936ce4be12ca069b29c14adeb42
---

# Concept: ObjectChecker

* **concept** ObjectChecker\[User, Object]
* **purpose** track user-specific markings on objects
* **principle** users can independently mark objects of interest and later check or
  remove their markings. Each user's markings are independent, meaning multiple users
  can mark the same object without affecting each other's state.
* **state**
  * a set of Checks with
    * a user User
    * an object Object
    * a checked Boolean
* **actions**
  * createCheck(user: User, object: Object) : (newCheck: Check)
    * **requires** there is no Check with the same user and object in the set of
      Checks
    * **effects** adds a new Check with provided user, object, checked set to false.
  * markObject(check: Check)
    * **requires** check is in the set of Checks
    * **effects** updates the checked field of the provided check to true
  * unmarkObject(check: Check)
    * **requires** check is in the set of Checks
    * **effects** updates the checked field of the provided check to false
  * deleteCheck(check: Check)
    * **requires** check is in the set of Checks
    * **effects** removes the provided check from the set of Checks
