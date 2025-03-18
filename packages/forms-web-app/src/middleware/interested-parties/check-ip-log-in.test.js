const { isFeatureActive } = require('../../featureFlag');
const { mockRes } = require('../../../__tests__/unit/mocks');

const { getUserFromSession, logoutUser } = require('../../services/user.service');
const isIdle = require('../../lib/check-session-idle');
const checkInterestedPartyLogInNotExpired = require('./check-ip-log-in');
const { getClientCredentials } = require('../create-api-clients');

const {
	appeals: { url, timeout }
} = require('../../config');

jest.mock('@pins/common/src/client/appeals-api-client', () => ({
	AppealsApiClient: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../featureFlag');
jest.mock('../../services/user.service');
jest.mock('../../lib/check-session-idle');
jest.mock('../../lib/appeals-api-wrapper');
jest.mock('../create-api-clients');

describe('checkInterestedPartyLogInNotExpired middleware', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			session: {
				regenerate: async (callback) => {
					callback();
				}
			},
			originalUrl: '/'
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		isIdle.mockReturnValue(false);
		isFeatureActive.mockResolvedValue(true);
		getClientCredentials.mockResolvedValue('clientCredentialsToken');
	});

	it('should call next if there is no logged-in user', async () => {
		getUserFromSession.mockReturnValue();

		await checkInterestedPartyLogInNotExpired(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should call next if user log in has not expired', async () => {
		const mockUser = {
			expiry: new Date(Date.now() + 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);

		await checkInterestedPartyLogInNotExpired(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should logout the user and reset the appeals api client if user log in expired', async () => {
		const mockUser = {
			expiry: new Date(Date.now() - 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);

		await checkInterestedPartyLogInNotExpired(req, res, next);

		expect(logoutUser).toHaveBeenCalled;

		expect(
			require('@pins/common/src/client/appeals-api-client').AppealsApiClient
		).toHaveBeenCalledWith(
			url,
			{
				access_token: undefined,
				id_token: undefined,
				client_creds: 'clientCredentialsToken'
			},
			timeout
		);

		expect(next).toHaveBeenCalled();
	});

	it('should logout the user and reset the appeals api client if user is idle', async () => {
		const mockUser = {
			expiry: new Date(Date.now() + 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);
		isIdle.mockReturnValue(true);

		await checkInterestedPartyLogInNotExpired(req, res, next);

		expect(logoutUser).toHaveBeenCalled;

		expect(
			require('@pins/common/src/client/appeals-api-client').AppealsApiClient
		).toHaveBeenCalledWith(
			url,
			{
				access_token: undefined,
				id_token: undefined,
				client_creds: 'clientCredentialsToken'
			},
			timeout
		);

		expect(next).toHaveBeenCalled();
	});
});
