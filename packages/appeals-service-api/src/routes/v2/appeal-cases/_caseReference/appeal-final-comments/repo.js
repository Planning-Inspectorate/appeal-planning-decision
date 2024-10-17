const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/** @type {import('@prisma/client').Prisma.FinalComment$CommentStatementDocumentsArgs} */
const IndirectDocumentsArgsPublishedOnly = {
	where: {
		Document: {
			publishedDocumentURI: { not: null }
		}
	},
	include: {
		Document: {
			select: {
				id: true,
				publishedDocumentURI: true,
				filename: true,
				documentType: true,
				datePublished: true
			}
		}
	}
};

/**
 * @typedef {import('@prisma/client').FinalComment} FinalComment
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
	 * @returns {Promise<Array<FinalComment>|null>}
	 */
	async getLPAFinalComments(caseReference) {
		try {
			return await this.dbClient.finalComment.findMany({
				where: {
					caseReference,
					lpaCode: { not: null }
				},
				include: {
					CommentStatementDocuments: IndirectDocumentsArgsPublishedOnly
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
	 * @returns {Promise<Array<FinalComment>|null>}
	 */
	async getServiceUserFinalComments(caseReference, userType) {
		try {
			const comments = await this.dbClient.finalComment.findMany({
				where: {
					caseReference,
					serviceUserId: { not: null },
					ServiceUser: {
						serviceUserType: userType
					}
				},
				include: {
					CommentStatementDocuments: IndirectDocumentsArgsPublishedOnly
				}
			});
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

module.exports = { AppealFinalCommentRepository, IndirectDocumentsArgsPublishedOnly };
