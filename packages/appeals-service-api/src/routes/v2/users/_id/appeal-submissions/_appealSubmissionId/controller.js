const { getAppealSubmissionForUser } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 * @param {import('express').Request<{ id: string, appealSubmissionId: string }>} req
 */
async function getUserAppealSubmission(req, res) {
	const { id: userId, appealSubmissionId } = req.params;
	try {
		const content = await getAppealSubmissionForUser({ userId, appealSubmissionId });
		if (!content) {
			throw ApiError.userNotFound();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getUserAppealSubmission
};
