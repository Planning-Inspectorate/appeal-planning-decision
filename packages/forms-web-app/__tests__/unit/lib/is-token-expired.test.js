const { isTokenExpired } = require('../../../src/lib/is-token-expired');

describe('is token expired', () => {
	it('returns true if gap between provided dates is greater than expiry limit', () => {
		let expiryLimitMinutes = 30;
		let earlierDate = new Date('2022-07-13T09:00:00+0000');
		let laterDate = new Date('2022-07-13T09:31:00+0000');
		expect(isTokenExpired(expiryLimitMinutes, earlierDate, laterDate)).toBeTruthy();

		expiryLimitMinutes = 60;
		earlierDate = new Date('2022-07-13T09:00:00+0000');
		laterDate = new Date('2022-07-13T10:01:00+0000');
		expect(isTokenExpired(expiryLimitMinutes, earlierDate, laterDate)).toBeTruthy();
	});
	it('returns false if gap between provided dates is within expiry limit', () => {
		let expiryLimitMinutes = 30;
		let earlierDate = new Date('2022-07-13T09:00:00+0000');
		let laterDate = new Date('2022-07-13T09:29:00+0000');
		expect(isTokenExpired(expiryLimitMinutes, earlierDate, laterDate)).toBeFalsy();
		expiryLimitMinutes = 60;
		earlierDate = new Date('2022-07-13T09:00:00+0000');
		laterDate = new Date('2022-07-13T09:59:00+0000');
		expect(isTokenExpired(expiryLimitMinutes, earlierDate, laterDate)).toBeFalsy();
	});
});
