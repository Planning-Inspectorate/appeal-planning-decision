const fetch = require('node-fetch');
const config = require('../config');

/**
 * A single wrapper around creating, or updating a new or existing appeal through the Appeals
 * Service API.
 *
 * @param body
 * @param uuid
 * @returns {Promise<*>}
 */
exports.appealsApi = (body, uuid) => {
  let appealsServiceApiUrl = `${config.APPEALS_SERVICE_API_URL}/appeals`;
  let method = 'POST';

  if (uuid) {
    appealsServiceApiUrl = `${appealsServiceApiUrl}/${uuid}`;
    method = 'PUT';
  }

  return fetch(appealsServiceApiUrl, {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }).then((apiResponse) => apiResponse.json());
};
