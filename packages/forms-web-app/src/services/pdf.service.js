const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const fetch = require('node-fetch');
const uuid = require('uuid');
const { documentTypes } = require('@pins/common');
const config = require('../config');
const { createDocument } = require('../lib/documents-api-wrapper');
const { generatePDF } = require('../lib/pdf-api-wrapper');
const { VIEW } = require('../lib/views');
const {
	VIEW: { FULL_APPEAL }
} = require('../lib/full-appeal/views');
const logger = require('../lib/logger');
const { textToPdf } = require('../lib/textToPdf');

const defaultFileName = 'appeal-form';

const appealTypeUrlMapping = {
	[APPEAL_ID.HOUSEHOLDER]: VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION,
	[APPEAL_ID.PLANNING_SECTION_78]: FULL_APPEAL.DECLARATION_INFORMATION
};

const buildAppealUrl = (appeal) => {
	const urlPart =
		appealTypeUrlMapping[appeal.appealType] || appealTypeUrlMapping[APPEAL_ID.HOUSEHOLDER];
	return `${config.server.host}/${urlPart}/${appeal.id}`;
};

const getHtmlAppeal = async (appeal) => {
	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	/* URL back to this service front-end */
	const url = buildAppealUrl(appeal);

	let response;

	try {
		log.info({ url }, 'Generating HTML appeal');

		response = await fetch(url);

		log.debug(
			{
				status: response.status,
				statusText: response.statusText
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

const storePdfAppeal = async (appeal, fileName) => {
	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	log.info('Attempting to store PDF document');

	try {
		const htmlContent = await getHtmlAppeal(appeal);

		log.debug('Generating PDF of appeal');

		const pdfBuffer = await generatePDF(htmlContent);

		log.debug('Creating document from PDF buffer');

		const document = await createDocument(
			appeal,
			pdfBuffer,
			`${fileName || defaultFileName}.pdf`,
			documentTypes.appealPdf.name
		);

		log.debug('PDF document successfully created');

		return document;
	} catch (err) {
		const msg = 'Error during the appeal pdf generation';
		log.error({ err }, msg);

		throw new Error(msg);
	}
};

const storeTextAsDocument = async (submission, plainText, docType) => {
	const log = logger.child({ uuid: uuid.v4() });

	log.info('Storing PDF appeal document');

	try {
		log.debug('Generating PDF of plainText');

		const pdfBuffer = await textToPdf(plainText);

		log.debug('Creating document from PDF buffer');

		const document = await createDocument(
			submission,
			pdfBuffer,
			`${docType.displayName}.pdf`,
			docType.name
		);

		log.debug('PDF document successfully created');

		return document;
	} catch (err) {
		const msg = 'Error during the pdf generation';
		log.error({ err }, msg);

		throw new Error(msg);
	}
};

module.exports = {
	storePdfAppeal,
	getHtmlAppeal,
	storeTextAsDocument
};
