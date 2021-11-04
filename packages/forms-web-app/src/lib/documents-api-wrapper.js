const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');

const config = require('../config');
const parentLogger = require('./logger');

function isDataBuffer(data) {
  return data !== null && data !== undefined && typeof data === 'object';
}

function isTheFormDataBuffer(data) {
  return isDataBuffer(data) && data.tempFilePath;
}

exports.createDocument = async (appeal, data, fileName, documentType) => {
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

    fd.append('documentType', documentType);

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
