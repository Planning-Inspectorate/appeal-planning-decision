const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { deadlineHasPassed } = require('../../lib/deadline-has-passed');

/**
 * @typedef {import('@pins/common/src/client/appeals-api-client').AppealCaseWithRule6Parties} CaseData
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
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.lpaQuestionnaireDueDate) &&
		!caseData.LPAStatementSubmitted &&
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
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		!!caseData.lpaQuestionnairePublishedDate &&
		!caseData.rule6StatementSubmitted &&
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
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.lpaFinalCommentsPublished
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayFinalCommentsDueBannerAppellant = (caseData, userType) => {
	return (
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.appellantFinalCommentsSubmitted
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerAppellant = (caseData, userType) => {
	return (
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.appellantsProofsSubmitted
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerLPA = (caseData, userType) => {
	return (
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.lpaProofEvidenceSubmitted
	);
};

/**
 * @param {CaseData} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerRule6 = (caseData, userType) => {
	return (
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.rule6ProofEvidenceSubmitted
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
