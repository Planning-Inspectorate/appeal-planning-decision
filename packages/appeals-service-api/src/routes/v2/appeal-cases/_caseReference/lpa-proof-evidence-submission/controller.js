const {
	getLpaProofOfEvidenceByAppealId,
	createLpaProofOfEvidence,
	patchLpaProofOfEvidenceByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { Prisma } = require('@pins/database/src/client/client');

/**
 * @type {import('express').RequestHandler}
 */
async function getLpaProofOfEvidenceSubmission(req, res) {
	try {
		const content = await getLpaProofOfEvidenceByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Proof of evidence not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get proof of evidence: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function createLpaProofOfEvidenceSubmission(req, res) {
	try {
		const content = await createLpaProofOfEvidence(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create proof of evidence');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create proof of evidence: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function patchLpaProofOfEvidenceSubmission(req, res) {
	try {
		const content = await patchLpaProofOfEvidenceByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'Proof of evidence not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update proof of evidence: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			logger.error(`invalid request: ${error.message}`);
			res.status(400).send({ errors: ['Bad request'] });
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getLpaProofOfEvidenceSubmission,
	createLpaProofOfEvidenceSubmission,
	patchLpaProofOfEvidenceSubmission
};
