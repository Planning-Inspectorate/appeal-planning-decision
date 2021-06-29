const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');

async function handler(path, method = 'GET', opts = {}, headers = {}) {
  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Documents Service API',
  });

  try {
    logger.debug({ url, method, opts, headers }, 'New call');

    return await utils.promiseTimeout(
      config.appeals.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
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

        return apiResponse;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
}

function isDataBuffer(data) {
  return data !== null && data !== undefined && typeof data === 'object';
}

function isTheFormDataBuffer(data) {
  return isDataBuffer(data) && data.tempFilePath;
}

exports.createDocument = async (appeal, data, fileName) => {
  const path = `/api/v1/${appeal.id}`;

  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Document Service API',
  });

  let apiResponse;
  try {
    const fd = new FormData();

    if (isTheFormDataBuffer(data)) {
      const documentName = fileName || data.name;
      fd.append('file', fs.createReadStream(data.tempFilePath), documentName);
    } else if (isDataBuffer(data)) {
      fd.append('file', data, fileName);
    } else {
      throw new Error('The type of provided data to create a document with is wrong');
    }

    apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Correlation-ID': correlationId,
      },
      body: fd,
    });
  } catch (e) {
    logger.error(e);
    throw new Error(e.toString());
  }

  if (!apiResponse.ok) {
    logger.debug(apiResponse, 'Documents API Response not OK');
    throw new Error(apiResponse.statusText);
  }

  const ok = (await apiResponse.status) === 202;

  if (!ok) {
    throw new Error(apiResponse.statusText);
  }

  const response = await apiResponse.json();

  if (!response.id) {
    const msg = 'Document had no ID';
    logger.warn({ response }, msg);
    throw new Error(msg);
  }

  return response;
};

exports.getDocument = async (appealId, documentId) => {
  return handler(`/api/v1/${appealId}/${documentId}/file`);
};
