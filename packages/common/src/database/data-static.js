const { APPEAL_USER_ROLES } = require('../constants');
const {
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_TYPE,
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_STATUS,
	APPEAL_CASE_VALIDATION_OUTCOME,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealToUserRoleCreateInput} AppealToUserRoleCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.CaseTypeCreateInput} CaseTypeCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.ProcedureTypeCreateInput} ProcedureTypeCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.LPANotificationMethodsCreateInput} LPANotificationMethodsCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.CaseStatusCreateInput} CaseStatusCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.CaseDecisionOutcomeCreateInput} CaseDecisionOutcomeCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.CaseValidationOutcomeCreateInput} CaseValidationOutcomeCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.LPAQuestionnaireValidationOutcomeCreateInput} LPAQuestionnaireValidationOutcomeCreateInput
 * @typedef {CaseTypeCreateInput & {
 * 	processCode: "HAS" | "S78" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING" | "ENFORCEMENT"
 *  friendlyUrl: string,
 *  expedited: boolean
 * }} CASE_TYPE
 */

/**
 * @type {Object<string, AppealToUserRoleCreateInput>}
 */
const APPEAL_TO_USER_ROLES = Object.freeze({
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
});

/**
 * @type {Object<string, CASE_TYPE>}
 */
const CASE_TYPES = Object.freeze({
	HAS: {
		id: 1001,
		key: APPEAL_CASE_TYPE.D,
		type: 'Householder',
		processCode: 'HAS',
		friendlyUrl: 'householder',
		expedited: true
	},
	S78: {
		id: 1005,
		key: APPEAL_CASE_TYPE.W,
		type: 'Planning',
		processCode: 'S78',
		friendlyUrl: 'full-planning',
		expedited: false
	},
	S20: {
		id: 1006,
		key: APPEAL_CASE_TYPE.Y,
		type: 'Planning listed building and conservation area',
		processCode: 'S20',
		friendlyUrl: 'listed-building',
		expedited: false
	},
	ADVERTS: {
		id: 1003,
		key: APPEAL_CASE_TYPE.H,
		type: 'Advertisement',
		processCode: 'ADVERTS',
		friendlyUrl: 'adverts', // shares appeal form with CAS_ADVERTS
		expedited: false
	},
	CAS_ADVERTS: {
		id: 1007,
		key: APPEAL_CASE_TYPE.ZA, // just Z in horizon
		type: 'Commercial advertisement',
		processCode: 'CAS_ADVERTS',
		friendlyUrl: 'adverts', // shares appeal form with ADVERTS
		expedited: true
	},
	CAS_PLANNING: {
		id: 1008,
		key: APPEAL_CASE_TYPE.ZP, // just Z in horizon
		type: 'Commercial planning (CAS)',
		processCode: 'CAS_PLANNING',
		friendlyUrl: 'cas-planning',
		expedited: true
	},
	ENFORCEMENT: {
		id: 1000,
		key: APPEAL_CASE_TYPE.C,
		type: 'Enforcement notice',
		processCode: 'ENFORCEMENT',
		friendlyUrl: 'enforcement',
		expedited: false
	}
	// { id: 1002, key: 'F', type: 'Enforcement listed building and conservation area appeal' },
	// { key: 'G', type: 'Discontinuance notice appeal' },
	// { key: 'L', type: 'Community infrastructure levy' },
	// { id: 1004, key: 'Q', type: 'Planning obligation appeal' },
	// { key: 'S', type: 'Affordable housing obligation appeal' },
	// { key: 'V', type: 'Call-in application' },
	// { key: 'X', type: 'Lawful development certificate appeal' },
});

/**
 * @param {any} value value to lookup
 * @param {'processCode'|'id'|'type'} lookupProp property to check
 * @returns {CASE_TYPE|undefined} result based on the returnProp
 */
