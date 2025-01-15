const { APPEAL_USER_ROLES } = require('../constants');
const {
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('pins-data-model');

/**
 * @typedef {import('@prisma/client').Prisma.AppealToUserRoleCreateInput} AppealToUserRoleCreateInput
 * @typedef {import('@prisma/client').Prisma.CaseTypeCreateInput} CaseTypeCreateInput
 * @typedef {import('@prisma/client').Prisma.ProcedureTypeCreateInput} ProcedureTypeCreateInput
 * @typedef {import('@prisma/client').Prisma.LPANotificationMethodsCreateInput} LPANotificationMethodsCreateInput
 * @typedef {import('@prisma/client').Prisma.CaseStatusCreateInput} CaseStatusCreateInput
 * @typedef {import('@prisma/client').Prisma.CaseDecisionOutcomeCreateInput} CaseDecisionOutcomeCreateInput
 * @typedef {import('@prisma/client').Prisma.CaseValidationOutcomeCreateInput} CaseValidationOutcomeCreateInput
 * @typedef {import('@prisma/client').Prisma.LPAQuestionnaireValidationOutcomeCreateInput} LPAQuestionnaireValidationOutcomeCreateInput
 */

/**
 * @type {Object<string, AppealToUserRoleCreateInput>}
 */
const APPEAL_TO_USER_ROLES = {
	appellant: {
		name: APPEAL_USER_ROLES.APPELLANT,
		description: `Appellant is the person who's planning application decision is being appealed`
	},
	agent: {
		name: APPEAL_USER_ROLES.AGENT,
		description: `An agent is a user who submits an appeal on behalf of an appellant`
	},
	interestedParty: {
		name: APPEAL_USER_ROLES.INTERESTED_PARTY,
		description: `An interested party is a user who submits a comment on an appeal`
	},
	rule6Party: {
		name: APPEAL_USER_ROLES.RULE_6_PARTY,
		description: `A rule 6 party is a group who are considered a main party for an appeal`
	}
};

/**
 * @type {Object<string, CaseTypeCreateInput>}
 */
const CASE_TYPES = {
	HAS: { id: 1001, key: APPEAL_CASE_TYPE.D, type: 'Householder', processCode: 'HAS' },
	S78: { id: 1005, key: APPEAL_CASE_TYPE.W, type: 'Full Planning', processCode: 'S78' }
	// { id: 1000, key: 'C', type: 'Enforcement notice appeal' },
	// { id: 1002, key: 'F', type: 'Enforcement listed building and conservation area appeal' },
	// { key: 'G', type: 'Discontinuance notice appeal' },
	// { id: 1003, key: 'H', type: 'Advertisement appeal' },
	// { key: 'L', type: 'Community infrastructure levy' },
	// { id: 1004, key: 'Q', type: 'Planning obligation appeal' },
	// { key: 'S', type: 'Affordable housing obligation appeal' },
	// { key: 'V', type: 'Call-in application' },
	// { key: 'X', type: 'Lawful development certificate appeal' },
	// { id: 1006, key: 'Y', type: 'Planned listed building and conservation area appeal' },
	// { id: 1007, key: 'Z', type: 'Commercial (CAS) appeal' }
};

/**
 * @type {Object<string, ProcedureTypeCreateInput>}
 */
const PROCEDURE_TYPES = {
	hearing: { key: APPEAL_CASE_PROCEDURE.HEARING, name: 'Hearing' },
	inquiry: { key: APPEAL_CASE_PROCEDURE.INQUIRY, name: 'Inquiry' },
	written: { key: APPEAL_CASE_PROCEDURE.WRITTEN, name: 'Written' }
};

/**
 * @type {Object<string, LPANotificationMethodsCreateInput>}
 */
const LPA_NOTIFICATION_METHODS = {
	notice: { key: 'notice', name: 'A site notice' },
	letter: { key: 'letter', name: 'Letter/email to interested parties' },
	pressAdvert: { key: 'advert', name: 'A press advert' }
};

/**
 * @type {Object<string, CaseStatusCreateInput>}
 */
const CASE_STATUSES = {
	ASSIGN_CASE_OFFICER: { key: APPEAL_CASE_STATUS.ASSIGN_CASE_OFFICER, name: 'Assign case officer' },
	AWAITING_TRANSFER: { key: APPEAL_CASE_STATUS.AWAITING_TRANSFER, name: 'Awaiting transfer' },
	CLOSED: { key: APPEAL_CASE_STATUS.CLOSED, name: 'Closed' },
	COMPLETE: { key: APPEAL_CASE_STATUS.COMPLETE, name: 'Complete' },
	EVIDENCE: { key: APPEAL_CASE_STATUS.EVIDENCE, name: 'Evidence' },
	FINAL_COMMENTS: { key: APPEAL_CASE_STATUS.FINAL_COMMENTS, name: 'Final Comments' },
	INVALID: { key: APPEAL_CASE_STATUS.INVALID, name: 'Invalid' },
	ISSUE_DETERMINATION: { key: APPEAL_CASE_STATUS.ISSUE_DETERMINATION, name: 'Issue Determination' },
	LPA_QUESTIONNAIRE: { key: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, name: 'LPA Questionnaire' },
	READY_TO_START: { key: APPEAL_CASE_STATUS.READY_TO_START, name: 'Ready to start' },
	STATEMENTS: { key: APPEAL_CASE_STATUS.STATEMENTS, name: 'Statements' },
	TRANSFERRED: { key: APPEAL_CASE_STATUS.TRANSFERRED, name: 'Transferred' },
	VALIDATION: { key: APPEAL_CASE_STATUS.VALIDATION, name: 'Validation' },
	WITHDRAWN: { key: APPEAL_CASE_STATUS.WITHDRAWN, name: 'Withdrawn' },
	WITNESSES: { key: APPEAL_CASE_STATUS.WITNESSES, name: 'Witnesses' }
};

/**
 * @type {Object<string, CaseDecisionOutcomeCreateInput>}
 */
const CASE_OUTCOMES = {
	ALLOWED: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED, name: 'Allowed' },
	SPLIT_DECISION: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, name: 'Split decision' },
	DISMISSED: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED, name: 'Dismissed' },
	INVALID: { key: APPEAL_CASE_DECISION_OUTCOME.INVALID, name: 'Invalid' }
};

