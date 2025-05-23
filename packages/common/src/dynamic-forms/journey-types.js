/**
 * @typedef {string} JourneyType
 */

/**
 * @enum {JourneyType}
 */ // todo: duplication
exports.JOURNEY_TYPES = {
	HAS_APPEAL_FORM: 'has-appeal-form',
	HAS_QUESTIONNAIRE: 'has-questionnaire',

	S78_APPEAL_FORM: 's78-appeal-form',
	S78_QUESTIONNAIRE: 's78-questionnaire',

	S20_APPEAL_FORM: 's20-appeal-form',
	S20_LPA_QUESTIONNAIRE: 's20-lpa-questionnaire',

	CAS_PLANNING_APPEAL_FORM: 'cas-planning-appeal-form',
	CAS_PLANNING_QUESTIONNAIRE: 'cas-planning-questionnaire',

	ADVERTS_APPEAL_FORM: 'adverts-appeal-form',
	ADVERTS_QUESTIONNAIRE: 'adverts-questionnaire',

	// todo: rename to not specify S78
	S78_LPA_STATEMENT: 's78-lpa-statement',
	S78_APPELLANT_FINAL_COMMENTS: 's78-appellant-final-comments',
	S78_LPA_FINAL_COMMENTS: 's78-lpa-final-comments',
	S78_APPELLANT_PROOF_EVIDENCE: 's78-appellant-proof-evidence',
	S78_LPA_PROOF_EVIDENCE: 's78-lpa-proof-evidence',
	S78_RULE_6_PROOF_EVIDENCE: 's78-rule-6-proof-evidence',
	S78_RULE_6_STATEMENT: 's78-rule-6-statement'
};
