const connectMongodb = require('connect-mongodb-session');
const expressSession = require('express-session');
const session = require('../../../src/lib/session');
const config = require('../../../src/config');

jest.mock('express-session');
jest.mock('../../../src/lib/logger');

const mockOn = jest.fn();

jest.mock('connect-mongodb-session', () =>
	jest.fn().mockImplementation(() =>
		jest.fn().mockImplementation(() => ({
			on: mockOn
		}))
	)
);

describe('lib/session', () => {
	it('should throw if unable to find the session secret', () => {
		expect(() => session()).toThrow('Session secret must be set');
	});

	it('should configure the MongoDBStore with the expected config', () => {
		config.server.sessionSecret = 'a fake session secret';

		const configuredSession = session();

		expect(configuredSession.cookie).toEqual({
			sameSite: 'lax',
			httpOnly: true
		});
		expect(configuredSession.resave).toEqual(false);
		expect(configuredSession.saveUninitialized).toEqual(false);
		expect(configuredSession.secret).toEqual(config.server.sessionSecret);
		expect(configuredSession.store.on).toBeDefined();

		expect(connectMongodb).toHaveBeenCalledWith(expressSession);
		expect(mockOn.mock.calls[0][0]).toEqual('error');
	});

	it('should configure the MongoDBStore with the expected config when useSecureSessionCookie', () => {
		config.server.sessionSecret = 'a fake session secret';
		config.server.useSecureSessionCookie = true;

		const configuredSession = session();

		expect(configuredSession.cookie.secure).toEqual(true);
		expect(configuredSession.resave).toEqual(false);
		expect(configuredSession.saveUninitialized).toEqual(false);
		expect(configuredSession.secret).toEqual(config.server.sessionSecret);
		expect(configuredSession.store.on).toBeDefined();
		expect(configuredSession.store.on).toHaveBeenCalledWith('error', expect.any(Function));

		expect(connectMongodb).toHaveBeenCalledWith(expressSession);
		expect(mockOn.mock.calls[0][0]).toEqual('error');
	});

	it('should parse secrets as a json array', () => {
		config.server.sessionSecret = '["test1","test2"]';

		const configuredSession = session();

		expect(configuredSession.secret).toEqual(['test1', 'test2']);
	});
});
