const { APPEAL_CASE_STATUS, APPEAL_REPRESENTATION_TYPE } = require('pins-data-model');
const { deadlineHasPassed } = require('@pins/common/src/lib/deadline-has-passed');
const { representationExists } = require('@pins/common/src/lib/representations');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles | "LPAUser" | null} UserRole
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 */

/**
 * questionnaire is open for LPA
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isLPAQuestionnaireOpen = (appealCaseData) =>
	!!appealCaseData.lpaQuestionnaireDueDate && !appealCaseData.lpaQuestionnaireSubmittedDate;

/**
 * questionnaire is due for LPA
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isLPAQuestionnaireDue = (appealCaseData) =>
	exports.isLPAQuestionnaireOpen(appealCaseData) &&
	appealCaseData.caseStatus === APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE;

/**
 * Checks appeal is in statement stage
 * the deadline has not passed
 * we are in statement stage | the lpaq due date has already gone | the lpaq has been published
 * more than APPEAL_CASE_STATUS.STATEMENTS as there are internal stages in-between lpaq and statements
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const statementsAreOpen = (appealCaseData) =>
	!!appealCaseData.statementDueDate &&
	!deadlineHasPassed(appealCaseData.statementDueDate) &&
	(appealCaseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS ||
		deadlineHasPassed(appealCaseData.lpaQuestionnaireDueDate) ||
		!!appealCaseData.lpaQuestionnaireValidationOutcomeDate);

/**
 * statement is open for LPA
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isLPAStatementOpen = (appealCaseData) =>
	statementsAreOpen(appealCaseData) && !appealCaseData.LPAStatementSubmittedDate;

/**
 * Checks if statements are open for all rule 6 parties
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isRule6StatementOpen = (appealCaseData) =>
	statementsAreOpen(appealCaseData) &&
	!representationExists(appealCaseData.Representations, APPEAL_REPRESENTATION_TYPE.STATEMENT, true);

/**
 * Checks appeal is in proofs stage
 * the deadline has not passed
 * we are in EVIDENCE stage
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const proofsAreOpen = (appealCaseData) =>
	!!appealCaseData.proofsOfEvidenceDueDate &&
	!deadlineHasPassed(appealCaseData.proofsOfEvidenceDueDate) &&
	appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE;

/**
 * proofs is open for appellant
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isAppellantProofsOfEvidenceOpen = (appealCaseData) =>
	proofsAreOpen(appealCaseData) && !appealCaseData.appellantProofsSubmittedDate;

/**
 * proofs is open for LPA
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isLPAProofsOfEvidenceOpen = (appealCaseData) =>
	proofsAreOpen(appealCaseData) && !appealCaseData.LPAProofsSubmittedDate;

/**
 * proofs are open for all rule 6 parties
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isRule6ProofsOfEvidenceOpen = (appealCaseData) =>
	proofsAreOpen(appealCaseData) &&
	!representationExists(
		appealCaseData.Representations,
		APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
		true
	);

/**
 * checks if final comments are open
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const finalCommentsAreOpen = (appealCaseData) =>
	!deadlineHasPassed(appealCaseData.finalCommentsDueDate) &&
	appealCaseData.caseStatus === APPEAL_CASE_STATUS.FINAL_COMMENTS;

/**
 * final comment is open for appellant
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isAppellantFinalCommentOpen = (appealCaseData) =>
	finalCommentsAreOpen(appealCaseData) && !appealCaseData.appellantCommentsSubmittedDate;

/**
 * final comment is open for LPA
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
exports.isLPAFinalCommentOpen = (appealCaseData) =>
	finalCommentsAreOpen(appealCaseData) && !appealCaseData.LPACommentsSubmittedDate;
