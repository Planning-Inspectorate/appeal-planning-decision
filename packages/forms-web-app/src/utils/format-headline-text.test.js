const { formatCommentHeadlineText } = require('./format-headline-text.js');

describe('formatCommentHeadlineText', () => {
	it('should return status in string if unhandled', () => {
		expect(formatCommentHeadlineText('a', 'b')).toBe('Appeal b for comment');
	});

	it('should return appeal number if status is decided', () => {
		expect(formatCommentHeadlineText('abc', 'decided')).toBe('Decision for appeal abc');
	});
});
