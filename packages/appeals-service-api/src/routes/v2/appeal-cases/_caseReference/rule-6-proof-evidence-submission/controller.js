const {
	getRule6ProofOfEvidenceByAppealId,
	createRule6ProofOfEvidence,
	patchRule6ProofOfEvidenceByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * @type {import('express').RequestHandler}
 */
async function getRule6ProofOfEvidenceSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await getRule6ProofOfEvidenceByAppealId(userId, req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Proof of evidence not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get proof of evidence: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function createRule6ProofOfEvidenceSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await createRule6ProofOfEvidence(userId, req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create proof of evidence');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create proof of evidence: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function patchRule6ProofOfEvidenceSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await patchRule6ProofOfEvidenceByAppealId(
			userId,
			req.params.caseReference,
			req.body
		);
		if (!content) {
			throw ApiError.withMessage(404, 'Proof of evidence not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update proof of evidence: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
		} else if (error instanceof PrismaClientValidationError) {
			logger.error(`invalid request: ${error.message}`);
			res.status(400).json({ errors: ['Bad request'] });
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getRule6ProofOfEvidenceSubmission,
	createRule6ProofOfEvidenceSubmission,
	patchRule6ProofOfEvidenceSubmission
};
