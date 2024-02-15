const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import("@prisma/client").Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import('@prisma/client').Prisma.AppealCaseFindManyArgs} AppealCaseFindManyArgs
 * @typedef {import('@prisma/client').Prisma.AppealCaseWhereInput} AppealCaseWhereInput
 * @typedef {import('@prisma/client').Prisma.AppealCaseCountArgs} AppealCaseCountArgs
 */

class AppealCaseRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get an appeal by case reference (aka appeal number)
	 *
	 * @param {object} opts
	 * @param {string} opts.caseReference
	 * @param {boolean} opts.casePublished
	 * @returns {Promise<AppealCase|null>}
	 */
	getByCaseReference({ caseReference, casePublished = true }) {
		return this.dbClient.appealCase.findUnique({
			where: {
				caseReference,
				casePublished
			}
		});
	}

	/**
	 * Get an appeal by case reference (aka appeal number)
	 *
	 * @param {string} caseReference
	 * @param {AppealCaseCreateInput} data
	 * @returns {Promise<AppealCase>}
	 */
	putByCaseReference(caseReference, data) {
		return this.dbClient.appealCase.upsert({
			create: { ...data, Appeal: { create: {} } }, // create with parent Appeal
			update: data,
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
		return await this.dbClient.appealCase.findMany(query);
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
		return await this.dbClient.appealCase.count(query);
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
		const AND = [{ siteAddressPostcode: { startsWith: postcode } }, { casePublished: true }];
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseFindManyArgs}	*/
		const query = {
			where: {
				AND
			}
		};
		// todo: probably pagination
		return await this.dbClient.appealCase.findMany(query);
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
