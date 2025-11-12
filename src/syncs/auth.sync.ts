import { actions, Sync } from "@engine";
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
 * @sync UserLogoutResponse
 * @description Responds to the logout request after session deletion.
 */
export const UserLogoutResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Sessioning/delete" }, { request }],
    [Sessioning.delete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});
