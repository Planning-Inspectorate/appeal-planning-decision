const dbClient = require('#db-client');

/**
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import('@prisma/client').Prisma.AppealCaseFindManyArgs} AppealCaseFindManyArgs
 * @typedef {import('@prisma/client').Prisma.AppealCaseWhereInput} AppealCaseWhereInput
 * @typedef {import('@prisma/client').Prisma.AppealCaseCountArgs} AppealCaseCountArgs
 */

class AppealCaseRepository {
	/**
	 * Get an appeal by case reference (aka appeal number)
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppealCase|null>}
	 */
	getByCaseReference(caseReference) {
		return dbClient.appealCase.findUnique({
			where: {
				caseReference
			}
		});
	}

	/**
	 * List cases for an LPA
	 *
	 * @param {Object} options
	 * @param {string} options.lpaCode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByLpaCode({ lpaCode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ LPACode: lpaCode }];
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseFindManyArgs}	*/
		const query = {
			where: {
				AND
			}
		};
		// todo: probably pagination
		return await dbClient.appealCase.findMany(query);
	}

	/**
	 * Count cases for an LPA
	 *
	 * @param {Object} options
	 * @param {string} options.lpaCode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<number>}
	 */
	async countByLpaCode({ lpaCode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ LPACode: lpaCode }];
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseCountArgs}	*/
		const query = {
			where: {
				AND
			}
		};
		return await dbClient.appealCase.count(query);
	}

	/**
	 * List cases by postcode
	 *
	 * @param {Object} options
	 * @param {string} options.postcode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByPostCode({ postcode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ siteAddressPostcode: { startsWith: postcode } }];
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseFindManyArgs}	*/
		const query = {
			where: {
				AND
			}
		};
		// todo: probably pagination
		return await dbClient.appealCase.findMany(query);
	}
}

/**
 * Add a where clause to either filter by only decided or only not decided cases
 *
 * @param {AppealCaseWhereInput[]} whereArray
 * @param {boolean} decidedOnly - if true, only decided cases; else ONLY cases not decided
 */
function addDecidedClauseToQuery(whereArray, decidedOnly) {
	if (decidedOnly) {
		// either has decision date == decided
		whereArray.push({ caseDecisionDate: { not: null } });
	} else {
		// or no decision date == not decided
		whereArray.push({ caseDecisionDate: null });
	}
}

module.exports = { AppealCaseRepository };
