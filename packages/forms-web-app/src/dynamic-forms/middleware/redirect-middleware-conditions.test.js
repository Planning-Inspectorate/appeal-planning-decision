const { JourneyResponse } = require('../journey-response');
const {
	skipIfNoAdditionalDocuments,
	appellantFinalCommentSkipConditions,
	lpaFinalCommentSkipConditions
} = require('./redirect-middleware-conditions');

describe('redirectMiddleWareConditions middleware', () => {
	describe('skipIfNoAdditionalDocuments', () => {
		it('returns true if condition met', () => {
			const journeyResponse = new JourneyResponse(
				's78-lpa-statement',
				'0000001',
				{
					additionalDocuments: null
				},
				'Q9999'
			);
			const question = {
				fieldName: 'uploadLpaStatementDocuments'
			};
			expect(skipIfNoAdditionalDocuments(question, journeyResponse)).toBe(true);
		});

		it('returns false if condition not met', () => {
			const journeyResponse = new JourneyResponse(
				's78-lpa-statement',
				'0000002',
				{
					additionalDocuments: 'yes'
				},
				'Q9999'
			);
			const question = {
				fieldName: 'uploadLpaStatementDocuments'
			};
			expect(skipIfNoAdditionalDocuments(question, journeyResponse)).toBe(false);
		});
	});

	describe('appellantFinalCommentSkipConditions', () => {
		it('returns true if conditions met', () => {
			const journeyResponse1 = new JourneyResponse(
				's78-appellant-final-comments',
				'0000001',
				{
					appellantFinalComment: null,
					appellantFinalCommentDocuments: null
				},
				'Q9999'
			);
			const question1 = {
				fieldName: 'appellantFinalCommentDetails'
			};
			const question2 = {
				fieldName: 'appellantFinalCommentDocuments'
			};
			const question3 = {
				fieldName: 'uploadAppellantFinalCommentDocuments'
			};
			expect(appellantFinalCommentSkipConditions(question1, journeyResponse1)).toBe(true);
			expect(appellantFinalCommentSkipConditions(question2, journeyResponse1)).toBe(true);
			expect(appellantFinalCommentSkipConditions(question3, journeyResponse1)).toBe(true);
		});

		it('returns false if conditions not met', () => {
			const journeyResponse2 = new JourneyResponse(
				's78-appellant-final-comments',
				'0000002',
				{
					appellantFinalComment: 'yes',
					appellantFinalCommentDocuments: 'yes'
				},
				'Q9999'
			);
			const question4 = {
				fieldName: 'appellantFinalCommentDetails'
			};
			const question5 = {
				fieldName: 'appellantFinalCommentDocuments'
			};
			const question6 = {
				fieldName: 'uploadAppellantFinalCommentDocuments'
			};
			expect(appellantFinalCommentSkipConditions(question4, journeyResponse2)).toBe(false);
			expect(appellantFinalCommentSkipConditions(question5, journeyResponse2)).toBe(false);
			expect(appellantFinalCommentSkipConditions(question6, journeyResponse2)).toBe(false);
		});
	});

	describe('lpaFinalCommentSkipConditions', () => {
		it('returns true if conditions met', () => {
			const journeyResponse1 = new JourneyResponse(
				's78-lpa-final-comments',
				'0000001',
				{
					lpaFinalComment: 'no',
					lpaFinalCommentDocuments: null
				},
				'Q9999'
			);
			const question1 = {
				fieldName: 'lpaFinalCommentDetails'
			};
			const question2 = {
				fieldName: 'lpaFinalCommentDocuments'
			};
			const question3 = {
				fieldName: 'uploadLPAFinalCommentDocuments'
			};
			expect(lpaFinalCommentSkipConditions(question1, journeyResponse1)).toBe(true);
			expect(lpaFinalCommentSkipConditions(question2, journeyResponse1)).toBe(true);
			expect(lpaFinalCommentSkipConditions(question3, journeyResponse1)).toBe(true);
		});

		it('returns false if conditions not met', () => {
			const journeyResponse2 = new JourneyResponse(
				's78-lpa-final-comments',
				'0000002',
				{
					lpaFinalComment: 'yes',
					lpaFinalCommentDocuments: 'yes'
				},
				'Q9999'
			);
			const question4 = {
				fieldName: 'lpaFinalCommentDetails'
			};
			const question5 = {
				fieldName: 'lpaFinalCommentDocuments'
			};
			const question6 = {
				fieldName: 'uploadLPAFinalCommentDocuments'
			};
			expect(lpaFinalCommentSkipConditions(question4, journeyResponse2)).toBe(false);
			expect(lpaFinalCommentSkipConditions(question5, journeyResponse2)).toBe(false);
			expect(lpaFinalCommentSkipConditions(question6, journeyResponse2)).toBe(false);
		});
	});
});
