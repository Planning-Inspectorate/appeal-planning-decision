const { APPEAL_USER_ROLES } = require('../constants');
const { FLAG } = require('../feature-flags');
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
 * 	processCode: "HAS" | "S78" | "S20" | "ADVERTS" | "CAS_ADVERTS" | "CAS_PLANNING" | "ENFORCEMENT" | "ENFORCEMENT_LISTED" | "LDC",
 *  friendlyUrl: string,
 *  expedited: boolean,
 *  usesEnforcementContact: boolean,
 *  hasAppellantStatementJourney: boolean,
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
		expedited: true,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	S78: {
		id: 1005,
		key: APPEAL_CASE_TYPE.W,
		type: 'Planning',
		processCode: 'S78',
		friendlyUrl: 'full-planning',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	S20: {
		id: 1006,
		key: APPEAL_CASE_TYPE.Y,
		type: 'Planning listed building and conservation area',
		processCode: 'S20',
		friendlyUrl: 'listed-building',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	ADVERTS: {
		id: 1003,
		key: APPEAL_CASE_TYPE.H,
		type: 'Advertisement',
		processCode: 'ADVERTS',
		friendlyUrl: 'adverts', // shares appeal form with CAS_ADVERTS
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: true
	},
	CAS_ADVERTS: {
		id: 1007,
		key: APPEAL_CASE_TYPE.ZA, // just Z in horizon
		type: 'Commercial advertisement',
		processCode: 'CAS_ADVERTS',
		friendlyUrl: 'adverts', // shares appeal form with ADVERTS
		expedited: true,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	CAS_PLANNING: {
		id: 1008,
		key: APPEAL_CASE_TYPE.ZP, // just Z in horizon
		type: 'Commercial planning (CAS)',
		processCode: 'CAS_PLANNING',
		friendlyUrl: 'cas-planning',
		expedited: true,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	ENFORCEMENT: {
		id: 1000,
		key: APPEAL_CASE_TYPE.C,
		type: 'Enforcement notice',
		processCode: 'ENFORCEMENT',
		friendlyUrl: 'enforcement',
		expedited: false,
		usesEnforcementContact: true,
		hasAppellantStatementJourney: true
	},
	ENFORCEMENT_LISTED: {
		id: 1002,
		key: APPEAL_CASE_TYPE.F,
		type: 'Enforcement listed building and conservation area',
		processCode: 'ENFORCEMENT_LISTED',
		friendlyUrl: 'enforcement-listed-building',
		expedited: false,
		usesEnforcementContact: true,
		hasAppellantStatementJourney: true
	},
	LDC: {
		id: 1012,
		key: APPEAL_CASE_TYPE.X,
		type: 'Lawful development certificate',
		processCode: 'LDC',
		friendlyUrl: 'ldc',
		expedited: false,
		usesEnforcementContact: true,
		hasAppellantStatementJourney: true
	},
	G: {
		id: 1004,
		key: APPEAL_CASE_TYPE.G,
		type: 'Planning obligation',
		processCode: 'G',
		friendlyUrl: 'planning-obligation',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	L: {
		id: 1013,
		key: APPEAL_CASE_TYPE.L,
		type: 'Lawful development certificate (Group C)',
		processCode: 'L',
		friendlyUrl: 'ldc-group-c',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	Q: {
		id: 1014,
		key: APPEAL_CASE_TYPE.Q,
		type: 'Hedgerow replacement',
		processCode: 'Q',
		friendlyUrl: 'hedgerow-replacement',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	TPO: {
		id: 1015,
		key: APPEAL_CASE_TYPE.TPO,
		type: 'Tree preservation order',
		processCode: 'TPO',
		friendlyUrl: 'tree-preservation-order',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	TRN: {
		id: 1016,
		key: APPEAL_CASE_TYPE.TRN,
		type: 'Tree replacement',
		processCode: 'TRN',
		friendlyUrl: 'tree-replacement',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	HH: {
		id: 1017,
		key: APPEAL_CASE_TYPE.HH,
		type: 'High hedges',
		processCode: 'HH',
		friendlyUrl: 'high-hedges',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	HR: {
		id: 1018,
		key: APPEAL_CASE_TYPE.HR,
		type: 'Highways Act',
		processCode: 'HR',
		friendlyUrl: 'highways-act',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	},
	ENV: {
		id: 1019,
		key: APPEAL_CASE_TYPE.ENV,
		type: 'Environmental',
		processCode: 'ENV',
		friendlyUrl: 'environmental',
		expedited: false,
		usesEnforcementContact: false,
		hasAppellantStatementJourney: false
	}
});

const GROUP_C_PROCESS_CODES = Object.freeze(['G', 'L', 'Q', 'TPO', 'TRN', 'HH', 'HR', 'ENV']);

/**
 * @param {any} value value to lookup
 * @param {'processCode'|'id'|'type'} lookupProp property to check
 * @param {Record<string, boolean>} [featureFlags] feature flags to check
 * @returns {CASE_TYPE|undefined} result based on the returnProp
 */
const caseTypeLookup = (value, lookupProp, featureFlags) => {
	// ensure lookup is on a unique value
	if (!['processCode', 'id', 'type', 'key'].includes(lookupProp)) {
		throw new Error(`Invalid lookup property: ${lookupProp}`);
	}

	// handle id as string
	if (lookupProp === 'id' && typeof value === 'string') {
		value = parseInt(value, 10);
	}

	const appeal = Object.values(CASE_TYPES).find((caseType) => caseType[lookupProp] === value);
	if (!appeal) return undefined;

	// modify static data based on current flags
	if (!featureFlags) return appeal;

	// if feature flag is not on, flip advert hasAppellantStatementJourney to false
	if (
		!featureFlags[FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED] &&
		appeal.processCode === CASE_TYPES.ADVERTS.processCode
	) {
		return {
			...appeal,
			hasAppellantStatementJourney: false
		};
	}

	return appeal;
};

/**
 * @type {Object<string, ProcedureTypeCreateInput>}
 */
const PROCEDURE_TYPES = Object.freeze({
	hearing: { key: APPEAL_CASE_PROCEDURE.HEARING, name: 'Hearing' },
	inquiry: { key: APPEAL_CASE_PROCEDURE.INQUIRY, name: 'Inquiry' },
	written: { key: APPEAL_CASE_PROCEDURE.WRITTEN, name: 'Written' },
	writtenPart1: { key: APPEAL_CASE_PROCEDURE.WRITTEN_PART_1, name: 'Written Part 1' }
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
	INVALID: { key: APPEAL_CASE_DECISION_OUTCOME.INVALID, name: 'Invalid' },
	NOTICE_UPHELD: { key: APPEAL_CASE_DECISION_OUTCOME.NOTICE_UPHELD, name: 'Notice upheld' },
	NOTICE_VARIED_AND_UPHELD: {
		key: APPEAL_CASE_DECISION_OUTCOME.NOTICE_VARIED_AND_UPHELD,
		name: 'Notice varied'
	},
	PLANNING_PERMISSION_GRANTED: {
		key: APPEAL_CASE_DECISION_OUTCOME.PLANNING_PERMISSION_GRANTED,
		name: 'Granted'
	},
	QUASHED_ON_LEGAL_GROUNDS: {
		key: APPEAL_CASE_DECISION_OUTCOME.QUASHED_ON_LEGAL_GROUNDS,
		name: 'Quashed'
	}
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
	GROUP_C_PROCESS_CODES,
	caseTypeLookup
};
