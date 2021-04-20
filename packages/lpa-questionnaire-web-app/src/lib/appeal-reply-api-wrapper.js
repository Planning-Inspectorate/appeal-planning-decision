const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

const appealReplyServiceApiUrl = '/api/v1/reply';

async function handler(path, method, opts = {}, headers = {}) {
  const correlationId = uuid.v4();
  const url = `${config.appealReply.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Reply Service API',
  });

  try {
    logger.debug({ url, method, opts, headers }, 'New call');

    return await utils.promiseTimeout(
      config.appealReply.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
            'X-Correlation-ID': correlationId,
            ...headers,
            'Content-Type': 'application/json',
          },
          ...opts,
        });

        if (!apiResponse.ok) {
          logger.error(apiResponse, 'API Response not OK');
          if (apiResponse.status === 404) {
            return null;
          }
          throw new Error('something went wrong');
        }

        logger.debug('Successfully called');

        const data = await apiResponse.json();

        logger.debug('Successfully parsed to JSON');

        return data.reply;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
}

exports.updateAppealReply = (appealReply) => {
  const logger = parentLogger.child({
    service: 'Reply Service API',
  });

  if (appealReply.appealId && appealReply.appealId !== '') {
    return handler(`${appealReplyServiceApiUrl}/${appealReply.appealId}`, 'PUT', {
      body: JSON.stringify(appealReply),
    });
  }
  logger.error(
    `updateAppealReply; provided appealReply does't have an appealId.. ${JSON.stringify(
      appealReply
    )}`
  );
  throw new Error('something went wrong');
};

exports.createAppealReply = async () => {
  return handler(`${appealReplyServiceApiUrl}`, 'POST', {
    body: { appealId: uuid.v4() },
  });
};

exports.getExistingAppealReply = async (id) => {
  return handler(`/api/v1/reply/${id}`, 'GET');
};
