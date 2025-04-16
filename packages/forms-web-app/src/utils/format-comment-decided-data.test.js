const { formatCommentDecidedData } = require('./format-comment-decided-data');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('formatCommentDecidedData', () => {
	const appeal = {
		caseDecisionOutcomeDate: '2024-12-31',
		caseDecisionOutcome: 'allowed',
		Documents: [
			{ documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER, id: 'doc1' },
			{ documentType: 'other', id: 'doc2' }
		]
	};

	it('should return an empty object if caseDecisionOutcomeDate is not provided', () => {
		const appealWithoutDate = { ...appeal, caseDecisionOutcomeDate: undefined };
		expect(formatCommentDecidedData(appealWithoutDate)).toEqual({});
	});

	it('should return formatted data when caseDecisionOutcomeDate is provided', () => {
		const result = formatCommentDecidedData(appeal);
		expect(result).toEqual({
			formattedCaseDecisionDate: '31 Dec 2024',
			formattedDecisionColour: 'green',
			caseDecisionOutcome: 'Allowed',
			decisionDocuments: [{ documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER, id: 'doc1' }]
		});
	});

	it('should return the caseDecisionOutcome as is if it is not in APPEAL_CASE_DECISION_OUTCOME', () => {
		const appealWithUnknownOutcome = { ...appeal, caseDecisionOutcome: 'unknown' };
		const result = formatCommentDecidedData(appealWithUnknownOutcome);
		expect(result.caseDecisionOutcome).toBe('unknown');
	});

	it('should filter decision documents correctly', () => {
		const result = formatCommentDecidedData(appeal);
		expect(result.decisionDocuments).toEqual([
			{ documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER, id: 'doc1' }
		]);
	});
});
