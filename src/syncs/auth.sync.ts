import { actions, Frames, Sync } from "@engine";
import { Requesting, Sessioning, UserAuthentication } from "@concepts";

/**
 * @sync UserRegistrationRequest
 * @description Triggers user registration when a request is made.
 */
export const UserRegistrationRequest: Sync = (
  { request, username, password },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuthentication/register", username, password },
    { request },
  ]),
  then: actions([
    UserAuthentication.register,
    { username, password },
  ]),
});

/**
 * @sync UserRegistrationSuccessResponse
 * @description Responds to the registration request with the new user's ID on success.
 */
export const UserRegistrationSuccessResponse: Sync = ({ request, user }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/register" }, { request }],
    [UserAuthentication.register, {}, { user }],
  ),
  then: actions([Requesting.respond, { request, user }]),
});

/**
 * @sync UserRegistrationErrorResponse
 * @description Responds to the registration request with an error if registration fails.
 */
export const UserRegistrationErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/register" }, { request }],
    [UserAuthentication.register, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * @sync UserLoginRequest
 * @description Triggers user login when a request is made.
 */
export const UserLoginRequest: Sync = ({ request, username, password }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuthentication/login", username, password },
    { request },
  ]),
  then: actions([UserAuthentication.login, { username, password }]),
});

/**
 * @sync UserLoginSuccess
 * @description When login is successful, create a new session for the user.
 */
export const UserLoginSuccess: Sync = ({ user }) => ({
  when: actions(
    [UserAuthentication.login, {}, { user }],
  ),
  then: actions(
    [Sessioning.create, { user }],
  ),
});

/**
 * @sync UserLoginResponse
 * @description Responds to the original login request with the new session ID after a successful login and session creation.
 */
export const UserLoginResponse: Sync = ({ request, session }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    // Note: We wait for Sessioning.create, which was triggered by a successful login
    [Sessioning.create, {}, { session }],
  ),
  then: actions([Requesting.respond, { request, session }]),
});

/**
 * @sync UserLoginErrorResponse
 * @description Responds to the login request with an error if login fails.
 */
export const UserLoginErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/login" }, { request }],
    [UserAuthentication.login, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * @sync UserLogoutRequest
 * @description Triggers session deletion when a logout request is made.
 */
export const UserLogoutRequest: Sync = ({ request, session }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/delete", session },
    { request },
  ]),
  then: actions([Sessioning.delete, { session }]),
});

/**
 * @sync UserLogoutSuccessResponse
 * @description Responds to the logout request after successful session deletion.
 */
export const UserLogoutSuccessResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Sessioning/delete" }, { request }],
    [Sessioning.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

/**
 * @sync UserLogoutErrorResponse
 * @description Responds to the logout request with an error if session deletion fails.
 */
export const UserLogoutErrorResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Sessioning/delete" }, { request }],
    [Sessioning.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

// --- Get User (Query) ---

/**
 * @sync GetUserSuccessRequest
 * @description Handles HTTP requests to get the user associated with a session (success case).
 * This query is used internally by other syncs for authentication, but can also
 * be called directly via HTTP to verify a session is valid.
 */
export const GetUserSuccessRequest: Sync = ({ request, session, user, results }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/_getUser", session },
    { request },
  ]),
  where: async (frames) => {
    // Query the Sessioning concept to get the user for this session
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user,
    });

    // If we got frames with user, wrap in results array
    if (userFrames.length > 0) {
      return userFrames.collectAs([user], results);
    }

    // Otherwise, return empty frames (this sync won't fire)
    return new Frames();
  },
  then: actions([
    Requesting.respond,
    { request, results },
  ]),
});

/**
 * @sync GetUserErrorRequest
 * @description Handles HTTP requests to get the user associated with a session (error case).
 * This fires when the session doesn't exist.
 */
export const GetUserErrorRequest: Sync = ({ request, session, error, results }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/_getUser", session },
    { request },
  ]),
  where: async (frames) => {
    // First check if we can get a user (success case)
    const tempUser = Symbol("temp_user");
    const userFrames = await frames.query(Sessioning._getUser, { session }, {
      user: tempUser,
    });

    // If we found a user, this is not an error case - return empty frames
    if (userFrames.length > 0) {
      return new Frames();
    }

    // No user found, so try to get the error
    const errorFrames = await frames.query(Sessioning._getUser, { session }, {
      error,
    });

    // If we got frames with error, wrap in results array
    if (errorFrames.length > 0) {
      return errorFrames.collectAs([error], results);
    }

    // Otherwise, return empty frames (this sync won't fire)
    return new Frames();
  },
  then: actions([
    Requesting.respond,
    { request, results },
  ]),
});
