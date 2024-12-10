const { formatCommentHearingText } = require('./format-comment-hearing-text');

describe('formatCommentHearingText', () => {
	const siteVisitEvent = {
		internalId: 'test123',
		published: true,
		type: 'siteVisit',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9)
	};
	const hearingEvent = {
		internalId: 'test123',
		published: true,
		type: 'hearing',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9)
	};

	it('returns empty array if no hearings', () => {
		const events = [siteVisitEvent];
		expect(formatCommentHearingText(events)).toHaveLength(0);
	});

	it('returns correct string if a hearing event in events array', () => {
		const events = [siteVisitEvent, hearingEvent];
		expect(formatCommentHearingText(events)).toEqual([
			'The hearing will start on 29 December 2024.'
		]);
	});
});
