const { fetchDocument } = require('../lib/documents-api-wrapper');
const { saveAppeal, getExistingAppeal } = require('../lib/appeals-api-wrapper');
const {
	config: {
		appeal: { type: appealTypeConfig }
	}
} = require('@pins/business-rules');
const logger = require('../lib/logger');
const { getUserFromSession } = require('../services/user.service');

/**
 * links user to a document, requires an active session
 * @type {import('express').Handler}
 */
const getDocument = async (req, res) => {
	const { appealOrQuestionnaireId, documentId } = req.params;

	try {
		const lpaUser = getUserFromSession(req);
		// lpa users
		if (lpaUser) {
			const { headers, body } = await fetchDocument(appealOrQuestionnaireId, documentId);
			const sessionLpaCode = lpaUser.lpaCode;
			const associatedLpaCode = headers.get('x-original-file-name').match(/[A-z][0-9]{4}/gm)[0];

			if (sessionLpaCode != associatedLpaCode) {
				logger.error('Failed to get document');
				res.sendStatus(401);
				return;
			}

			return await returnResult(headers, body, res);
		}

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

const returnResult = async (headers, body, res) => {
	res.set({
		'content-length': headers.get('content-length'),
		'content-disposition': `attachment;filename="${headers.get('x-original-file-name')}"`,
		'content-type': headers.get('content-type')
	});

	return body.pipe(res);
};

module.exports = {
	getDocument
};
