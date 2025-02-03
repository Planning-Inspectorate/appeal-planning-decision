// const {
// 	// getDocuments
// } = require('../utils');
const { APPEAL_REPRESENTATION_TYPE } = require('pins-data-model');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('@pins/common/src/constants').RepresentationTypes} RepresentationTypes
 * @typedef {'appellantFinalCommentDetails' | 'lpaFinalCommentDetails' | 'lpaStatement' | 'rule6Statement'} AllowedRepresentationField
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentationSubmission} AppealRepresentationSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantFinalCommentSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} AppellantFinalCommentSubmission
 * @typedef {import('@prisma/client').Prisma.LPAFinalCommentSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} LPAFinalCommentSubmission
 * @typedef {import('@prisma/client').Prisma.LPAStatementSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} LPAStatementSubmission
 * @typedef {import('@prisma/client').Prisma.Rule6StatementSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} Rule6StatementSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantProofOfEvidenceSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} AppellantProofOfEvidenceSubmission
 * @typedef {import('@prisma/client').Prisma.LPAProofOfEvidenceSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} LPAProofOfEvidenceSubmission
 * @typedef {import('@prisma/client').Prisma.Rule6ProofOfEvidenceSubmissionGetPayload<{include: {AppealCase: {select: {LPACode: true}}}}>} Rule6ProofOfEvidenceSubmission
 * @typedef {(AppellantFinalCommentSubmission | LPAFinalCommentSubmission | LPAStatementSubmission | Rule6StatementSubmission | AppellantProofOfEvidenceSubmission | LPAProofOfEvidenceSubmission | Rule6ProofOfEvidenceSubmission) & Record<AllowedRepresentationField, string|null>} TypedRepresentationSubmission
 */

/**
 * @type {Partial<Record<RepresentationTypes, Record<string, AllowedRepresentationField>>>}
 */
const REPRESENTATION_FIELDS = {
	[APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT]: {
		[APPEAL_USER_ROLES.APPELLANT]: 'appellantFinalCommentDetails',
		[LPA_USER_ROLE]: 'lpaFinalCommentDetails'
	},
	[APPEAL_REPRESENTATION_TYPE.STATEMENT]: {
		[LPA_USER_ROLE]: 'lpaStatement',
		[APPEAL_USER_ROLES.RULE_6_PARTY]: 'rule6Statement'
	}
};

/**
 * @param {string} caseReference
 * @param {string | null} serviceUserId
 * @param {RepresentationTypes} repType
 * @param {TypedRepresentationSubmission} representationSubmission
 * @returns {Promise<AppealRepresentationSubmission>}
 */
exports.formatter = async (caseReference, serviceUserId, repType, representationSubmission) => {
	if (!representationSubmission)
		throw new Error(`Representation submission could not be formatted`);

	let party;
	let lpaCode;
	if (!serviceUserId) {
		lpaCode = representationSubmission.AppealCase.LPACode;
		party = LPA_USER_ROLE;
	} else if (serviceUserId && repType === APPEAL_REPRESENTATION_TYPE.STATEMENT) {
		party = APPEAL_USER_ROLES.RULE_6_PARTY;
	} else {
		party = APPEAL_USER_ROLES.APPELLANT;
	}

	let representationText = null;
	if (repType !== APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE) {
		const representationField = REPRESENTATION_FIELDS[repType]?.[party] || null;
		if (representationField && Object.hasOwn(representationSubmission, representationField)) {
			representationText = representationSubmission[representationField];
		}
	}

	return {
		caseData: {
			caseReference: caseReference,
			representation: representationText,
			representationSubmittedDate: new Date().toISOString(),
			representationType: repType,
			serviceUserId: serviceUserId || null,
			lpaCode: lpaCode || null,
			newUser: null, // to be updated for IP comment
			documents: []
		}
	};
};
