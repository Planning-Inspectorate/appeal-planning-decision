const ApiError = require('#errors/apiError');
const logger = require('#lib/logger.js');
const BackOfficeV2Service = require('../../../../../../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();
const { getLPAStatementByAppealId } = require('../service');
const { getFormatter } = require('../../get-representation-formatter');

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	try {
		const statements = await getLPAStatementByAppealId(req.params.caseReference);

		if (!statements) {
			throw ApiError.statementsNotFound();
		}

		const formatter = getFormatter(statements.AppealCase.appealTypeCode);
		await backOfficeV2Service.submitLPAStatementSubmission(req.params.caseReference, formatter);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitStatementsResponse();
	}

	res.sendStatus(200);
};
