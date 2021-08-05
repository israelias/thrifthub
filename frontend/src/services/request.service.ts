/**
 * Functions that pre-packages HTTP requests for a fetcher/handler.
 *
 * Requests are sorted per method for requests like signupRequest and loginRequest to send to the backend efficiently.
 *
 * @see signupRequest
 * @see loginRequest
 * @see LogoutRequest
 * @see putRequest
 * @see getRequest
 */

/**
 * Api backend base URL.
 */

import { API } from '../constants/backend.constants';

export const RequestTicket = ({
  method,
  access,
  refresh,
  url,
  body,
}: {
  method: string;
  access?: AccessToken['accessToken'];
  refresh?: string;
  url: string;
  body?: object;
}) => {
  if (method === 'post') {
    if (access) {
      return new Request(`${API}/${url}/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access ? `Bearer ${access}` : '',
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : null,
      });
    }
    return new Request(`${API}/${url}/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  if (method === 'put') {
    return new Request(`${API}/${url}/`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });
  }

  if (method === 'delete') {
    return new Request(`${API}/${url}/`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });
  }
  return new Request(`${API}/${url}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: access ? `Bearer ${access}` : '',
    },
  });
};

export const FormDataRequest = ({
  method,
  access,
  refresh,
  url,
  body,
}: {
  method: string;
  access?: AccessToken['accessToken'];
  refresh?: string;
  url: string;
  body?: FormData;
}) => {
  if (method === 'post') {
    if (access) {
      return new Request(`${API}/${url}/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: access ? `Bearer ${access}` : '',
        },
        credentials: 'include',
        body: body,
      });
    }
    return new Request(`${API}/${url}/`, {
      method: 'POST',
      credentials: 'include',
      // headers: { 'Content-Type': 'application/json' },
      body: body,
    });
  }

  if (method === 'put') {
    return new Request(`${API}/${url}/`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: body,
    });
  }

  if (method === 'delete') {
    return new Request(`${API}/${url}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
    });
  }
  return new Request(`${API}/${url}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: access ? `Bearer ${access}` : '',
    },
  });
};
