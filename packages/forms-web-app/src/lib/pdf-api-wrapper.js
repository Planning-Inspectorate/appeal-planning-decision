const fetch = require('node-fetch');
const FormData = require('form-data');
const uuid = require('uuid');

const config = require('../config');
const parentLogger = require('./logger');

exports.generatePDF = async (filename, htmlContent) => {
  const path = `/api/v1/pdf`;

  const correlationId = uuid.v4();
  const url = `${config.pdf.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'PDF Service API',
  });

  let apiResponse;
  try {
    const buffer = Buffer.from(htmlContent, 'utf-8');
    const fd = new FormData();
    fd.append('htmlFile', buffer, filename);

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
    logger.debug(apiResponse, 'PDF API Response not OK');
    throw new Error(apiResponse.statusText);
  }

  const ok = (await apiResponse.status) === 200;

  if (!ok) {
    throw new Error(apiResponse.statusText);
  }

  return apiResponse.text();
};
