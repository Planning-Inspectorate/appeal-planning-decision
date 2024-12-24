const {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	filterRule6Representations
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getAppealCaseWithRepresentations(req, res) {
	const userId = req.auth.payload.sub;

	const { caseReference } = req.params;
	const { type, rule6Parties } = req.query;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}

	let caseWithRepresentations;

	try {
		if (type) {
			// @ts-ignore
			caseWithRepresentations = await getAppealCaseWithRepresentationsByType(caseReference, type);
		} else {
			caseWithRepresentations = await getAppealCaseWithAllRepresentations(caseReference);
		}
	} catch (error) {
		logger.error(`Failed to get case with representations for ${caseReference}: ${error}`);
		throw error;
	}

	// @ts-ignore
	const result = rule6Parties
		? filterRule6Representations(caseWithRepresentations, userId, rule6Parties)
		: caseWithRepresentations;

	res.status(200).send(result);
}

module.exports = { getAppealCaseWithRepresentations };
