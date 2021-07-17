import { RequestTicket } from "./request.service";
/**
 * Sign up request handler.
 *
 * @see RequestTicket
 * @param  {object} body body of sign up request
 * @return {Promise} handles user's authentication passport once fulfilled
 */
export function signUpRequest({
  body,
}: {
  body: {
    username: string;
    email: string;
    password: string;
  };
}) {
  const request = RequestTicket({
    method: "post",
    url: "account/register",
    body: {
      username: body.username,
      email: body.email,
      password: body.password,
    },
  });
  return fetch(request);
}

/**
 * Sign in request handler.
 *
 * @see RequestTicket
 * @param  {object} body body of sign up request
 * @return {Promise} handles user's authentication passport once fulfilled
 */
export function signInRequest({
  body,
}: {
  body: {
    username: string;
    password: string;
  };
}) {
  const request = RequestTicket({
    method: "post",
    url: "account/login",
    body: {
      username: body.username,
      password: body.password,
    },
  });
  return fetch(request);
}

/**
 * Sign out request handler.
 *
 * @see RequestTicket
 * @return {null} handles revoking of user's authentication passport without explicit return
 */
export function signOutRequest({ token }: { token: string }) {
  const request = RequestTicket({
    method: "post",
    url: "account/logout_all",
    access: token,
  });
  return fetch(request);
}
