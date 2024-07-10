const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@prisma/client').InterestedPartyComment} InterestedPartyComment
 */
class InterestedPartyCommentRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get interested party comments for a given case reference
	 *
	 * @param {string} caseReference
	 * @returns {Promise<Array<InterestedPartyComment>|null>}
	 */
	async listCommentsForCase(caseReference) {
		try {
			return await this.dbClient.interestedPartyComment.findMany({
				where: {
					caseReference
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
	 * Create a new interested party comment
	 *
	 * @param {object} commentData
	 * @param {string} commentData.caseReference
	 * @param {string} commentData.serviceUserId
	 * @param {string} commentData.comment
	 * @returns {Promise<InterestedPartyComment>}
	 */
	async postComment(commentData) {
		try {
			return await this.dbClient.interestedPartyComment.create({
				data: {
					caseReference: commentData.caseReference,
					serviceUserId: commentData.serviceUserId,
					comment: commentData.comment,
					createdAt: new Date()
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientValidationError) {
				throw ApiError.badRequest(e.message);
			}
			throw e;
		}
	}
}

module.exports = { InterestedPartyCommentRepository };
