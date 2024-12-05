const { formatCommentInquiryText } = require('./format-comment-inquiry-text');

describe('formatCommentInquiryText', () => {
	const siteVisitEvent = {
		internalId: 'test123',
		published: true,
		type: 'siteVisit',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9)
	};
	const inquiryEvent = {
		internalId: 'test123',
		published: true,
		type: 'inquiry',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9)
	};
	it('returns empty array if no inquiries', () => {
		const events = [siteVisitEvent];
		expect(formatCommentInquiryText(events)).toHaveLength(0);
	});

	it('returns correct string if an inquiry event in events array', () => {
		const events = [siteVisitEvent, inquiryEvent];
		expect(formatCommentInquiryText(events)).toEqual([
			'The inquiry will start on 29 December 2024.'
		]);
	});
});
