const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const { default: fetch } = require('node-fetch');
const uuid = require('uuid');
const { documentTypes } = require('@pins/common');
const config = require('../config');
const { createDocument } = require('../lib/documents-api-wrapper');
const { generatePDF, sanitizeHtmlforPDF } = require('../lib/pdf-api-wrapper');
const { VIEW } = require('../lib/views');
const {
	VIEW: { FULL_APPEAL }
} = require('../lib/full-appeal/views');
const logger = require('../lib/logger');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { addCSStoHtml } = require('#lib/add-css-to-html');

const defaultFileName = 'appeal-form';

const defaultSubmissionFileName = 'appellant-submission';
const defaultLPASubmissionFileName = 'lpa-questionnaire-submission';

const appealTypeUrlMapping = {
	[APPEAL_ID.HOUSEHOLDER]: VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION,
	[APPEAL_ID.PLANNING_SECTION_78]: FULL_APPEAL.DECLARATION_INFORMATION
};

const buildAppealUrl = (appeal) => {
	const urlPart =
		appealTypeUrlMapping[appeal.appealType] || appealTypeUrlMapping[APPEAL_ID.HOUSEHOLDER];
	return `${config.server.host}/${urlPart}/${appeal.id}`;
};

/**
 * @param {string} id -  id for appeal, submission etc
 * @param {string} url - url to fetch HTML from
 * @param {string} [cookieString] - cookies
 */
const getHtml = async (id, url, cookieString) => {
	const log = logger.child({
		id,
		uuid: uuid.v4()
	});

	let response;

	try {
		log.info({ url }, 'Generating HTML');

		const opts = {
			headers: {
				cookie: cookieString
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
		log.error({ url, err }, 'Failed to generate HTML');

		throw err;
	}

	const ok = response.status === 200;

	if (!ok) {
		log.error({ status: response.status }, 'HTTP status code not 200');

		throw new Error(response.statusText);
	}

	log.info({ url }, 'Successfully generated HTML');

	return response.text();
};

/**
 * @param {Object} params
 * @param {*} params.appeal - appeal
 * @param {string} [params.fileName] - optional filename
 * @param {string} [params.cookieString] - session cookie
 */
const storePdfAppeal = async ({ appeal, fileName, cookieString }) => {
	const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

	log.info('Attempting to store PDF document');

	try {
		const url = buildAppealUrl(appeal);
		const htmlContent = await getHtml(appeal.id, url, cookieString);
		const sanitizedHtml = sanitizeHtmlforPDF(htmlContent);

		log.debug('Generating PDF of appeal');

		const pdfBuffer = await generatePDF(sanitizedHtml);

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

// Functions relating to V2 appeal forms

const typeCodeToAppealUrlStub = {
	[CASE_TYPES.HAS.processCode]: 'householder',
	[CASE_TYPES.S78.processCode]: 'full-planning'
};

/**
 * @param {Object} params
 * @param {string} params.appellantSubmissionId - appellant Submission Id
 * @param {string} params.appealTypeCode - appeal type code
 * @param {string} [params.fileName] - optional filename
 * @param {string} [params.cookieString] - session cookie
 */
const storePdfAppellantSubmission = async ({
	appellantSubmissionId,
	appealTypeCode,
	fileName,
	cookieString
}) => {
	const log = logger.child({
		appellantSubmissionId,
		uuid: uuid.v4()
	});

	log.info('Attempting to store PDF document');

	/* URL back to this service front-end */
	const url = buildAppellantSubmissionUrl(appellantSubmissionId, appealTypeCode);

	try {
		const htmlContent = await getHtml(appellantSubmissionId, url, cookieString);
		const sanitizedHtml = sanitizeHtmlforPDF(htmlContent);
		log.debug('Generating PDF of appeal');

		const pdfBuffer = await generatePDF(sanitizedHtml);

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
 * @returns {string} url
 */
const buildAppellantSubmissionUrl = (appellantSubmissionId, appealTypeCode) => {
	const urlPart =
		typeCodeToAppealUrlStub[appealTypeCode] || appealTypeUrlMapping[APPEAL_ID.HOUSEHOLDER];
	return `${config.server.host}/appeals/${urlPart}/submit/information?id=${appellantSubmissionId}`;
};

/**
 * @param {Object} params
 * @param {*} params.submissionJourney - LPA questionnaire submission journey
 * @param {string} [params.fileName] - optional filename
 * @param {string} [params.cookieString] - session cookie
 * @param {string} params.appealTypeUrl - appealType passed from dynamic forms controller
 */
const storePdfQuestionnaireSubmission = async ({
	submissionJourney,
	fileName,
	cookieString,
	appealTypeUrl
}) => {
	const appealReferenceId = submissionJourney.response.referenceId;
	const lpaQuestionnaireId = submissionJourney.response.answers.id;

	const url = `${config.server.host}/manage-appeals/${appealTypeUrl}/${appealReferenceId}/questionnaire-submitted/information`;

	const log = logger.child({
		lpaQuestionnaireId: lpaQuestionnaireId,
		uuid: uuid.v4()
	});

	log.info('Attempting to store PDF document');

	try {
		const htmlContent = await getHtml(submissionJourney, url, cookieString);
		const sanitizedHtml = sanitizeHtmlforPDF(htmlContent);
		const htmlContentWithCSS = await addCSStoHtml(sanitizedHtml);

		log.debug('Generating PDF of questionnaire');
		const pdfBuffer = await generatePDF(htmlContentWithCSS);
		log.debug('Creating document from PDF buffer');
		const document = await createDocument(
			{
				id: lpaQuestionnaireId,
				referenceNumber: appealReferenceId
			},
			pdfBuffer,
			`${fileName || defaultLPASubmissionFileName}.pdf`,
			documentTypes.lpaQuestionnaireSubmission.name
		);
		log.debug('PDF document successfully created');

		return document;
	} catch (err) {
		const msg = 'Error during the lpa questionnaire submission pdf generation';
		log.error({ err }, msg);
		throw new Error(msg);
	}
};

module.exports = {
	storePdfAppeal,
	storePdfAppellantSubmission,
	getHtml,
	storePdfQuestionnaireSubmission
};
