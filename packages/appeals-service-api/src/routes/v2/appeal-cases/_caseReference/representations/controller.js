const {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	getServiceUsersWithEmails,
	putRepresentation
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const {
	addOwnershipAndSubmissionDetailsToRepresentations,
	checkDocumentAccessByRepresentationOwner
} = require('@pins/common/src/access/representation-ownership');
const { checkDocAccess } = require('@pins/common/src/access/document-access');
const { APPEAL_REPRESENTATION_STATUS } = require('@planning-inspectorate/data-model');

const { AppealCaseRepository } = require('../../repo');
const caseRepo = new AppealCaseRepository();

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

	/** @type { Array<import('@pins/database/src/client/client').AppealToUser> } */
	let appealUserRoles = [];

	// todo: lpaCode scope + middleware
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
	} else {
		try {
			const result = await caseRepo.userCanModifyCase({
				caseReference: caseReference,
				userId: req.auth?.payload.sub
			});
			appealUserRoles = result.roles;
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

		caseWithRepresentations.Representations = await filterRepresentations(
			caseWithRepresentations,
			email,
			isLpa
		);
		caseWithRepresentations.Documents = filterDocuments(
			caseWithRepresentations,
			appealUserRoles,
			req.auth?.payload,
			req.id_token
		);

		res.status(200).send(caseWithRepresentations);
	} catch (error) {
		logger.error(`Failed to get case with representations for ${caseReference}: ${error}`);
		throw error;
	}
}

/**
 * @param {import('./repo').AppealWithRepresentations} caseWithRepresentations
 * @param {string} email
 * @param {boolean} isLpa
 * @returns {Promise<Array<import('@pins/common/src/access/representation-ownership').RepresentationResult>>}
 */
async function filterRepresentations(caseWithRepresentations, email, isLpa) {
	if (
		!caseWithRepresentations.Representations ||
		caseWithRepresentations.Representations.length === 0
	) {
		return [];
	}

	const usersWithEmails = await getServiceUsersWithEmails(
		caseWithRepresentations.caseReference,
		caseWithRepresentations.Representations
	);

	const repsWithOwnership = addOwnershipAndSubmissionDetailsToRepresentations(
		caseWithRepresentations.Representations,
		email,
		isLpa,
		usersWithEmails
	);

	return repsWithOwnership.filter(
		(rep) =>
			rep.userOwnsRepresentation ||
			rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED
	);
}

/**
 * @param {Array<import('@pins/database/src/client/client').Representation>} representations
 * @returns {Map<string, import('@pins/common/src/access/representation-ownership').FlatRepDocOwnership>}
 */
function getRepDocOwnershipMap(representations) {
	return new Map(
		representations.flatMap((rep) =>
			(Array.isArray(rep.RepresentationDocuments) ? rep.RepresentationDocuments : []).map((doc) => [
				doc.documentId,
				{
					representationStatus: rep.representationStatus ?? null,
					documentId: doc.documentId,
					userOwnsRepresentation: rep.userOwnsRepresentation,
					submittingPartyType: rep.submittingPartyType
				}
			])
		)
	);
}

function filterDocuments(caseWithRepresentations, appealUserRoles, access_token, id_token) {
	if (!caseWithRepresentations.Documents || caseWithRepresentations.Documents.length === 0) {
		return caseWithRepresentations.Documents;
	}

	const representationMap = getRepDocOwnershipMap(caseWithRepresentations.Documents);

	const simpleCase = {
		LPACode: caseWithRepresentations.LPACode,
		appealId: caseWithRepresentations.appealId,
		appealTypeCode: caseWithRepresentations.appealTypeCode
	};

	return caseWithRepresentations.Documents.filter((document) =>
		checkDocumentAccessByRepresentationOwner(document, representationMap)
	).filter((document) =>
		checkDocAccess({
			documentWithAppeal: { ...document, AppealCase: simpleCase },
			appealUserRoles: appealUserRoles,
			access_token: access_token,
			id_token: id_token
		})
	);
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
