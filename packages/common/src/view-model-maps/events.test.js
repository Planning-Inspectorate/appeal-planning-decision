const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('../constants');
const { formatInquiries } = require('./events');

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

	describe('formatInquiries', () => {
		it('returns empty array if not a valid user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = 'not a valid user';

			expect(formatInquiries(events, role)).toHaveLength(0);
		});

		it('returns null if no inquiries in events', () => {
			const events = [siteVisitEvent];
			const role = LPA_USER_ROLE;

			expect(formatInquiries(events, role)).toHaveLength(0);
		});

		it('returns correct string array if valid inquiry & LPA user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = LPA_USER_ROLE;

			expect(formatInquiries(events, role)).toEqual([
				'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
			]);
		});

		it('returns correct string array if valid inquiry & appellant user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = APPEAL_USER_ROLES.APPELLANT;

			expect(formatInquiries(events, role)).toEqual([
				'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
			]);
		});

		it('returns correct string array if valid inquiry & agent user', () => {
			const events = [siteVisitEvent, inquiryEvent];
			const role = APPEAL_USER_ROLES.AGENT;

			expect(formatInquiries(events, role)).toEqual([
				'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry at 101 The Street, Flat 2, Town, County, AB1 2CD.'
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
				'The inquiry will start at 9am on 29 December 2024. You must attend the inquiry - address to be confirmed.'
			]);
		});
	});
});
