const { mapDecisionLabel } = require('./decision-outcome');
const { APPEAL_CASE_DECISION_OUTCOME } = require('@planning-inspectorate/data-model');

describe('utils/decision-outcome', () => {
	describe('mapDecisionLabel', () => {
		it.each([
			[APPEAL_CASE_DECISION_OUTCOME.ALLOWED, 'Allowed'],
			[APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, 'Allowed in part'],
			[APPEAL_CASE_DECISION_OUTCOME.DISMISSED, 'Dismissed'],
			[APPEAL_CASE_DECISION_OUTCOME.INVALID, 'Invalid'],
			[APPEAL_CASE_DECISION_OUTCOME.NOTICE_UPHELD, 'Notice upheld'],
			[APPEAL_CASE_DECISION_OUTCOME.NOTICE_VARIED_AND_UPHELD, 'Notice varied'],
			[APPEAL_CASE_DECISION_OUTCOME.PLANNING_PERMISSION_GRANTED, 'Granted'],
			[APPEAL_CASE_DECISION_OUTCOME.QUASHED_ON_LEGAL_GROUNDS, 'Quashed']
		])(
			'returns the label for decision outcome %s for non-enforcement appeals',
			(decision, expectedLabel) => {
				const result = mapDecisionLabel(decision);
				expect(result).toEqual(expectedLabel);
			}
		);

		it('should handle enforcement split decisions', () => {
			const result = mapDecisionLabel(APPEAL_CASE_DECISION_OUTCOME.SPLIT_DECISION, true);
			expect(result).toEqual('Upheld in part');
		});
	});
});
