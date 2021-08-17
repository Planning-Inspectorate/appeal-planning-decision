const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');
const parentLogger = require('./logger');
const config = require('../config');

async function createMagicLink(payload) {
  const correlationId = uuid.v4();
  const url = `${config.auth.magiclinkApiUrl}`;

  const method = 'POST';
  const logger = parentLogger.child({
    correlationId,
    service: 'Magic Link API',
  });

  try {
    logger.debug({ url, method }, 'New call');

    return await utils.promiseTimeout(
      config.appeals.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-ID': correlationId,
          },
          body: JSON.stringify(payload),
        });

        logger.debug('Magic link create request successfully called');

        const data = await apiResponse.json();
        logger.debug('Magic link create response parsed to JSON');
        if (data.errors) {
          throw new Error(`Magic link request error. ${JSON.stringify(data)}`);
        }

        return data;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Magic link create request failed.');
    throw err;
  }
}

module.exports = { createMagicLink };
