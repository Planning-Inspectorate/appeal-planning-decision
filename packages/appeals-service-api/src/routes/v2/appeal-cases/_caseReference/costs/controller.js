const { getAppealCaseWithCostsByType } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { checkDocAccess } = require('@pins/common/src/access/document-access');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

const { AppealCaseRepository } = require('../../repo');
const caseRepo = new AppealCaseRepository();

const { LPAQuestionnaireSubmissionRepository } = require('../lpa-questionnaire-submission/repo');
const submissionRepo = new LPAQuestionnaireSubmissionRepository();

/**
 * @type {import('express').Handler}
 */
async function getAppealCaseWithCosts(req, res) {
	const { caseReference } = req.params;
	const { types } = req.query;
	const { email, lpaCode } = req.id_token;
	const isLpa = !!lpaCode;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference required');
	}

	if (!types) {
		throw ApiError.withMessage(400, 'cost types required');
	}
	const validCostTypes = new Set([
		APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION,
		APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE,
		APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
		APPEAL_DOCUMENT_TYPE.LPA_COSTS_WITHDRAWAL,
		APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
		APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE,
		APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
		APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_WITHDRAWAL
	]);
	const typesToSearch = types.split(',');
	if (!typesToSearch.every((type) => validCostTypes.has(type))) {
		throw ApiError.withMessage(400, 'invalid cost type(s) provided');
	}

	if (!email) {
		throw ApiError.withMessage(400, 'logged-in email required');
	}

	/** @type { Array<import('@pins/database/src/client/client').AppealToUser> } */
	let appealUserRoles = [];

	if (isLpa) {
		try {
			await submissionRepo.lpaCanModifyCase({
				caseReference: caseReference,
				userLpa: lpaCode
			});
		} catch (error) {
			logger.error({ error }, 'get costs: invalid user access');
			throw ApiError.forbidden();
		}
	} else {
		try {
			const result = await caseRepo.userCanModifyCase({
				caseReference: caseReference,
				userId: req.auth?.payload.sub
			});
			appealUserRoles = result.roles;
		} catch (error) {
			logger.error({ error }, 'get costs: invalid user access');
			throw ApiError.forbidden();
		}
	}

	try {
		const caseWithCosts = await getAppealCaseWithCostsByType(caseReference, typesToSearch);

		caseWithCosts.Documents = filterDocuments(
			caseWithCosts,
			appealUserRoles,
			req.auth?.payload,
			req.id_token
		);

		res.status(200).send(caseWithCosts);
	} catch (error) {
		logger.error(`Failed to get case with costs for ${caseReference}: ${error}`);
		throw error;
	}
}

function filterDocuments(caseWithCosts, appealUserRoles, access_token, id_token) {
	if (!caseWithCosts.Documents || caseWithCosts.Documents.length === 0) {
		return caseWithCosts.Documents;
	}

	const simpleCase = {
		LPACode: caseWithCosts.LPACode,
		appealId: caseWithCosts.appealId,
		appealTypeCode: caseWithCosts.appealTypeCode
	};

	return caseWithCosts.Documents.filter((document) =>
		checkDocAccess({
			documentWithAppeal: { ...document, AppealCase: simpleCase },
			appealUserRoles: appealUserRoles,
			access_token: access_token,
			id_token: id_token
		})
	);
}

module.exports = {
	getAppealCaseWithCosts
};
