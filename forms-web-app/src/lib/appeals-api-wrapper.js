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
exports.createOrUpdateAppeal = (appeal) => {
  let appealsServiceApiUrl = `${config.appeals.url}/appeals`;
  let method = 'POST';

  if (appeal.uuid && appeal.uuid !== '') {
    appealsServiceApiUrl = `${appealsServiceApiUrl}/${appeal.uuid}`;
    method = 'PUT';
  }

  return fetch(appealsServiceApiUrl, {
    method,
    body: JSON.stringify(appeal),
    headers: { 'Content-Type': 'application/json' },
  }).then((apiResponse) => apiResponse.json());
};

exports.getLPAList = async () => {
  const apiResponse = await fetch(`${config.appeals.url}/local-planning-authorities`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return apiResponse.json();
};
