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
 * @param {string} caseRef
 * @returns {Promise<string>}
 */
const createAppeal = async (caseRef) => {
	const today = new Date();

	let futureEndDate = new Date();
	futureEndDate.setDate(today.getDate() + 1);

	let pastEndDate = new Date();
	pastEndDate.setDate(today.getDate() - 1);

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

	await sqlClient.event.createMany({
		data: [
			{
				caseReference: caseRef,
				published: true,
				type: 'siteVisit',
				subtype: 'accompanied',
				startDate: today,
				endDate: futureEndDate
			},
			{
				caseReference: caseRef,
				published: true,
				type: 'siteVisit',
				subtype: 'accompanied',
				startDate: today,
				endDate: pastEndDate
			},
			{
				caseReference: caseRef,
				published: true,
				type: 'siteVisit',
				subtype: 'unaccompanied',
				startDate: today,
				endDate: futureEndDate
			},
			{
				caseReference: caseRef,
				published: true,
				type: 'hearing',
				subtype: 'test',
				startDate: today,
				endDate: futureEndDate
			}
		]
	});

	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/_caseReference/events/', () => {
	it('get should retrieve the events', async () => {
		const testCaseRef = '3636363';
		await createAppeal(testCaseRef);

		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const eventResponse = await appealsApi.get(`/api/v2/appeal-cases/${testCaseRef}/events`);

		expect(eventResponse.status).toEqual(200);
		expect(eventResponse.body.length).toBe(3);
	});

	it('get should retrieve past events if includePast set', async () => {
		const testCaseRef = '3636364';
		await createAppeal(testCaseRef);

		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const eventResponse = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/events?includePast=true`
		);

		expect(eventResponse.status).toEqual(200);
		expect(eventResponse.body.length).toBe(4);
	});

	it('get should filter by type if provided', async () => {
		const testCaseRef = '3636365';
		await createAppeal(testCaseRef);

		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const eventResponse = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/events?type=hearing`
		);

		expect(eventResponse.status).toEqual(200);
		expect(eventResponse.body.length).toBe(1);
	});
});
