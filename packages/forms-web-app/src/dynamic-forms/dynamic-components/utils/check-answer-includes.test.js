const { checkAnswerIncludes } = require('./check-answer-includes');

describe('checkAnswerIncludes', () => {
	it('returns true if value is answer (non-array)', () => {
		const value = 'site-notice';
		const answer = 'site-notice';
		expect(checkAnswerIncludes(answer, value)).toBeTruthy();
	}),
		it('returns false if value is not answer (non-array)', () => {
			const value = 'site-notice';
			const answer = 'not-site-notice';
			expect(checkAnswerIncludes(answer, value)).toBeFalsy();
		}),
		it('returns true if value is in answer (array)', () => {
			const value = 'another-value';
			const answer = ['a-value', 'another-value', 'yet-another-value'];
			expect(checkAnswerIncludes(answer, value)).toBeTruthy();
		}),
		it('returns false if value is not in answer (array)', () => {
			const value = 'not-in-array-value';
			const answer = ['a-value', 'another-value', 'yet-another-value'];
			expect(checkAnswerIncludes(answer, value)).toBeFalsy();
		});
});
