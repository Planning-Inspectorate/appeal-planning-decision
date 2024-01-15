// const { createPrismaClient } = require('#db-client');
// const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

// /**
//  * @typedef {import('@prisma/client').Prisma.LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
//  */

// class LPAQuestionnaireSubmissionRepository {
// 	dbClient;

// 	constructor() {
// 		this.dbClient = createPrismaClient();
// 	}

// 	/**
// 	 * Get questionnaire for given appeal
// 	 *
// 	 * @param {string} caseReference
// 	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
// 	 */
// 	async getLPAQuestionnaireByAppeal(caseReference) {
// 		try {
// 			return await this.dbClient.lPAQuestionnaireSubmission.findUnique({
// 				where: {
// 					caseReference
// 				}
// 			});
// 		} catch (e) {
// 			if (e instanceof PrismaClientKnownRequestError) {
// 				if (e.code === 'P2023') {
// 					// probably an invalid ID/GUID
// 					return null;
// 				}
// 			}
// 			throw e;
// 		}
// 	}
// }

// module.exports = { LPAQuestionnaireSubmissionRepository };
