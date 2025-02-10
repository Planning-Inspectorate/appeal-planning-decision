const {
	APPEAL_USER_ROLES,
	LPA_USER_ROLE,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');
const { deadlineHasPassed } = require('../../lib/deadline-has-passed');

const { representationExists } = require('../../lib/dashboard-functions');

/**
 * @typedef {import('@pins/common/src/client/appeals-api-client').AppealCaseDetailed} CaseData
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles | "LPAUser" | null} UserRole
 */

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayQuestionnaireDueNotification = (caseData, userType) =>
	userType === LPA_USER_ROLE &&
	!caseData.lpaQuestionnaireSubmittedDate &&
	!!caseData.lpaQuestionnaireDueDate;

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayStatementsDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.statementDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.lpaQuestionnaireDueDate) &&
		!caseData.LPAStatementSubmittedDate &&
		!deadlineHasPassed(caseData.statementDueDate)
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayStatementsDueBannerRule6 = (caseData, userType) => {
	return (
		!!caseData.statementDueDate &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		!!caseData.lpaQuestionnairePublishedDate &&
		!representationExists(caseData.Representations, REPRESENTATION_TYPES.STATEMENT, true) &&
		!deadlineHasPassed(caseData.statementDueDate)
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayFinalCommentsDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.finalCommentsDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.LPACommentsSubmittedDate
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayFinalCommentsDueBannerAppellant = (caseData, userType) => {
	return (
		!!caseData.finalCommentsDueDate &&
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.appellantCommentsSubmittedDate
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerAppellant = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.appellantProofsSubmittedDate
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.LPAProofsSubmittedDate
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerRule6 = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!representationExists(caseData.Representations, REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE, true)
	);
};

module.exports = {
	shouldDisplayQuestionnaireDueNotification,
	shouldDisplayStatementsDueBannerLPA,
	shouldDisplayStatementsDueBannerRule6,
	shouldDisplayFinalCommentsDueBannerLPA,
	shouldDisplayFinalCommentsDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerLPA,
	shouldDisplayProofEvidenceDueBannerRule6
};
