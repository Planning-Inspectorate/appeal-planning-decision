const { APPEAL_CASE_DECISION_OUTCOME } = require('pins-data-model');

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
		[APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, 'orange']
	]);

	return (decision && decisionColourMap.get(decision)) || 'grey';
}

/**
 * Map an appeal decision outcome to it's corresponding tag text
 *
 * @param {string|undefined} decision
 * @returns {string | null}
 */
const mapDecisionLabel = (decision) => {
	if (!decision) return null;

	const labels = {
		[APPEAL_CASE_DECISION_OUTCOME.ALLOWED]: 'Allowed',
		[APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION]: 'Allowed in part',
		[APPEAL_CASE_DECISION_OUTCOME.DISMISSED]: 'Dismissed',
		[APPEAL_CASE_DECISION_OUTCOME.INVALID]: 'Invalid'
	};

	return labels[decision];
};

/**
 * Map an appeal decision outcome to it's corresponding tag text
 *
 * @param {string|undefined} decision
 * @returns {{ color: string, label: string | null } | null}
 */
const mapDecisionTag = (decision) => {
	if (!decision) return null;

	return {
		color: mapDecisionColour(decision),
		label: mapDecisionLabel(decision)
	};
};

module.exports = {
	mapDecisionColour,
	mapDecisionLabel,
	mapDecisionTag
};
