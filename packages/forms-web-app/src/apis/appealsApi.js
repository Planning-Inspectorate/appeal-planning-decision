const axios = require('axios');
const uuid = require('uuid');
const config = require('../config');
const parentLogger = require('../lib/logger');

const send = async (method, params = {}) => {
  const correlationId = uuid.v4();
  const url = `${config.appeals.url}${params.url || ''}`;
  const headers = params.headers || {};
  const logger = parentLogger.child({
    correlationId,
    service: 'Appeals Service API',
  });

  try {
    logger.debug({ method, params }, 'New Appeals service request');

    const apiResponse = await axios.request({
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        ...headers,
      },
    });

    logger.debug('Api successfully responded with', apiResponse);

    return apiResponse.data;
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
};

const get = (params) => {
  return send('GET', params);
};

const destroy = (params) => {
  return send('DELETE', params);
};

const post = (params) => {
  return send('POST', params);
};

const put = (params) => {
  return send('PUT', params);
};

module.exports = {
  get,
  post,
  put,
  destroy,
};
