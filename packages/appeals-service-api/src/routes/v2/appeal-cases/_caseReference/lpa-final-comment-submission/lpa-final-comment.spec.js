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

describe('/appeal-cases/_caseReference/lpa-final-comment-submission', () => {
	it('should create a new lpa final comment', async () => {
		const testCaseRef = '4636366';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const lpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is the first lpa test final comment',
			lpaFinalCommentDocuments: false
		};

		const createResponse = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
			.send(lpaFinalCommentData);

		expect(createResponse.status).toEqual(200);
		expect(createResponse.body).toMatchObject(lpaFinalCommentData);
	});

	it('should retrieve an existing lpa final comment', async () => {
		const testCaseRef = '4636367';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const lpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is a second lpa test final comment',
			lpaFinalCommentDocuments: false
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
			.send(lpaFinalCommentData);

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`
		);

		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			...lpaFinalCommentData,
			appealCaseReference: testCaseRef
		});
	});

	it('should patch/ update an existing lpa final comment', async () => {
		const testCaseRef = '4636368';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const originalLpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is the third lpa test final comment'
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
			.send(originalLpaFinalCommentData);

		const updatedLpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is what we really wanted to say in an update comment',
			lpaFinalCommentDocuments: false
		};

		const updatedResponse = await appealsApi
			.patch(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
			.send(updatedLpaFinalCommentData);

		expect(updatedResponse.status).toEqual(200);
		expect(updatedResponse.body).toMatchObject({
			...updatedLpaFinalCommentData,
			appealCaseReference: testCaseRef
		});
	});

	it('should return 403 if invalid lpa user', async () => {
		const testCaseRef = '4636369';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(invalidLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const lpaFinalCommentData = {
			lpaFinalComment: true,
			lpaFinalCommentDetails: 'This is the invalid lpa test final comment',
			lpaFinalCommentDocuments: false
		};

		const response = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-final-comment-submission`)
			.send(lpaFinalCommentData);

		expect(response.status).toEqual(403);
		expect(response.body[0]).toEqual('forbidden');
	});
});
