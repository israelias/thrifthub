import { FormDataRequest } from './request.service';

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
export function deleteFormData({
  url,
  accessToken,
  body,
}: {
  accessToken: AccessToken['accessToken'];
  url: string;
  body?: FormData;
}) {
  const request = FormDataRequest({
    method: 'delete',
    url,
    access: accessToken,
    body,
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
export function putFormData({
  url,
  accessToken,
  body,
}: {
  accessToken: AccessToken['accessToken'];
  url: string;
  body: FormData;
}) {
  const request = FormDataRequest({
    method: 'put',
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
export function postFormData({
  url,
  accessToken,
  refreshToken,
  body,
}: {
  accessToken: AccessToken['accessToken'];
  refreshToken?: string;
  url: string;
  body: FormData;
}) {
  const request = FormDataRequest({
    method: 'post',
    url,
    access: accessToken,
    refresh: refreshToken || '',
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
  const request = FormDataRequest({
    method: 'get',
    url,
  });
  return fetch(request).then((res) => res.json());
}
