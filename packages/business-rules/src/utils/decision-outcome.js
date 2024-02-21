const { DECISION_OUTCOME } = require('../constants');

/**
 * Map an appeal decision outcome to it's corresponding tag colour
 *
 * @param {string|undefined} decision
 * @returns {string}
 */
function mapDecisionColour(decision) {
	const decisionColourMap = new Map([
		[DECISION_OUTCOME.ALLOWED, 'green'],
		[DECISION_OUTCOME.DISMISSED, 'orange'],
		[DECISION_OUTCOME.SPLIT_DECISION, 'yellow']
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
	if (!decision || decision === 'invalid') return null;

	const labels = {
		[DECISION_OUTCOME.ALLOWED]: 'Allowed',
		[DECISION_OUTCOME.SPLIT_DECISION]: 'Allowed in part',
		[DECISION_OUTCOME.DISMISSED]: 'Dismissed'
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
	if (!decision || decision === 'invalid') return null;

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