const caseTypeLookup = (value, lookupProp) => {
	// ensure lookup is on a unique value
	if (!['processCode', 'id', 'type', 'key'].includes(lookupProp)) {
		throw new Error(`Invalid lookup property: ${lookupProp}`);
	}

	// handle id as string
	if (lookupProp === 'id' && typeof value === 'string') {
		value = parseInt(value, 10);
	}

	return Object.values(CASE_TYPES).find((caseType) => caseType[lookupProp] === value);
};

/**
 * @type {Object<string, ProcedureTypeCreateInput>}
 */
const PROCEDURE_TYPES = Object.freeze({
	hearing: { key: APPEAL_CASE_PROCEDURE.HEARING, name: 'Hearing' },
	inquiry: { key: APPEAL_CASE_PROCEDURE.INQUIRY, name: 'Inquiry' },
	written: { key: APPEAL_CASE_PROCEDURE.WRITTEN, name: 'Written' }
});

/**
 * @type {Object<string, LPANotificationMethodsCreateInput>}
 */
const LPA_NOTIFICATION_METHODS = Object.freeze({
	notice: { key: 'notice', name: 'A site notice' },
	letter: { key: 'letter', name: 'Letter/email to interested parties' },
	pressAdvert: { key: 'advert', name: 'A press advert' }
});

/**
 * @type {Object<string, CaseStatusCreateInput>}
 */
const CASE_STATUSES = Object.freeze({
	ASSIGN_CASE_OFFICER: { key: APPEAL_CASE_STATUS.ASSIGN_CASE_OFFICER, name: 'Assign case officer' },
	AWAITING_EVENT: { key: APPEAL_CASE_STATUS.AWAITING_EVENT, name: 'Awaiting event' },
	AWAITING_TRANSFER: { key: APPEAL_CASE_STATUS.AWAITING_TRANSFER, name: 'Awaiting transfer' },
	CLOSED: { key: APPEAL_CASE_STATUS.CLOSED, name: 'Closed' },
	COMPLETE: { key: APPEAL_CASE_STATUS.COMPLETE, name: 'Complete' },
	EVENT: { key: APPEAL_CASE_STATUS.EVENT, name: 'Event' },
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
});

/**
 * @type {Object<string, CaseDecisionOutcomeCreateInput>}
 */
const CASE_OUTCOMES = Object.freeze({
	ALLOWED: { key: APPEAL_CASE_DECISION_OUTCOME.ALLOWED, name: 'Allowed' },
	SPLIT_DECISION: { key: APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, name: 'Split decision' },
	DISMISSED: { key: APPEAL_CASE_DECISION_OUTCOME.DISMISSED, name: 'Dismissed' },
	INVALID: { key: APPEAL_CASE_DECISION_OUTCOME.INVALID, name: 'Invalid' }
});

/**
 * @type {Object<string, CaseValidationOutcomeCreateInput>}
 */
const CASE_VALIDATION_OUTCOMES = Object.freeze({
	INCOMPLETE: { key: APPEAL_CASE_VALIDATION_OUTCOME.INCOMPLETE, name: 'Incomplete' },
	INVALID: { key: APPEAL_CASE_VALIDATION_OUTCOME.INVALID, name: 'Invalid' },
	VALID: { key: APPEAL_CASE_VALIDATION_OUTCOME.VALID, name: 'Valid' }
});

/**
 * @type {Object<string, LPAQuestionnaireValidationOutcomeCreateInput>}
 */
const LPAQ_VALIDATION_OUTCOMES = Object.freeze({
	COMPLETE: { key: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE, name: 'Complete' },
	INCOMPLETE: { key: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.INCOMPLETE, name: 'Incomplete' }
});

/**
 * @type {Object<string, 'linked'|'nearby'>}
 */
const CASE_RELATION_TYPES = Object.freeze({
	linked: 'linked',
	nearby: 'nearby'
});

/**
 * @type {Object<string, 'affected'|'changed'>}
 */
const LISTED_RELATION_TYPES = Object.freeze({
	affected: 'affected',
	changed: 'changed'
});

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
	LISTED_RELATION_TYPES,
	caseTypeLookup
};
