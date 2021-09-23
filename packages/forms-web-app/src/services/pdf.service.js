const fetch = require('node-fetch');
const uuid = require('uuid');

const config = require('../config');
const { createDocument } = require('../lib/documents-api-wrapper');
//const { generatePDF } = require('../lib/pdf-api-wrapper');
const { VIEW } = require('../lib/views');
const logger = require('../lib/logger');

const FILE_NAME = 'Appeal-form';

const getHtmlAppeal = async (appeal) => {
  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  /* URL back to this service front-end */
  const url = `${config.server.host}/${VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION}/${appeal.id}`;

  let response;

  try {
    log.info({ url }, 'Generating HTML appeal');

    response = await fetch(url);

    log.debug(
      {
        status: response.status,
        statusText: response.statusText,
      },
      'HTML generated'
    );
  } catch (err) {
    log.error({ err }, 'Failed to generate HTML appeal');

    throw err;
  }

  const ok = response.status === 200;

  if (!ok) {
    log.error({ status: response.status }, 'HTTP status code not 200');

    throw new Error(response.statusText);
  }

  log.info('Successfully generated HTML appeal');

  return response.text();
};

const storePdfAppeal = async (appeal) => {
  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  log.info('Storing PDF appeal document');

  try {
    const htmlContent = await getHtmlAppeal(appeal);

    log.debug('Generating PDF of appeal');

    const pdfBuffer = await generatePDF(FILE_NAME, htmlContent);

    log.debug('Creating document from PDF buffer');

    const document = await createDocument(appeal, pdfBuffer, `${FILE_NAME}.pdf`);

    log.debug('PDF document successfully created');

    return document;
  } catch (err) {
    const msg = 'Error during the appeal pdf generation';
    log.error({ err }, msg);

    throw new Error(msg);
  }
};

module.exports = {
  storePdfAppeal,
  getHtmlAppeal,
};
