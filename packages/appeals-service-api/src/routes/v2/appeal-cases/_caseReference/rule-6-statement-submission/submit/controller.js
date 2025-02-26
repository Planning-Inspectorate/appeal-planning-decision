const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getRule6StatementByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	const userId = req.auth?.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const caseReference = req.params.caseReference;

	try {
		const statement = await getRule6StatementByAppealId(userId, caseReference);

		if (!statement) {
			throw ApiError.statementsNotFound();
		}

		const formatter = getFormatter(statement.AppealCase.appealTypeCode);

		await backOfficeV2Service.submitRule6StatementSubmission(caseReference, userId, formatter);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitStatementsResponse();
	}

	res.sendStatus(200);
};
