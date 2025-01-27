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
			if (!statements || statements?.length === 0) {
				throw ApiError.withMessage(404, 'No LPA statement found for this case reference');
			}
		} else if (type === 'rule6') {
			statements = await getRule6Statements(caseReference);
			if (!statements || statements?.length === 0) {
				throw ApiError.withMessage(404, 'No Rule 6 party statements found for this case reference');
			}
		} else {
			throw ApiError.withMessage(400, 'invalid statement type');
		}

		res.status(200).json(statements);
	} catch (error) {
		logger.error(`Failed to get appeal statements: ${error}`);
		throw error;
	}
}

module.exports = { getAppealStatementsForCase };
