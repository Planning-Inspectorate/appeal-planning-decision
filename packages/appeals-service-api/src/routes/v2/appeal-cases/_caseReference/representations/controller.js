const {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	addOwnershipAndSubmissionDetailsToRepresentations,
	putRepresentation
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

const { LPAQuestionnaireSubmissionRepository } = require('../lpa-questionnaire-submission/repo');

const submissionRepo = new LPAQuestionnaireSubmissionRepository();

/**
 * @type {import('express').Handler}
 */
async function getAppealCaseWithRepresentations(req, res) {
	const { caseReference } = req.params;
	const { type } = req.query;
	const { email, lpaCode } = req.id_token;
	const isLpa = !!lpaCode;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}

	if (!email) {
		throw ApiError.withMessage(400, 'logged-in email required');
	}

	if (isLpa) {
		try {
			await submissionRepo.lpaCanModifyCase({
				caseReference: caseReference,
				userLpa: lpaCode
			});
		} catch (error) {
			logger.error({ error }, 'get representations: invalid user access');
			throw ApiError.forbidden();
		}
	}

	/** @type {import('./repo').AppealWithRepresentations} */
	let caseWithRepresentations;

	try {
		if (type) {
			caseWithRepresentations = await getAppealCaseWithRepresentationsByType(caseReference, type);
		} else {
			caseWithRepresentations = await getAppealCaseWithAllRepresentations(caseReference);
		}

		caseWithRepresentations.Representations =
			await addOwnershipAndSubmissionDetailsToRepresentations(
				caseWithRepresentations.Representations,
				caseReference,
				email,
				isLpa
			);
		res.status(200).send(caseWithRepresentations);
	} catch (error) {
		logger.error(`Failed to get case with representations for ${caseReference}: ${error}`);
		throw error;
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function putByRepresentationId(req, res) {
	const { representationId } = req.params;

	if (!representationId) {
		throw ApiError.withMessage(400, 'representation id required');
	}

	try {
		const representation = await putRepresentation(representationId, req.body);
		res.status(200).send(representation);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error(
			{ error: err, representationId },
			'error upserting representation by representation id'
		);
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

module.exports = {
	getAppealCaseWithRepresentations,
	putByRepresentationId
};