/**
 * @type {Object<string, CaseValidationOutcomeCreateInput>}
 */
const CASE_VALIDATION_OUTCOMES = {
	INCOMPLETE: { key: APPEAL_CASE_VALIDATION_OUTCOME.INCOMPLETE, name: 'Incomplete' },
	INVALID: { key: APPEAL_CASE_VALIDATION_OUTCOME.INVALID, name: 'Invalid' },
	VALID: { key: APPEAL_CASE_VALIDATION_OUTCOME.VALID, name: 'Valid' }
};

/**
 * @type {Object<string, LPAQuestionnaireValidationOutcomeCreateInput>}
 */
const LPAQ_VALIDATION_OUTCOMES = {
	COMPLETE: { key: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE, name: 'Complete' },
	INCOMPLETE: { key: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.INCOMPLETE, name: 'Incomplete' }
};

/**
 * @type {Object<string, 'linked'|'nearby'>}
 */
const CASE_RELATION_TYPES = {
	linked: 'linked',
	nearby: 'nearby'
};

/**
 * @type {Object<string, 'affected'|'changed'>}
 */
const LISTED_RELATION_TYPES = {
	affected: 'affected',
	changed: 'changed'
};

module.exports = {
	APPEAL_TO_USER_ROLES,
	CASE_TYPES,
	PROCEDURE_TYPES,
	LPA_NOTIFICATION_METHODS,
	CASE_STATUSES,
	CASE_OUTCOMES,
	CASE_VALIDATION_OUTCOMES,
	LPAQ_VALIDATION_OUTCOMES,
	CASE_RELATION_TYPES,
	LISTED_RELATION_TYPES
};
