const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

async function handler(path, method = 'GET', opts = {}, headers = {}) {
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
            'Content-Type': 'application/json',
            'X-Correlation-ID': correlationId,
            ...headers,
          },
          ...opts,
        });

        if (!apiResponse.ok) {
          logger.debug(apiResponse, 'API Response not OK');
          try {
            const errorResponse = await apiResponse.json();
            /* istanbul ignore else */
            if (errorResponse.errors && errorResponse.errors.length) {
              throw new Error(errorResponse.errors.join('\n'));
            }

            /* istanbul ignore next */
            throw new Error(apiResponse.statusText);
          } catch (e) {
            throw new Error(e.message);
          }
        }

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
 * A single wrapper around creating, or updating a new or existing appeal through the Reply
 * Service API.
 *
 * @param reply
 * @returns {Promise<*>}
 */
exports.createOrUpdateAppealReply = (appealReply) => {
  let appealReplyServiceApiUrl = '/api/v1/reply';
  let method = 'POST';

  if (appealReply.id && appealReply.id !== '') {
    appealReplyServiceApiUrl += `/${appealReply.id}`;
    method = 'PUT';
  }

  return handler(appealReplyServiceApiUrl, method, {
    body: JSON.stringify(appealReply),
  });
};

/**
 * Gets an existing appeal reply by it's ID
 * @param {*} replyId appeal reply ID
 * @returns get request to to reply API
 */
exports.getExistingAppealReply = async (replyId) => {
  return handler(`/api/v1/reply/${replyId}`);
};

/**
 * Gets an existing appeal reply by the appeal id associated with it
 * @param {*} appealId appeal ID
 * @returns get request to reply API
 */
exports.getAppealReplyByAppeal = async (appealId) => {
  return handler(`/api/v1/reply/appeal/${appealId}`);
};
