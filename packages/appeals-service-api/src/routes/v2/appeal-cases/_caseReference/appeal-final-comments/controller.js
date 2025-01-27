const { getFinalComments } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
/**
 * @type {import('express').Handler}
 */
async function getAppealFinalCommentsForCase(req, res) {
	const { caseReference } = req.params;
	const { type } = req.query;
	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}
	if (!type) {
		throw ApiError.withMessage(400, 'comment type lpa, appellant, or rule 6 required');
	}
	try {
		const comments = await getFinalComments(caseReference, type);
		if (!comments || comments.length === 0) {
			throw ApiError.withMessage(404, `No ${type} final comments found for this case reference`);
		}
		res.status(200).json(comments);
	} catch (error) {
		logger.error(`Failed to get appeal final comments: ${error}`);
		throw error;
	}
}
module.exports = { getAppealFinalCommentsForCase };
