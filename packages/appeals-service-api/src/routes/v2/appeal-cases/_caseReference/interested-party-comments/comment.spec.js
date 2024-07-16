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
				create: createTestAppealCase(caseRef, 'HAS', validLpa)
			}
		}
	});

	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/_caseReference/interested-party-comments', () => {
	it('should create a new interested party comment', async () => {
		const testCaseRef = '3636366';
		await createAppeal(testCaseRef);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const commentData = {
			serviceUserId: validUser,
			comment: 'This is a test comment',
			caseReference: testCaseRef
		};

		const createResponse = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`)
			.send(commentData);

		expect(createResponse.status).toEqual(200);
		expect(createResponse.body).toMatchObject(commentData);
	});

	it('should retrieve a single interested party comment', async () => {
		const testCaseRef = '3636367';
		await createAppeal(testCaseRef);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const commentData = {
			serviceUserId: validUser,
			comment: 'This is a test comment',
			caseReference: testCaseRef
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`)
			.send(commentData);

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`
		);

		expect(response.status).toEqual(200);
		expect(response.body.length).toBe(1);
		expect(response.body).toMatchObject([
			{
				serviceUserId: validUser,
				comment: 'This is a test comment',
				caseReference: testCaseRef
			}
		]);
	});

	it('should retrieve multiple interested party comments', async () => {
		const testCaseRef = '3636368';
		await createAppeal(testCaseRef);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const commentData1 = {
			serviceUserId: validUser,
			comment: 'Test comment 1',
			caseReference: testCaseRef
		};

		const commentData2 = {
			serviceUserId: validUser,
			comment: 'Test comment 2',
			caseReference: testCaseRef
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`)
			.send(commentData1);

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`)
			.send(commentData2);

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/interested-party-comments`
		);

		expect(response.status).toEqual(200);
		expect(response.body.length).toBe(2);
		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining(commentData1),
				expect.objectContaining(commentData2)
			])
		);
	});

	it('should return 404 if no comments found for the given case reference', async () => {
		const testCaseRef = '3636369';
		await createAppeal(testCaseRef);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const invalidCaseRef = '9999999';
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${invalidCaseRef}/interested-party-comments`
		);

		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({ errors: ['No comments found for this case reference'] });
	});
});
