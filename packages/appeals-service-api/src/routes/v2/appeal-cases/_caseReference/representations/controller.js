const {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getAppealCaseWithRepresentations(req, res) {
	const { caseReference } = req.params;
	const { type } = req.query;

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
		res.status(200).send(caseWithRepresentations);
	} catch (error) {
		logger.error(`Failed to get case with representations for ${caseReference}: ${error}`);
		throw error;
	}
}

module.exports = { getAppealCaseWithRepresentations };
