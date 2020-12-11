const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const uuid = require('uuid');

const config = require('../config');
const parentLogger = require('./logger');

exports.createDocument = async (appeal, formData) => {
  const path = `/api/v1/${appeal.id}`;

  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;


  const logger = parentLogger.child({
    correlationId,
    service: 'Document Service API',
  });

  logger.info(appeal, `appeal`);
  logger.info(url, `url`);
  logger.info(formData, `formData`);

  let apiResponse
  try {
    const fd = new FormData();
    // fd.append('file', fs.createReadStream(formData.tempFilePath))
    fd.append('file', Buffer.from(formData.data))

    apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data",
        'X-Correlation-ID': correlationId,
      },
      body: fd,
    });
  } catch (e) {
    logger.error(e);
  }



  logger.info(apiResponse, 'apiResponse');

  if (!apiResponse.ok) {
    logger.debug(apiResponse, 'Documents API Response not OK');

    throw new Error(apiResponse.statusText);
  }

  const ok = await apiResponse.status === 202;

  logger.warn(ok, 'ok')

  return {
    id: uuid.v4(),
    applicationId: appeal.id,
    name: 'tmp-2-1607684291243'
  };
}
