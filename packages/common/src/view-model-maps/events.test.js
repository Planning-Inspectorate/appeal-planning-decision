const { LPA_USER_ROLE, APPEAL_USER_ROLES, EVENT_SUB_TYPES } = require('../constants');
const { formatInquiries, formatSiteVisits, formatHearings } = require('./events');

describe('view-model-maps/events', () => {
	const siteVisitEvent = {
		internalId: 'test123',
		published: true,
		type: 'siteVisit',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9),
		addressLine1: null,
		addressTown: null,
		addressCounty: null,
		addressPostcode: null
	};
	const inquiryEvent = {
		internalId: 'test123',
		published: true,
		type: 'inquiry',
		subtype: null,
		startDate: new Date(2024, 11, 29, 9),
		endDate: new Date(2024, 11, 30, 9),
		addressLine1: '101 The Street',
		addressLine2: 'Flat 2',
		addressTown: 'Town',
		addressCounty: 'County',
		addressPostcode: 'AB1 2CD'
	};
	const hearingEvent = {
		internalId: 'test123',
		published: true,
		type: 'hearing',
		subtype: null,
		startDate: new Date(2025, 11, 29, 9),
		endDate: new Date(2025, 11, 30, 9),
		addressLine1: '101 The Street',
		addressLine2: 'Flat 2',
		addressTown: 'Town',
		addressCounty: 'County',
		addressPostcode: 'AB1 2CD'
	};

	describe('formatSiteVisits', () => {
		it('returns empty array if not a valid user', () => {
			const events = [siteVisitEvent];
			const role = 'not a valid user';

			expect(formatSiteVisits(events, role)).toHaveLength(0);
		});

		it('returns empty array if valid user and no site visit in events array', () => {
			const events = [inquiryEvent, inquiryEvent, hearingEvent];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatSiteVisits(events, role)).toHaveLength(0);
		});

		it('returns empty array if valid user but no subtype specified', () => {
			const events = [siteVisitEvent];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatSiteVisits(events, role)).toHaveLength(0);
		});

		it('returns correct array if valid user and unaccompanied subtype', () => {
			const events = [
				{
					...siteVisitEvent,
					startDate: null,
					endDate: null,
					subtype: EVENT_SUB_TYPES.UNACCOMPANIED
				}
			];
			const role = APPEAL_USER_ROLES.AGENT;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site. You do not need to attend.'
			]);
		});

		it('returns only siteVisit data not inquiry when user is valid', () => {
			const events = [
				{
					...siteVisitEvent,
					startDate: null,
					endDate: null,
					subtype: EVENT_SUB_TYPES.UNACCOMPANIED
				},
				inquiryEvent
			];
			const role = APPEAL_USER_ROLES.AGENT;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site. You do not need to attend.'
			]);
		});

		it('returns correct array if valid user and access subtype (same date)', () => {
			const events = [
				{ ...siteVisitEvent, endDate: new Date(2024, 11, 29, 11), subtype: EVENT_SUB_TYPES.ACCESS }
			];
			const role = LPA_USER_ROLE;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site between 9am and 11am on 29 December 2024. Someone must be at the site to give our inspector access.'
			]);
		});

		it('returns correct array if valid user and access subtype (different dates)', () => {
			const events = [{ ...siteVisitEvent, subtype: EVENT_SUB_TYPES.ACCESS }];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site between 9am on 29 December 2024 and 9am on 30 December 2024. Someone must be at the site to give our inspector access.'
			]);
		});

		it('returns correct array if valid user and access subtype (no end date)', () => {
			const events = [{ ...siteVisitEvent, endDate: null, subtype: EVENT_SUB_TYPES.ACCESS }];
			const role = LPA_USER_ROLE;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site at 9am on 29 December 2024. Someone must be at the site to give our inspector access.'
			]);
		});

		it('returns correct array if valid user and accompanied subtype', () => {
			const events = [{ ...siteVisitEvent, subtype: EVENT_SUB_TYPES.ACCOMPANIED }];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatSiteVisits(events, role)).toEqual([
				'Our inspector will visit the site at 9am on 29 December 2024. You and the other main party must attend the site visit.'
			]);
		});
	});

	describe('formatInquiries', () => {
		it('returns empty array if not a valid user', () => {
			const events = [siteVisitEvent];
			const role = 'not a valid user';

			expect(formatInquiries(events, role)).toHaveLength(0);
		});

		it('returns empty array if valid user and no inquiries in events', () => {
			const events = [siteVisitEvent, hearingEvent];
			const role = LPA_USER_ROLE;

			expect(formatInquiries(events, role)).toHaveLength(0);
		});

		it('returns correct string array if valid inquiry & LPA user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = LPA_USER_ROLE;

			expect(formatInquiries(events, role)).toEqual([
				{
					lineOne:
						'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
				}
			]);
		});

		it('returns correct string array if valid inquiry & rule 6 party user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = APPEAL_USER_ROLES.RULE_6_PARTY;

			expect(formatInquiries(events, role)).toEqual([
				{
					lineOne:
						'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
				}
			]);
		});

		it('returns correct string array if valid inquiry & appellant user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatInquiries(events, role)).toEqual([
				{
					lineOne:
						'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
				}
			]);
		});

		it('returns correct string array if valid inquiry & agent user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = APPEAL_USER_ROLES.AGENT;

			expect(formatInquiries(events, role)).toEqual([
				{
					lineOne:
						'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
				}
			]);
		});

		it('returns correct string array if inquiry missing address', () => {
			const events = [
				siteVisitEvent,
				{
					...inquiryEvent,
					addressLine1: null,
					addressLine2: null,
					addressTown: null,
					addressCounty: null,
					addressPostcode: null
				}
			];
			const role = LPA_USER_ROLE;

			expect(formatInquiries(events, role)).toEqual([
				{
					lineOne:
						'The inquiry will start at 9am on 29 December 2024. We will contact you when we confirm the venue address.',
					lineTwo: 'You must attend the inquiry.'
				}
			]);
		});
	});

	describe('formatHearings', () => {
		it('returns empty array if not a valid user', () => {
			const events = [hearingEvent];
			const role = 'not a valid user';

			expect(formatHearings(events, role)).toHaveLength(0);
		});

		it('returns empty array if valid user and no hearings in events', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = LPA_USER_ROLE;

			expect(formatHearings(events, role)).toHaveLength(0);
		});

		it('returns only hearingEvent not inquiry or site visit when user is valid', () => {
			const events = [siteVisitEvent, inquiryEvent, hearingEvent];
			const role = LPA_USER_ROLE;

			expect(formatHearings(events, role)).toEqual([
				{
					lineOne:
						'The hearing will start at 9am on 29 December 2025. You must attend the hearing at 101 The Street, Flat 2, Town, County, AB1 2CD.'
				}
			]);
		});

		it('returns correct object string array if valid user and hearing missing address', () => {
			const events = [
				{
					...hearingEvent,
					addressLine1: null,
					addressLine2: null,
					addressTown: null,
					addressCounty: null,
					addressPostcode: null
				}
			];
			const role = LPA_USER_ROLE;
			expect(formatHearings(events, role)).toEqual([
				{
					lineOne:
						'The hearing will start at 9am on 29 December 2025. We will contact you when we confirm the venue address.',
					lineTwo: 'You must attend the hearing.'
				}
			]);
		});
	});
});
