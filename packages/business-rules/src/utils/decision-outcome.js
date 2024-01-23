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

module.exports = {
	mapDecisionColour
};
