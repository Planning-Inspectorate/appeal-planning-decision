const { getLPAStatement, getRule6Statements } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getAppealStatementsForCase(req, res) {
	const { caseReference } = req.params;
	const { type } = req.query;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}

	if (!type) {
		throw ApiError.withMessage(400, 'statement type (lpa or rule6) required');
	}

	try {
		let statements;

		if (type === 'lpa') {
			statements = await getLPAStatement(caseReference);
		} else if (type === 'rule6') {
			statements = await getRule6Statements(caseReference);
		} else {
			throw ApiError.withMessage(400, 'invalid statement type');
		}

		res.status(200).send(statements);
	} catch (error) {
		logger.error(`Failed to get appeal statements: ${error}`);
		throw error;
	}
}

module.exports = { getAppealStatementsForCase };
