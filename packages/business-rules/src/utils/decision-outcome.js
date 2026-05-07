const { APPEAL_CASE_DECISION_OUTCOME } = require('@planning-inspectorate/data-model');

/**
 * Map an appeal decision outcome to it's corresponding tag colour
 *
 * @param {string|undefined} decision
 * @returns {string}
 */
function mapDecisionColour(decision) {
	const decisionColourMap = new Map([
		[APPEAL_CASE_DECISION_OUTCOME.ALLOWED, 'green'],
		[APPEAL_CASE_DECISION_OUTCOME.DISMISSED, 'yellow'],
		[APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, 'orange'],
		[APPEAL_CASE_DECISION_OUTCOME.NOTICE_UPHELD, 'yellow'],
		[APPEAL_CASE_DECISION_OUTCOME.NOTICE_VARIED_AND_UPHELD, 'yellow'],
		[APPEAL_CASE_DECISION_OUTCOME.PLANNING_PERMISSION_GRANTED, 'green'],
		[APPEAL_CASE_DECISION_OUTCOME.QUASHED_ON_LEGAL_GROUNDS, 'green']
	]);

	return (decision && decisionColourMap.get(decision)) || 'grey';
}

/**
 * Map an appeal decision outcome to it's corresponding tag text
 *
 * @param {string|undefined} decision
 * @param {boolean} isEnforcement
 * @returns {string | null}
 */
const mapDecisionLabel = (decision, isEnforcement = false) => {
	if (!decision) return null;

	const labels = {
		[APPEAL_CASE_DECISION_OUTCOME.ALLOWED]: 'Allowed',
		[APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION]: 'Allowed in part',
		[APPEAL_CASE_DECISION_OUTCOME.DISMISSED]: 'Dismissed',
		[APPEAL_CASE_DECISION_OUTCOME.INVALID]: 'Invalid',
		[APPEAL_CASE_DECISION_OUTCOME.NOTICE_UPHELD]: 'Notice upheld',
		[APPEAL_CASE_DECISION_OUTCOME.NOTICE_VARIED_AND_UPHELD]: 'Notice varied',
		[APPEAL_CASE_DECISION_OUTCOME.PLANNING_PERMISSION_GRANTED]: 'Granted',
		[APPEAL_CASE_DECISION_OUTCOME.QUASHED_ON_LEGAL_GROUNDS]: 'Quashed'
	};

	if (isEnforcement && decision === APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION) {
		return 'Upheld in part';
	}

	return labels[decision];
};

/**
 * Map an appeal decision outcome to it's corresponding tag text
 *
 * @param {string|undefined} decision
 * @param {boolean} isEnforcement
 * @returns {{ color: string, label: string | null } | null}
 */
const mapDecisionTag = (decision, isEnforcement = false) => {
	if (!decision) return null;

	return {
		color: mapDecisionColour(decision),
		label: mapDecisionLabel(decision, isEnforcement)
	};
};

module.exports = {
	mapDecisionColour,
	mapDecisionLabel,
	mapDecisionTag
};
