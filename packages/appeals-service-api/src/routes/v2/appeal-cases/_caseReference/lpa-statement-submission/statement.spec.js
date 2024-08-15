const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
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
const invalidLpa = 'nope';

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
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	appealsApi = supertest(app);

	await seedStaticData(sqlClient);

	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	validUser = user.id;
});

beforeEach(async () => {
	// turn all feature flags on
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
 * @returns {Promise<string>}
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
					role: APPEAL_USER_ROLES.APPELLANT
				}
			},
			AppealCase: {
				create: createTestAppealCase(caseRef, 'S78', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/_caseReference/lpa-statement-submission', () => {
	it('should create a new lpa statement', async () => {
		const testCaseRef = '3636366';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const statementData = {
			lpaStatement: 'This is a test statement',
			additionalDocuments: false
		};

		const createResponse = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
			.send(statementData);

		expect(createResponse.status).toEqual(200);
		expect(createResponse.body).toMatchObject(statementData);
	});

	it('should retrieve an existing lpa statement', async () => {
		const testCaseRef = '3636367';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const statementData = {
			lpaStatement: 'This is the second test statement',
			additionalDocuments: false
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
			.send(statementData);

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`
		);

		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			...statementData,
			appealCaseReference: testCaseRef
		});
	});

	it('should patch/ update an existing lpa statement', async () => {
		const testCaseRef = '3636368';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const originalstatement = {
			lpaStatement: 'This is the third test statement'
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
			.send(originalstatement);

		const updatedStatement = {
			lpaStatement: 'This is the updated third test statement',
			additionalDocuments: true
		};

		const updatedResponse = await appealsApi
			.patch(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
			.send(updatedStatement);

		expect(updatedResponse.status).toEqual(200);
		expect(updatedResponse.body).toMatchObject({
			...updatedStatement,
			appealCaseReference: testCaseRef
		});
	});

	it('should return 403 if invalid lpa user', async () => {
		const testCaseRef = '3636369';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(invalidLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const statementData = {
			lpaStatement: 'This is the fourth test statement'
		};

		const response = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
			.send(statementData);

		expect(response.status).toEqual(403);
		expect(response.body[0]).toEqual('forbidden');
	});
});
