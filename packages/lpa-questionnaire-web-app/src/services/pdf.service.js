const fetch = require('node-fetch');
const uuid = require('uuid');

const config = require('../config');
const { createDocument } = require('../lib/documents-api-wrapper');
const { generatePDF } = require('../lib/pdf-api-wrapper');
const logger = require('../lib/logger');

const FILE_NAME = 'Reply-form';

const getHtmlReply = async (reply) => {
  const log = logger.child({ replyId: reply.id, uuid: uuid.v4() });
  /* URL back to this service front-end */
  const url = `${config.server.host}/${'<html><h1>Simple html file</h1></html>'}/${reply.id}`;
  let response;

  try {
    log.info({ url }, 'Generating HTML reply');
    response = await fetch(url);

    log.debug(
      {
        status: response.status,
        statusText: response.statusText,
      },
      'Reply HTML generated'
    );
  } catch (err) {
    log.error({ err }, 'Failed to generate HTML reply');
    throw err;
  }

  const ok = response.status === 200;

  if (!ok) {
    log.error({ status: response.status }, 'HTTP status code not 200');
    throw new Error(response.statusText);
  }

  log.info('Successfully generated HTML reply');
  return response.text();
};

const storePdfReply = async (reply) => {
  const log = logger.child({ replyId: reply.id, uuid: uuid.v4() });
  log.info('Storing PDF reply document');

  try {
    const htmlContent = await getHtmlReply(reply);
    log.debug('Generating PDF of reply');
    const pdfBuffer = await generatePDF(FILE_NAME, htmlContent);
    log.debug('Creating document from PDF buffer');
    const document = await createDocument(reply, pdfBuffer, `${FILE_NAME}.pdf`);
    log.debug('PDF reply document successfully created');
    return document;
  } catch (err) {
    const msg = 'Error during the reply pdf generation';
    log.error({ err }, msg);
    throw new Error(msg);
  }
};

module.exports = {
  storePdfReply,
  getHtmlReply,
};
