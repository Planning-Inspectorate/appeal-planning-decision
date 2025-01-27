const {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	addOwnershipAndSubmissionDetailsToRepresentations
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

	let caseWithRepresentations;

	try {
		if (type) {
			// @ts-ignore
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
		res.status(200).json(caseWithRepresentations);
	} catch (error) {
		logger.error(`Failed to get case with representations for ${caseReference}: ${error}`);
		throw error;
	}
}

module.exports = { getAppealCaseWithRepresentations };
