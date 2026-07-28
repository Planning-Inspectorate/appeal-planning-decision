const { formatCommentHearingText } = require('./format-comment-hearing-text');
const { APPEAL_EVENT_STATUS } = require('@planning-inspectorate/data-model');

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

	it('returns empty array if hearing is withdrawn', () => {
		const withdrawnHearing = {
			...hearingEvent,
			status: 'withdrawn'
		};
		const events = [withdrawnHearing];
		expect(formatCommentHearingText(events)).toHaveLength(0);
	});

	it('filters out withdrawn hearings but includes active ones', () => {
		const withdrawnHearing = {
			...hearingEvent,
			internalId: 'test456',
			status: APPEAL_EVENT_STATUS.WITHDRAWN,
			startDate: new Date(2024, 11, 29, 9)
		};
		const activeHearing = {
			...hearingEvent,
			internalId: 'test789',
			startDate: new Date(2024, 12, 15, 10)
		};
		const events = [withdrawnHearing, activeHearing];
		expect(formatCommentHearingText(events)).toEqual([
			'The hearing will start on 15 January 2025.'
		]);
	});

	it('returns empty array if event status is withdrawn', () => {
		const withdrawnHearing = {
			...hearingEvent,
			internalId: 'test456',
			status: APPEAL_EVENT_STATUS.WITHDRAWN,
			startDate: new Date(2024, 11, 29, 9)
		};
		const events = [withdrawnHearing];
		expect(formatCommentHearingText(events)).toHaveLength(0);
	});

	it('returns empty array if case status is withdrawn', () => {
		const events = [hearingEvent];
		expect(formatCommentHearingText(events, APPEAL_EVENT_STATUS.WITHDRAWN)).toHaveLength(0);
	});
});
