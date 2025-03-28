const { fetchDocument } = require('../lib/documents-api-wrapper');
const { saveAppeal, getExistingAppeal } = require('../lib/appeals-api-wrapper');
const {
	config: {
		appeal: { type: appealTypeConfig }
	}
} = require('@pins/business-rules');
const logger = require('../lib/logger');
const { storePdfAppellantSubmission } = require('../../src/services/pdf.service');

/**
 * links user to a document, requires an active session
 * @type {import('express').Handler}
 */
const getDocument = async (req, res) => {
	const { appealOrQuestionnaireId, documentId } = req.params;

	try {
		const sessionAppealId = req?.session?.appeal?.id;

		if (!sessionAppealId || sessionAppealId !== appealOrQuestionnaireId) {
			// create save/return entry
			const tempAppeal = {
				id: appealOrQuestionnaireId,
				skipReturnEmail: true
			};
			await saveAppeal(tempAppeal); //create save/return

			// remove existing appeal in session
			if (req?.session?.appeal) {
				delete req.session.appeal;
			}

			// lookup appeal to get type - don't trust this as user hasn't proven access to appeal via email yet
			const appeal = await getExistingAppeal(appealOrQuestionnaireId);

			if (!appeal || !appeal.appealType) {
				throw new Error('Access denied');
			}

			const saveAndContinueConfig = appealTypeConfig[
				appeal.appealType
			].email.saveAndReturnContinueAppeal(appeal, '', Date.now());

			req.session.loginRedirect = `${req.baseUrl}${req.url}`;

			res.redirect(`${saveAndContinueConfig.variables.link}`);
			return;
		}

		const { headers, body } = await fetchDocument(appealOrQuestionnaireId, documentId);
		return await returnResult(headers, body, res);
	} catch (err) {
		logger.error({ err }, 'Failed to get document');
		res.sendStatus(500);
		return;
	}
};

/**
 * generates and/or retrieves pdf of appeal submission
 * custom redirect if not logged in
 * @type {import('express').Handler}
 */
const getAppellantSubmissionPDFV2 = async (req, res) => {
	const { appellantSubmissionId } = req.params;

	try {
		logger.info('Confirming user owns appellant submission');

		// make api call to retrieve download data
		// will error if user does not own appellant submission
		const appellantSubmissionDetails =
			await req.appealsApiClient.checkOwnershipAndPdfDownloadDetails(appellantSubmissionId);

		logger.info('Attempting to fetch document');

		let documentId;

		if (appellantSubmissionDetails.submissionPdfId) {
			documentId = appellantSubmissionDetails.submissionPdfId;
		} else {
			const storedPdf = await storePdfAppellantSubmission({
				appellantSubmissionId: appellantSubmissionDetails.id,
				appealTypeCode: appellantSubmissionDetails.appealTypeCode,
				cookieString: req.headers.cookie
			});
			await req.appealsApiClient.updateAppellantSubmission(appellantSubmissionId, {
				submissionPdfId: storedPdf.id
			});

			documentId = storedPdf.id;
		}

		const { headers, body } = await fetchDocument(appellantSubmissionId, documentId);
		return await returnResult(headers, body, res);
	} catch (err) {
		logger.error({ err }, 'Failed to get document');
		res.sendStatus(500);
		return;
	}
};

/**
 * retrieves pdf of lpaq submission
 * custom redirect if not logged in
 * @type {import('express').Handler}
 */
const getLPAQSubmissionPDFV2 = async (req, res) => {
	const { caseReference } = req.params;

	try {
		logger.info('Confirming LPA user can access LPAQ submission');

		// make api call to retrieve download data
		// will error if LPA user does not have access to LPAQ submission
		const submissionDetails = await req.appealsApiClient.checkOwnershipAndPdfDownloadDetailsLPAQ(
			caseReference
		);

		logger.info('Attempting to fetch document');

		const { submissionPdfId } = submissionDetails;

		if (!submissionPdfId) {
			throw 'LPAQ submission document does not exist';
		}

		const { headers, body } = await fetchDocument(submissionDetails.id, submissionPdfId);
		return await returnResult(headers, body, res);
	} catch (err) {
		logger.error({ err }, 'Failed to get document');
		res.sendStatus(500);
		return;
	}
};

/**
 * links user to a submission document, internally checks access
 * @type {import('express').Handler}
 */
const getSubmissionDocumentV2Url = async (req, res) => {
	const { documentId } = req.params;

	logger.debug({ documentId }, 'getSubmissionDocumentV2');

	const sasUrl = await req.docsApiClient.getSubmissionDocumentSASUrl(documentId);

	if (!sasUrl?.url) throw new Error('failed to getSubmissionDocumentV2');

	logger.debug({ sasUrl }, 'redirecting to submission doc');

	res.redirect(307, sasUrl.url);
};

/**
 * links user to a published BO document, internally checks access
 * @type {import('express').Handler}
 */
const getPublishedDocumentV2Url = async (req, res) => {
	const { documentId } = req.params;

	logger.debug({ documentId }, 'getPublishedDocumentV2Url');

	const sasUrl = await req.docsApiClient.getBackOfficeDocumentSASUrl(documentId);

	if (!sasUrl?.url) throw new Error('failed to getPublishedDocumentV2');

	logger.debug({ sasUrl }, 'redirecting to published doc');

	res.redirect(307, sasUrl.url);
};

const returnResult = async (headers, body, res) => {
	res.set({
		'content-length': headers.get('content-length'),
		'content-disposition': `attachment;filename="${headers.get('x-original-file-name')}"`,
		'content-type': headers.get('content-type')
	});

	return body.pipe(res);
};

module.exports = {
	getDocument,
	getAppellantSubmissionPDFV2,
	getSubmissionDocumentV2Url,
	getPublishedDocumentV2Url,
	getLPAQSubmissionPDFV2
};
