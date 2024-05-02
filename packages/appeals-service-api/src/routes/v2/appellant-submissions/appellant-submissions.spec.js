const supertest = require('supertest');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
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

jest.mock('express-oauth2-jwt-bearer');

jest.setTimeout(30000);

const submissionIds = [];

let validUser;

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
		data: { email: crypto.randomUUID() + '@example.com' }
	});
	validUser = user.id;
});

/**
 * @returns {Promise<string>}
 */
const createAppeal = async () => {
	const appeal = await sqlClient.appeal.create({
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			}
		}
	});
	return appeal.id;
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

describe('/appellant-submissions', () => {
	it('put', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const appealId = await createAppeal();
		const response = await appealsApi.put('/api/v2/appellant-submissions').send({
			LPACode: 'Q9999',
			appealTypeCode: 'HAS',
			appealId: appealId
		});

		submissionIds.push(response.body.id);

		expect(response.body).toMatchObject({
			id: expect.stringMatching(/[a-f0-9-]{36}/),
			LPACode: 'Q9999',
			appealTypeCode: 'HAS',
			appealId: appealId
		});
	});

	describe('/appellant-submissions/:id', () => {
		it('get', async () => {
			const { setCurrentSub } = require('express-oauth2-jwt-bearer');
			setCurrentSub(validUser);

			const appealId = await createAppeal();

			const putResponse = await appealsApi.put('/api/v2/appellant-submissions').send({
				LPACode: 'Q9999',
				appealTypeCode: 'HAS',
				appealId: appealId
			});

			const createdAppellantSubmissionId = putResponse.body.id;

			submissionIds.push(createdAppellantSubmissionId);

			expect(createdAppellantSubmissionId).toMatch(/[a-f0-9-]{36}/);

			const response = await appealsApi.get(
				`/api/v2/appellant-submissions/${createdAppellantSubmissionId}`
			);

			expect(response.body).toEqual(
				expect.objectContaining({
					id: createdAppellantSubmissionId,
					LPACode: 'Q9999',
					appealTypeCode: 'HAS',
					appealId: appealId
				})
			);
		});

		it('patch', async () => {
			const { setCurrentSub } = require('express-oauth2-jwt-bearer');
			setCurrentSub(validUser);

			const appealId = await createAppeal();

			const putResponse = await appealsApi.put('/api/v2/appellant-submissions').send({
				LPACode: 'Q9999',
				appealTypeCode: 'HAS',
				appealId: appealId
			});

			const createdAppellantSubmissionId = putResponse.body.id;

			submissionIds.push(createdAppellantSubmissionId);

			expect(createdAppellantSubmissionId).toMatch(/[a-f0-9-]{36}/);

			const response = await appealsApi
				.patch(`/api/v2/appellant-submissions/${createdAppellantSubmissionId}`)
				.send({
					id: createdAppellantSubmissionId,
					LPACode: 'Q9999',
					appealTypeCode: 'S78',
					appealId: appealId
				});

			expect(response.body).toEqual({
				id: createdAppellantSubmissionId,
				LPACode: 'Q9999',
				appealTypeCode: 'S78',
				appealId: appealId
			});
		});
	});
});
