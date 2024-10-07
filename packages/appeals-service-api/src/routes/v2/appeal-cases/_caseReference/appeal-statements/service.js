const { AppealStatementRepository } = require('./repo');
const repo = new AppealStatementRepository();

/**
 * @typedef {import('@prisma/client').AppealStatement} AppealStatement
 */

/**
 * @param {string} caseReference
 * @returns {Promise<Array<AppealStatement>|null>}
 */
async function getLPAStatement(caseReference) {
	const statement = await repo.getLPAStatement(caseReference);
	if (!statement) {
		return null;
	}
	return statement;
}

/**
 * @param {string} caseReference
 * @returns {Promise<Array<AppealStatement>|null>}
 */
async function getRule6Statements(caseReference) {
	const statements = await repo.getRule6Statements(caseReference);
	if (!statements) {
		return null;
	}
	return statements;
}

module.exports = { getLPAStatement, getRule6Statements };
