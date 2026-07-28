const { formatCommentInquiryText } = require('./format-comment-inquiry-text');
const { APPEAL_EVENT_STATUS } = require('@planning-inspectorate/data-model');

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

	it('returns empty array if inquiry is withdrawn', () => {
		const withdrawnInquiry = {
			...inquiryEvent,
			status: APPEAL_EVENT_STATUS.WITHDRAWN
		};
		const events = [withdrawnInquiry];
		expect(formatCommentInquiryText(events)).toHaveLength(0);
	});

	it('filters out withdrawn inquiries but includes active ones', () => {
		const withdrawnInquiry = {
			...inquiryEvent,
			internalId: 'test456',
			status: APPEAL_EVENT_STATUS.WITHDRAWN,
			startDate: new Date(2024, 11, 29, 9)
		};
		const activeInquiry = {
			...inquiryEvent,
			internalId: 'test789',
			startDate: new Date(2024, 12, 15, 10)
		};
		const events = [withdrawnInquiry, activeInquiry];
		expect(formatCommentInquiryText(events)).toEqual([
			'The inquiry will start on 15 January 2025.'
		]);
	});
});
