const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const { default: fetch } = require('node-fetch');
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
const { CONSTS } = require('../consts');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');

const defaultFileName = 'appeal-form';

const defaultSubmissionFileName = 'appellant-submission';

const appealTypeUrlMapping = {
	[APPEAL_ID.HOUSEHOLDER]: VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION,
	[APPEAL_ID.PLANNING_SECTION_78]: FULL_APPEAL.DECLARATION_INFORMATION
};

const buildAppealUrl = (appeal) => {
	const urlPart =
		appealTypeUrlMapping[appeal.appealType] || appealTypeUrlMapping[APPEAL_ID.HOUSEHOLDER];
	return `${config.server.host}/${urlPart}/${appeal.id}`;
};

const getHtmlAppeal = async (appeal, sid) => {
	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	/* URL back to this service front-end */
	const url = buildAppealUrl(appeal);

	let response;

	try {
		log.info({ url }, 'Generating HTML appeal');

		const opts = {
			headers: {
				cookie: `${CONSTS.SESSION_COOKIE_NAME}=${sid}`
			}
		};

		response = await fetch(url, opts);

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

/**
 * @param {Object} params
 * @param {*} params.appeal - appeal
 * @param {string} [params.fileName] - optional filename
 * @param {string} params.sid - session cookie
 */
const storePdfAppeal = async ({ appeal, fileName, sid }) => {
	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	log.info('Attempting to store PDF document');

	try {
		const htmlContent = await getHtmlAppeal(appeal, sid);

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

// Functions relating to V2 appeal forms

const typeCodeToAppealUrlStub = {
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: 'householder',
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: 'full-planning'
};

/**
 * @param {Object} params
 * @param {string} params.appellantSubmissionId - appellant Submission Id
 * @param {string} params.appealTypeCode - appeal type code
 * @param {string} [params.fileName] - optional filename
 * @param {string} params.sid - session cookie
 */
const storePdfAppellantSubmission = async ({
	appellantSubmissionId,
	appealTypeCode,
	fileName,
	sid
}) => {
	const log = logger.child({
		appellantSubmissionId,
		uuid: uuid.v4()
	});

	log.info('Attempting to store PDF document');

	try {
		const htmlContent = await getHtmlAppellantSubmission(
			appellantSubmissionId,
			appealTypeCode,
			sid
		);

		log.debug('Generating PDF of appeal');

		const pdfBuffer = await generatePDF(htmlContent);

		log.debug('Creating document from PDF buffer');

		const document = await createDocument(
			{
				id: appellantSubmissionId,
				referenceNumber: appellantSubmissionId
			},
			pdfBuffer,
			`${fileName || defaultSubmissionFileName}.pdf`,
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

/**
 * @param {string} appellantSubmissionId - appellant Submission Id
 * @param {string} appealTypeCode - appeal type code
 * @param {string} sid - session cookie
 */

const getHtmlAppellantSubmission = async (appellantSubmissionId, appealTypeCode, sid) => {
	const log = logger.child({
		appellantSubmissionId,
		uuid: uuid.v4()
	});

	/* URL back to this service front-end */
	const url = buildAppellantSubmissionUrl(appellantSubmissionId, appealTypeCode);

	let response;

	try {
		log.info({ url }, 'Generating HTML appeal');

		const opts = {
			headers: {
				cookie: `${CONSTS.SESSION_COOKIE_NAME}=${sid}`
			}
		};

		response = await fetch(url, opts);

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

/**
 * @param {string} appellantSubmissionId - appellant Submission Id
 * @param {string} appealTypeCode - appeal type code
 * @returns {string} url
 */
const buildAppellantSubmissionUrl = (appellantSubmissionId, appealTypeCode) => {
	const urlPart =
		typeCodeToAppealUrlStub[appealTypeCode] || appealTypeUrlMapping[APPEAL_ID.HOUSEHOLDER];
	return `${config.server.host}/appeals/${urlPart}/submit/information?id=${appellantSubmissionId}`;
};

module.exports = {
	storePdfAppeal,
	storePdfAppellantSubmission,
	getHtmlAppeal,
	storeTextAsDocument
};
