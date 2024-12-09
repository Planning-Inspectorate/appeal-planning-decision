const { getRepresentationsByTypeForCase, getAllRepresentationsForCase } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getRepresentationsForCase(req, res) {
	const { caseReference } = req.params;
	const { type } = req.query;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}

	let representations;

	try {
		if (type) {
			representations = await getRepresentationsByTypeForCase(caseReference, type);
		} else {
			representations = await getAllRepresentationsForCase(caseReference);
		}
		res.status(200).send(representations);
	} catch (error) {
		logger.error(`Failed to get representations for ${caseReference}: ${error}`);
		throw error;
	}
}

module.exports = { getRepresentationsForCase };
