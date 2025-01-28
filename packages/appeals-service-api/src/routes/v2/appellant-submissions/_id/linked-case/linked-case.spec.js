const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

const { isFeatureActive } = require('../../../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../../../configuration/featureFlag');

jest.mock('express-oauth2-jwt-bearer', () => ({
	// eslint-disable-next-line no-unused-vars
	auth: jest.fn((_options) => {
		return (req, _res, next) => {
			req.auth = {
				payload: {
					sub: '29670d0f-c4b4-4047-8ee0-d62b93e91a13'
				}
			};
			next();
		};
	})
}));

jest.mock('express-oauth2-jwt-bearer');

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
});

/**
 * @returns {Promise<string>}
 */
const createSubmission = async () => {
	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	const appeal = await sqlClient.appeal.create({
		select: {
			AppellantSubmission: true
		},
		data: {
			Users: {
				create: {
					userId: user.id,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			},
			AppellantSubmission: {
				create: {
					LPACode: 'Q9999',
					appealTypeCode: 'HAS'
				}
			}
		}
	});

	return appeal.AppellantSubmission?.id;
};

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

describe('/appellant-submissions/:id/linked-case', () => {
	it('post', async () => {
		const testAppellantSubmissionId = await createSubmission();

		const response = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/linked-case`)
			.send({
				fieldName: 'abc',
				caseReference: '123'
			});

		expect(response.body.SubmissionLinkedCase.length).toEqual(1);
		expect(response.body).toEqual(
			expect.objectContaining({
				SubmissionLinkedCase: expect.arrayContaining([
					expect.objectContaining({
						appellantSubmissionId: testAppellantSubmissionId,
						caseReference: '123',
						fieldName: 'abc',
						lPAQuestionnaireSubmissionId: null
					})
				])
			})
		);
	});

	it('delete', async () => {
		const testId = await createSubmission();
		const createResponse = await appealsApi
			.post(`/api/v2/appellant-submissions/${testId}/linked-case`)
			.send({
				fieldName: 'abc',
				caseReference: '123'
			});

		const deleteResponse = await appealsApi.delete(
			`/api/v2/appellant-submissions/${testId}/linked-case/${createResponse.body.SubmissionLinkedCase[0].id}`
		);

		expect(deleteResponse.statusCode).toEqual(200);
		expect(deleteResponse.body.SubmissionLinkedCase.length).toEqual(0);
	});
});
