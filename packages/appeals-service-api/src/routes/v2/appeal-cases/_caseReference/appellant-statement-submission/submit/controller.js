const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getAppellantStatementByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const userId = req.auth?.payload.sub;

		if (!userId) {
			throw ApiError.invalidToken();
		}

		const statements = await getAppellantStatementByAppealId(req.params.caseReference);

		if (!statements) {
			throw ApiError.statementsNotFound();
		}

		const formatter = getFormatter(statements.AppealCase.appealTypeCode);
		await backOfficeV2Service.submitAppellantStatementSubmission(
			req.params.caseReference,
			userId,
			formatter
		);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitStatementsResponse();
	}

	res.sendStatus(200);
};
