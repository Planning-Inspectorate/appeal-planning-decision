const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

async function handler(path, method = 'GET', opts = {}, headers = {}) {
  const correlationId = uuid.v4();
  const url = `${config.appeals.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Appeals Service API',
  });

  try {
    logger.warn({ url, method, opts, headers }, 'New call');

    return await utils.promiseTimeout(
      config.appeals.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-ID': correlationId,
            ...headers,
          },
          ...opts,
        });

        logger.debug('Successfully called');

        const data = await apiResponse.json();

        logger.debug('Successfully parsed to JSON');

        return data;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
}

/**
 * A single wrapper around creating, or updating a new or existing appeal through the Appeals
 * Service API.
 *
 * @param appeal
 * @returns {Promise<*>}
 */
exports.createOrUpdateAppeal = (appeal) => {
  let appealsServiceApiUrl = '/appeals';
  let method = 'POST';

  if (appeal.uuid && appeal.uuid !== '') {
    appealsServiceApiUrl += `/${appeal.uuid}`;
    method = 'PUT';
  }

  return handler(appealsServiceApiUrl, method, {
    body: JSON.stringify(appeal),
  });
};

exports.getLPAList = async () => {
  return handler('/local-planning-authorities');
};
