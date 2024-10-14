const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppealFinalComment} AppealFinalComment
 */
class AppealFinalCommentRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get lpa statement for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<Array<AppealFinalComment>|null>}
	 */
	async getLPAFinalComments(caseReference) {
		try {
			return await this.dbClient.appealFinalComment.findMany({
				where: {
					caseReference,
					lpaCode: { not: null }
				},
				include: {
					FinalCommentDocuments: {
						include: {
							Document: true
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Get rule 6 party statements for a given case reference
	 *
	 * @param {string} caseReference
	 * @param {string} userType
	 * @returns {Promise<Array<AppealFinalComment>|null>}
	 */
	async getServiceUserFinalComments(caseReference, userType) {
		try {
			const comments = await this.dbClient.appealFinalComment.findMany({
				where: {
					caseReference,
					serviceUserId: { not: null },
					ServiceUser: {
						serviceUserType: userType
					}
				},
				include: {
					FinalCommentDocuments: {
						include: {
							Document: true
						}
					},
					ServiceUser: true
				}
			});
			console.log('in repo', comments);
			return comments;
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { AppealFinalCommentRepository };
