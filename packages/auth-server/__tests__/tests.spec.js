import supertest from 'supertest';
import { jest } from '@jest/globals';
import { mockNotifyClient } from './setup-jest.js';

import consts from '@pins/common/src/constants.js';
import { dayInSeconds, config } from '../src/configuration/config.js';
import app from '../src/app.js';
import createPrismaClient from '../src/adapter/prisma-client.js';
import { seedStaticData } from '@pins/database/src/seed/data-static';

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let authServer;

import { MILLISECONDS_BETWEEN_TOKENS } from '../src/grants/token-repo.js';

jest.setTimeout(20_000); // 20 sec

/** @type {Array.<string>} */
const usersIds = [];

const TEST_EMAIL = 'test@example.com';

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	authServer = supertest(app);

	await seedStaticData(sqlClient);
});

afterEach(async () => {
	jest.clearAllMocks();
});

afterAll(async () => {
	// clear sql db
	await _clearSqlData();
	await sqlClient.$disconnect();
});

describe('auth server', () => {
	const getDefaultGrantParams = ({
		client_id = config.oidc.clients.formsWebApp.clientId,
		client_secret = config.oidc.clients.formsWebApp.clientSecret,
		resource = consts.AUTH.RESOURCE
	} = {}) => {
		return new URLSearchParams({
			client_id,
			client_secret,
			resource
		});
	};

	const sendGrantRequest = async (urlSearchParams) => {
		return await authServer.post(`/oidc/token`).send(urlSearchParams.toString());
	};

	const performClientCreds = async ({
		client_id = config.oidc.clients.formsWebApp.clientId,
		client_secret = config.oidc.clients.formsWebApp.clientSecret,
		resource = consts.AUTH.RESOURCE,
		scope = undefined
	} = {}) => {
		const params = getDefaultGrantParams({
			client_id,
			client_secret,
			resource
		});

		params.append('grant_type', 'client_credentials');

		if (scope) {
			params.append('scope', scope);
		}

		return sendGrantRequest(params);
	};

	const performOTP = async ({
		client_id = config.oidc.clients.formsWebApp.clientId,
		client_secret = config.oidc.clients.formsWebApp.clientSecret,
		resource = consts.AUTH.RESOURCE,
		email = TEST_EMAIL
	} = {}) => {
		const params = getDefaultGrantParams({
			client_id,
			client_secret,
			resource
		});

		params.append('grant_type', consts.AUTH.GRANT_TYPE.OTP);

		if (email) {
			params.append('email', email);
		}

		return sendGrantRequest(params);
	};

	const performROPC = async ({
		client_id = config.oidc.clients.formsWebApp.clientId,
		client_secret = config.oidc.clients.formsWebApp.clientSecret,
		resource = consts.AUTH.RESOURCE,
		email = undefined,
		otp = undefined,
		scope = undefined
	} = {}) => {
		const params = getDefaultGrantParams({
			client_id,
			client_secret,
			resource
		});

		params.append('grant_type', consts.AUTH.GRANT_TYPE.ROPC);

		if (scope) params.append('scope', scope);
		if (email) params.append('email', email);
		if (otp) params.append('otp', otp);

		return sendGrantRequest(params);
	};

	describe('well known endpoint', () => {
		it('should specify ropc grant type', async () => {
			const response = await authServer.get('/oidc/.well-known/openid-configuration');

			expect(response.status).toEqual(200);
			expect(response.body.grant_types_supported).toContain(consts.AUTH.GRANT_TYPE.ROPC);
			expect(response.body.grant_types_supported).toContain(consts.AUTH.GRANT_TYPE.OTP);
		});
	});

	it('should 400 with unknown grant type', async () => {
		const params = getDefaultGrantParams();

		params.append('grant_type', 'unknown');

		const response = await sendGrantRequest(params);

		expect(response.status).toEqual(400);
	});

	describe('client credentials', () => {
		it('should 200 with known client', async () => {
			const response = await performClientCreds();

			expect(response.status).toEqual(200);
			expect(response.body.expires_in).toBe(dayInSeconds);
			expect(response.body.token_type).toBe('Bearer');
			expect(response.body.access_token).toEqual(expect.any(String));
			expect(response.body.scope).toBe(undefined);
		});

		it('should 401 with unknown client', async () => {
			const response = await performClientCreds({
				client_id: 'abc'
			});

			expect(response.status).toEqual(401);
		});

		it('should 401 with incorrect client secret', async () => {
			const response = await performClientCreds({
				client_secret: 'abc'
			});

			expect(response.status).toEqual(401);
		});

		it('should include allowed scopes', async () => {
			const testScopes = 'userinfo openid email';
			const response = await performClientCreds({
				scope: testScopes
			});

			expect(response.status).toEqual(200);
			expect(response.body.scope).toBe(testScopes);
		});

		it('should ignore unknown scopes', async () => {
			const testScopes = 'unknown';
			const response = await performClientCreds({
				scope: testScopes
			});

			expect(response.status).toEqual(200);
			expect(response.body.scope).toBe(undefined);
		});
	});

	describe('Get one time password', () => {
		it('should 200 with unknown user', async () => {
			const response = await performOTP();

			expect(response.status).toEqual(200);
			expect(response.body.expires_in).toEqual(1800);
		});

		it('should 200 with known user', async () => {
			const user = await _createSqlUser('new-user@example.com');
			const response = await performOTP({ email: user.email });

			expect(response.status).toEqual(200);
		});

		it('should avoid sending multiple tokens in quick succession', async () => {
			const user = await _createSqlUser('multiple-tokens@example.com');

			const tokenResponse = await performOTP({ email: user.email });
			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			const tokenResponse2 = await performOTP({ email: user.email });
			const securityToken2 = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			await new Promise((resolve) => {
				setTimeout(resolve, MILLISECONDS_BETWEEN_TOKENS);
			});

			const tokenResponse3 = await performOTP({ email: user.email });
			const securityToken3 = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			expect(tokenResponse.status).toEqual(200);
			expect(tokenResponse2.status).toEqual(200);
			expect(tokenResponse3.status).toEqual(200);
			expect(securityToken).toEqual(securityToken2);
			expect(securityToken).not.toEqual(securityToken3);
		});

		it('should 400 with bad email', async () => {
			const response = await performOTP({ email: 'bad-email' });

			expect(response.status).toEqual(400);
		});
	});

	describe('Resource Owner Password Grant', () => {
		it('should return access token with valid credentials', async () => {
			const user = await _createSqlUser('access-token@example.com');
			await performOTP({ email: user.email });

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			const response = await performROPC({
				email: user.email,
				otp: securityToken.token
			});

			const recheckUser = await sqlClient.appealUser.findFirstOrThrow({
				where: {
					id: user.id
				}
			});

			expect(response.status).toEqual(200);
			expect(recheckUser.isEnrolled).toEqual(true);
			expect(response.body.access_token).toEqual(expect.any(String));
			expect(response.body.expires_in).toEqual(dayInSeconds);
			expect(response.body.token_type).toBe('Bearer');
		});

		it('should ignore case', async () => {
			const user = await _createSqlUser('access-token2@example.com');
			await performOTP({ email: user.email });

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			const response = await performROPC({
				email: user.email,
				otp: securityToken.token.toLowerCase()
			});

			const recheckUser = await sqlClient.appealUser.findFirstOrThrow({
				where: {
					id: user.id
				}
			});

			expect(response.status).toEqual(200);
			expect(recheckUser.isEnrolled).toEqual(true);
			expect(response.body.access_token).toEqual(expect.any(String));
			expect(response.body.expires_in).toEqual(dayInSeconds);
			expect(response.body.token_type).toBe('Bearer');
		});

		it('should return id token with openid scope', async () => {
			const user = await _createSqlUser('id-token@example.com');
			await performOTP({ email: user.email });

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			const response = await performROPC({
				email: user.email,
				otp: securityToken.token,
				scope: 'openid'
			});

			expect(response.status).toEqual(200);
			expect(response.body.access_token).toEqual(expect.any(String));
			expect(response.body.id_token).toEqual(expect.any(String));
		});

		it('should return 400 with bad email', async () => {
			const user = await _createSqlUser('ropc-email-test@example.com');
			await performOTP({ email: user.email });

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			const response = await performROPC({
				email: 'bad-email@example.com',
				otp: securityToken.token
			});

			expect(response.status).toEqual(400);
		});

		it('should return 401 with bad otp', async () => {
			const user = await _createSqlUser('ropc-otp-test@example.com');
			await performOTP({ email: user.email });

			const response = await performROPC({
				email: user.email,
				otp: 'nope'
			});

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});
			const recheckUser = await sqlClient.appealUser.findFirstOrThrow({
				where: {
					id: user.id
				}
			});

			expect(response.status).toEqual(401);
			expect(response.text).toEqual('IncorrectCode');
			expect(recheckUser.isEnrolled).toEqual(false);
			expect(securityToken.attempts).toEqual(1);
		});

		it('should 429 for too many attempts', async () => {
			const user = await _createSqlUser('429-test@example.com');
			await performOTP({ email: user.email });

			const tokenResponse1 = await performROPC({
				email: user.email,
				otp: 'nope'
			});

			const tokenResponse2 = await performROPC({
				email: user.email,
				otp: 'nope'
			});

			const tokenResponse3 = await performROPC({
				email: user.email,
				otp: 'nope'
			});

			const tokenResponse4 = await performROPC({
				email: user.email,
				otp: 'nope'
			});

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});

			// 4th attempt should 429
			expect(securityToken.attempts).toEqual(4);
			expect(tokenResponse1.status).toEqual(401);
			expect(tokenResponse2.status).toEqual(401);
			expect(tokenResponse3.status).toEqual(401);
			expect(tokenResponse4.status).toEqual(429);

			// check subsequent attempts have the same result
			const tokenResponse5 = await performROPC({
				email: user.email,
				otp: 'nope'
			});
			expect(tokenResponse5.status).toEqual(429);
		});

		it('should 401 for expired token', async () => {
			const user = await _createSqlUser('expire-token-test@example.com');
			await performOTP({ email: user.email });

			const halfAnHourExpiry = 30 * 60 * 1000;

			const securityTokenUpdate = await sqlClient.securityToken.update({
				data: {
					tokenGeneratedAt: new Date(Date.now() - halfAnHourExpiry)
				},
				where: { appealUserId: user.id }
			});

			const tokenResponse1 = await performROPC({
				email: user.email,
				otp: securityTokenUpdate.token
			});

			expect(tokenResponse1.status).toEqual(401);
			expect(tokenResponse1.text).toEqual('CodeExpired');
		});

		it('should 400 with no params', async () => {
			await performOTP();
			const response = await performROPC();
			expect(response.status).toEqual(400);
		});
	});
	describe('Notify email', () => {
		it('should send confirmation on first successful ROPC login', async () => {
			const user = await _createSqlUser(TEST_EMAIL);
			expect(user.isEnrolled).toEqual(false);

			await performOTP({ email: TEST_EMAIL });

			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: user.id
				}
			});
			const otp = securityToken.token;

			const response = await performROPC({
				email: TEST_EMAIL,
				otp: otp
			});

			expect(response.status).toEqual(200);
			expect(response.body.access_token).toEqual(expect.any(String));
			const recheckUser = await sqlClient.appealUser.findFirstOrThrow({
				where: {
					id: user.id
				}
			});
			expect(recheckUser.isEnrolled).toEqual(true);
			expectEmails();
		});
	});
});

const expectEmails = () => {
	expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
	expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
		config.services.notify.templates.generic,
		TEST_EMAIL,
		{
			personalisation: {
				subject: expect.stringMatching(`Sign in to appeal a planning decision`),
				content: expect.stringContaining('Sign in to appeal a planning decision:')
			},
			reference: expect.any(String),
			emailReplyToId: undefined
		}
	);
	mockNotifyClient.sendEmail.mockClear();
};

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	await sqlClient.securityToken.deleteMany();
	await sqlClient.appealUser.deleteMany();
};

/**
 * @param {string} email
 * @returns {Promise.<import('@prisma/client').AppealUser>}
 */
const _createSqlUser = async (email) => {
	const user = await sqlClient.appealUser.upsert({
		create: {
			email: email,
			isEnrolled: false
		},
		update: {
			isEnrolled: false
		},
		where: { email: email }
	});

	usersIds.push(user.id);

	return user;
};
