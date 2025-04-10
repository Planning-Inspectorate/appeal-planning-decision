const { getNotifyClientArguments } = require('./notify-factory');

jest.mock('../../config');

describe('lib/notify/notify-factory', () => {
	let baseUrl;
	let serviceId;
	let apiKey;

	beforeEach(() => {
		baseUrl = 'http://mock-notify:3000';
		serviceId = 'dummy-service-id-for-notify';
		apiKey = 'dummy-api-key-for-notify';
	});

	describe('getNotifyClientArguments', () => {
		describe('Using mock service ', () => {
			test('if `baseUrl` is provided then push `baseUrl` and `serviceId`', () => {
				expect(getNotifyClientArguments(apiKey, baseUrl, serviceId)).toEqual([
					baseUrl,
					serviceId,
					apiKey
				]);
			});

			test('throws if `serviceId` is undefined', () => {
				expect(() => getNotifyClientArguments(apiKey, baseUrl, undefined)).toThrow(
					'If baseUrl is provided, serviceId must be provided also.'
				);
			});
		});

		[
			{ baseUrl: null, serviceId: null },
			{ baseUrl: undefined, serviceId: undefined },
			{ baseUrl: undefined, serviceId }
		].forEach(({ baseUrl: burl, serviceId: sid }) => {
			test('Using real service', () => {
				expect(getNotifyClientArguments(apiKey, burl, sid)).toEqual([apiKey]);
			});
		});
	});
});
