const { InterestedPartySubmissionRepository } = require('./repo');
const repo = new InterestedPartySubmissionRepository();
const logger = require('#lib/logger');

/**
 * @typedef {import('@prisma/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import("@prisma/client").Prisma.InterestedPartySubmissionCreateInput} IPSubmissionData
 */

/**
 * Create a new interested party
 *
 * @param {IPSubmissionData} ipSubmissionData
 * @returns {Promise<InterestedPartySubmission>}
 */
async function createInterestedPartySubmission(ipSubmissionData) {
	try {
		return await repo.createInterestedPartySubmission(ipSubmissionData);
	} catch (error) {
		logger.error('Error creating Interested Party Submission', { error });
		throw error;
	}
}

module.exports = { createInterestedPartySubmission };
