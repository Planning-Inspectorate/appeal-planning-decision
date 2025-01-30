const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { isFeatureActive } = require('../../../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
let validUser;
const validLpa = 'Q9999';
jest.mock('../../../../../configuration/featureFlag');
jest.mock('../../../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';
	return {
		auth: jest.fn(() => {
			return (req, _res, next) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		}),
		setCurrentSub: (newSub) => {
			currentSub = newSub;
		}
	};
});
jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;
	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa) => {
			currentLpa = newLpa;
		}
	};
});
jest.setTimeout(30000);
beforeAll(async () => {
	sqlClient = createPrismaClient();
	appealsApi = supertest(app);
	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	validUser = user.id;
});
beforeEach(async () => {
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});
afterEach(async () => {
	jest.clearAllMocks();
});
afterAll(async () => {
	await sqlClient.$disconnect();
});
/**
 * @returns {Promise<string|undefined>}
 */
const createAppeal = async (caseRef) => {
	const appeal = await sqlClient.appeal.create({
		include: {
			AppealCase: true
		},
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.RULE_6_PARTY
				}
			},
			AppealCase: {
				create: createTestAppealCase(caseRef, 'S78', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/_caseReference/rule-6-statement-submission', () => {
	it('should create a new rule 6 statement submission', async () => {
		const testCaseRef = '2734127';
		await createAppeal(testCaseRef);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6StatementData = {
			rule6Statement: 'test text',
			rule6AdditionalDocuments: false,
			uploadRule6StatementDocuments: false
		};
		const createResponse = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
			.send(rule6StatementData);
		expect(createResponse.status).toEqual(200);
		expect(createResponse.body).toMatchObject({ ...rule6StatementData, userId: validUser });
	});
	it('should retrieve an existing rule 6 statement submission', async () => {
		const testCaseRef = '2734128';
		await createAppeal(testCaseRef);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const rule6StatementData = {
			rule6Statement: 'test text',
			rule6AdditionalDocuments: false,
			uploadRule6StatementDocuments: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
			.send(rule6StatementData);
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`
		);
		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			...rule6StatementData,
			caseReference: testCaseRef,
			userId: validUser
		});
	});
	it('should patch/update an existing rule 6 statement submission', async () => {
		const testCaseRef = '2734129';
		await createAppeal(testCaseRef);
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);
		const originalRule6StatementData = {
			rule6Statement: 'test text',
			rule6AdditionalDocuments: false,
			uploadRule6StatementDocuments: false
		};
		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
			.send(originalRule6StatementData);
		const updatedRule6StatementData = {
			rule6Statement: 'test text',
			rule6AdditionalDocuments: true,
			uploadRule6StatementDocuments: true
		};
		const updatedResponse = await appealsApi
			.patch(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
			.send(updatedRule6StatementData);
		expect(updatedResponse.status).toEqual(200);
		expect(updatedResponse.body).toMatchObject({
			...updatedRule6StatementData,
			caseReference: testCaseRef,
			userId: validUser
		});
	});
});
