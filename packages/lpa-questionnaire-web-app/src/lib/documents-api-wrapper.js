const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');

const config = require('../config');
const parentLogger = require('./logger');

exports.createDocument = async (parentId, formData) => {
  const path = `/api/v1/${parentId}`;

  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Document Service API',
  });

  let apiResponse;
  try {
    const fd = new FormData();
    fd.append('file', fs.createReadStream(formData.tempFilePath), formData.name);

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

exports.deleteDocument = async (parentId, id) => {
  const path = `/api/v1/${parentId}/${id}`;

  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Document Service API',
  });

  let apiResponse;
  try {
    apiResponse = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-Correlation-ID': correlationId,
      },
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

  return response;
};
