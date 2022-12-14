import Config from 'react-native-config';

const BaseApiUrl = Config.BASE_API_URL;
const ApiToken = Config.API_TOKEN;

const FetchWrapper = {
  get,
  post,
  del,
  getStreamAsRequest,
  allSettled,
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + ApiToken,
  'x-ms-continuation': '',
};

const headersStream = {
  'Content-Type': 'application/octet-stream',
  Authorization: 'Bearer ' + ApiToken,
};

function get(url: String, continuationToken?: string) {
  headers['x-ms-continuation'] =
    continuationToken === undefined ? '' : continuationToken;
  const requestOptions = {
    method: 'GET',
    headers: headers,
  };
  return fetch(BaseApiUrl + url, requestOptions).then(handleResponse);
}

function post(url: String, body: Object) {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  };
  return fetch(BaseApiUrl + url, requestOptions).then(handleResponse);
}

function del(url: String) {
  const requestOptions = {
    method: 'DELETE',
    headers: headers,
  };
  return fetch(BaseApiUrl + url, requestOptions).then(handleResponse);
}

function getStreamAsRequest(url: String) {
  return {
    method: 'GET',
    headers: headersStream,
    uri: BaseApiUrl + url,
  };
}

function handleResponse(response: any) {
  if (!response.ok) {
    const error = {
      status: response.status,
      message: '[' + response.status + ']: ' + response.statusText,
    };
    return Promise.reject(error);
  }
  // may error if there is no body, return empty array
  return response.json().catch(() => ({}));
}

function allSettled(promises: any[]) {
  return Promise.all(
    promises.map(promise =>
      promise
        .then((value: any) => ({status: 'fulfilled', value}))
        .catch((reason: any) => ({status: 'rejected', reason}))
    )
  );
}

export default FetchWrapper;
