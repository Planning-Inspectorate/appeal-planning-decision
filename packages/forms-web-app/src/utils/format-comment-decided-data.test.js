const {
	formatCommentDecidedData,
	filterDecisionDocuments
} = require('./format-comment-decided-data');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

describe('formatCommentDecidedData', () => {
	const appeal = {
		caseDecisionOutcomeDate: '2024-12-31',
		caseDecisionOutcome: 'allowed'
	};

	it('should return an empty object if caseDecisionOutcomeDate is not provided', () => {
		const appealWithoutDate = { ...appeal, caseDecisionOutcomeDate: undefined };
		expect(formatCommentDecidedData(appealWithoutDate, [])).toEqual({});
	});

	it('should return formatted data when caseDecisionOutcomeDate is provided', () => {
		const result = formatCommentDecidedData(appeal, []);
		expect(result).toEqual({
			formattedCaseDecisionDate: '31 December 2024',
			formattedDecisionColour: 'green',
			caseDecisionOutcome: 'Allowed',
			decisionDocuments: []
		});
	});

	it('should return the caseDecisionOutcome as is if it is not in APPEAL_CASE_DECISION_OUTCOME', () => {
		const appealWithUnknownOutcome = { ...appeal, caseDecisionOutcome: 'unknown' };
		const result = formatCommentDecidedData(appealWithUnknownOutcome, []);
		expect(result.caseDecisionOutcome).toBe('unknown');
	});
});

describe('filterDecisionDocuments', () => {
	const unfilteredDecisionDocuments = [
		{
			documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
			published: true,
			id: 'doc1'
		},
		{ documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER, published: true, id: 'doc2' },
		//not published
		{ documentType: APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER, published: false, id: 'doc3' },
		//not a decision documents
		{ documentType: 'other', id: 'doc4' }
	];

	it('should filter decision documents correctly and return in the correct order', () => {
		const result = filterDecisionDocuments(unfilteredDecisionDocuments);
		expect(result).toEqual([
			{ documentType: APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER, published: true, id: 'doc2' },
			{
				documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
				published: true,
				id: 'doc1'
			}
		]);
	});
});
