// todo: combine with packages/forms-web-app/src/journeys/index.js

const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');
const { CASE_TYPES } = require('../database/data-static');

/**
 * @typedef {string} JourneyType
 * @typedef {{
 *   id: string,
 *   type: JourneyType,
 *   userType: import('../constants').AppealToUserRoles|import('../constants').LpaUserRole
 *   caseType: string|undefined
 * }} JourneyTypesDefinition
 */

/**
 * @enum {JourneyType}
 */
exports.JOURNEY_TYPE = Object.freeze({
	appealForm: 'appealForm',
	questionnaire: 'questionnaire',
	statement: 'statement',
	finalComments: 'finalComments',
	proofEvidence: 'proofEvidence'
});

/**
 * @type {Object<string, JourneyTypesDefinition>}
 */
exports.JOURNEY_TYPES = Object.freeze({
	HAS_APPEAL_FORM: {
		id: 'has-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.HAS.processCode
	},
	HAS_QUESTIONNAIRE: {
		id: 'has-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.HAS.processCode
	},
	S78_APPEAL_FORM: {
		id: 's78-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.S78.processCode
	},
	S78_QUESTIONNAIRE: {
		id: 's78-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.S78.processCode
	},
	S20_APPEAL_FORM: {
		id: 's20-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.S20.processCode
	},
	S20_LPA_QUESTIONNAIRE: {
		id: 's20-lpa-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.S20.processCode
	},
	CAS_PLANNING_APPEAL_FORM: {
		id: 'cas-planning-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.CAS_PLANNING.processCode
	},
	CAS_PLANNING_QUESTIONNAIRE: {
		id: 'cas-planning-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.CAS_PLANNING.processCode
	},
	CAS_ADVERTS_QUESTIONNAIRE: {
		id: 'cas-adverts-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.CAS_ADVERTS.processCode
	},
	ADVERTS_APPEAL_FORM: {
		id: 'adverts-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.ADVERTS.processCode
	},
	CAS_ADVERTS_APPEAL_FORM: {
		id: 'adverts-appeal-form',
		type: exports.JOURNEY_TYPE.appealForm,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: CASE_TYPES.CAS_ADVERTS.processCode
	},
	ADVERTS_QUESTIONNAIRE: {
		id: 'adverts-questionnaire',
		type: exports.JOURNEY_TYPE.questionnaire,
		userType: LPA_USER_ROLE,
		caseType: CASE_TYPES.ADVERTS.processCode
	},
	// todo: remove s78 from name if possible so more obvious can be shared between appeal types
	LPA_STATEMENT: {
		id: 's78-lpa-statement',
		type: exports.JOURNEY_TYPE.statement,
		userType: LPA_USER_ROLE,
		caseType: undefined
	},
	RULE_6_STATEMENT: {
		id: 's78-rule-6-statement',
		type: exports.JOURNEY_TYPE.statement,
		userType: APPEAL_USER_ROLES.RULE_6_PARTY,
		caseType: undefined
	},
	APPELLANT_PROOF_EVIDENCE: {
		id: 's78-appellant-proof-evidence',
		type: exports.JOURNEY_TYPE.proofEvidence,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: undefined
	},
	LPA_PROOF_EVIDENCE: {
		id: 's78-lpa-proof-evidence',
		type: exports.JOURNEY_TYPE.proofEvidence,
		userType: LPA_USER_ROLE,
		caseType: undefined
	},
	RULE_6_PROOF_EVIDENCE: {
		id: 's78-rule-6-proof-evidence',
		type: exports.JOURNEY_TYPE.proofEvidence,
		userType: APPEAL_USER_ROLES.RULE_6_PARTY,
		caseType: undefined
	},
	APPELLANT_FINAL_COMMENTS: {
		id: 's78-appellant-final-comments',
		type: exports.JOURNEY_TYPE.finalComments,
		userType: APPEAL_USER_ROLES.APPELLANT,
		caseType: undefined
	},
	LPA_FINAL_COMMENTS: {
		id: 's78-lpa-final-comments',
		type: exports.JOURNEY_TYPE.finalComments,
		userType: LPA_USER_ROLE,
		caseType: undefined
	}
});

/**
 * @param {string} journeyId
 * @returns {JourneyTypesDefinition|undefined}
 */
exports.getJourneyTypeById = (journeyId) =>
	Object.values(exports.JOURNEY_TYPES).find((x) => x.id === journeyId);
