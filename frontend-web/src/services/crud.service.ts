import { RequestTicket } from "./request.service";

/**
 * CRUD requests that return a prepared fetch. Promise is handled in context.
 *
 */

/**
 * Simple delete request with no body or redirects.
 *
 * @see RequestTicket
 * @see useUserContext
 * @param  {} url url string of backend resource
 * @param  {} accessToken access token stored in context memory for request Authorization header
 * @return {null} handles frontend rerouting once fulfilled without explicit return
 */
export function deleteRequest({
  url,
  accessToken,
}: {
  accessToken: string;
  url: string;
}) {
  const request = RequestTicket({
    method: "delete",
    url,
    access: accessToken,
  });
  return fetch(request);
}

/**
 * Put request.
 *
 * @see RequestTicket
 * @see useUserContext
 * @param  {} url url string of backend resource
 * @param  {} access access token stored in context memory for request Authorization header
 * @param  {} body put request body
 * @return {Promise} handles frontend rerouting once fulfilled
 */
export function putRequest({
  url,
  accessToken,
  body,
}: {
  accessToken: string;
  url: string;
  body: object;
}) {
  const request = RequestTicket({
    method: "put",
    url,
    access: accessToken,
    body,
  });
  return fetch(request);
}

/**
 * Post request handler (General).
 *
 * @see RequestTicket
 * @param  {} url url string of backend resource
 * @param  {} access access token stored in context memory for request Authorization header
 * @param  {} body body of post request
 * @return {null} handles frontend rerouting once fulfilled without explicit return
 */
export function postRequest({
  url,
  accessToken,
  refreshToken,
  body,
}: {
  accessToken: string;
  refreshToken?: string;
  url: string;
  body: object;
}) {
  const request = RequestTicket({
    method: "post",
    url,
    access: accessToken,
    refresh: refreshToken || "",
    body,
  });
  return fetch(request);
}

/**
 * Get request handler (General).
 *
 * @see RequestTicket
 * @see useUserContext
 * @param  {} url url string of backend resource
 * @param  {} token access token stored in context memory for request Authorization header
 * @return {Promise}
 */
export function getRequest({ url }: { url: string }) {
  const request = RequestTicket({
    method: "get",
    url,
  });
  return fetch(request).then((res) => res.json());
}
