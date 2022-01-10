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

const handler = async (url, method = 'GET', data = {}) => {
  const correlationId = uuid.v4();
  const logger = parentLogger.child({
    correlationId,
    service: 'Document Service API',
  });

  let apiResponse;

  try {
    apiResponse = await fetch(url, {
      method,
      headers: {
        'X-Correlation-ID': correlationId,
      },
      ...data,
    });
  } catch (e) {
    logger.error(e);
    throw new Error(e.toString());
  }

  if (!apiResponse.ok) {
    logger.debug(apiResponse, 'Documents API Response not OK');
    throw new Error(apiResponse.statusText);
  }

  const ok = [200, 202].includes(await apiResponse.status);

  if (!ok) {
    throw new Error(apiResponse.statusText);
  }

  return apiResponse;
};

const createDocument = async (appeal, data, fileName, documentType) => {
  const body = new FormData();

  if (isTheFormDataBuffer(data)) {
    const documentName = fileName || data.name;
    body.append('file', fs.createReadStream(data.tempFilePath), documentName);
  } else if (isDataBuffer(data)) {
    body.append('file', data, fileName);
  } else {
    throw new Error('The type of provided data to create a document with is wrong');
  }

  body.append('documentType', documentType);

  const apiResponse = await handler(`${config.documents.url}/api/v1/${appeal.id}`, 'POST', {
    body,
  });

  const response = await apiResponse.json();

  if (!response.id) {
    const msg = 'Document had no ID';
    throw new Error(msg);
  }

  return response;
};

const fetchDocument = (appealOrQuestionnaireId, documentId) =>
  handler(`${config.documents.url}/api/v1/${appealOrQuestionnaireId}/${documentId}/file`);

module.exports = {
  createDocument,
  fetchDocument,
};
