const { formatCommentDeadlineText } = require('./format-deadline-text.js');

describe('formatCommentDeadlineText', () => {
	const appeal = {
		interestedPartyRepsDueDate: '2024-12-31'
	};

	it('should return an empty string if interestedPartyRepsDueDate is not provided', () => {
		const appealWithoutDate = { ...appeal, interestedPartyRepsDueDate: undefined };
		expect(formatCommentDeadlineText(appealWithoutDate, 'open')).toBe('');
	});

	it('should return the correct message for open status', () => {
		expect(formatCommentDeadlineText(appeal, 'open')).toBe(
			'You can comment on this appeal until 11:59pm on 31 December 2024.'
		);
	});

	it('should return the correct message for closed status', () => {
		expect(formatCommentDeadlineText(appeal, 'closed')).toBe(
			'The deadline for comment was 31 December 2024.'
		);
	});

	it('should return an empty string for any other status', () => {
		expect(formatCommentDeadlineText(appeal, 'unknown')).toBe('');
	});

	it('should return an empty string if status is undefined', () => {
		expect(formatCommentDeadlineText(appeal, undefined)).toBe('');
	});
});
