const supertest = require('supertest');
const app = require('../../../../app');
const { createPrismaClient } = require('../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const { isFeatureActive } = require('../../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
let validUser;
jest.mock('../../../../configuration/featureFlag');
jest.mock('../../../../../src/services/object-store');
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
const createAppeal = async () => {
	const appeal = await sqlClient.appeal.create({
		data: {
			legacyAppealSubmissionId: '8d89379a-e7b5-4a03-bdc7-1817f67d5e7b',
			legacyAppealSubmissionDecisionDate: new Date(),
			legacyAppealSubmissionState: 'DRAFT',
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
describe('/api/v2/appeals/{id}', () => {
	it('should update an appeal with legacy fields set to null', async () => {
		const appealId = await createAppeal();
		console.log(appealId);
		const response = await appealsApi.patch(`/api/v2/appeals/${appealId}`).send({
			legacyAppealSubmissionId: null,
			legacyAppealSubmissionDecisionDate: null,
			legacyAppealSubmissionState: null
		});
		expect(response.status).toEqual(200);
		const updatedAppeal = await sqlClient.appeal.findUnique({
			where: { id: appealId },
			select: {
				legacyAppealSubmissionId: true,
				legacyAppealSubmissionDecisionDate: true,
				legacyAppealSubmissionState: true
			}
		});
		expect(updatedAppeal).toMatchObject({
			legacyAppealSubmissionId: null,
			legacyAppealSubmissionDecisionDate: null,
			legacyAppealSubmissionState: null
		});
	});
	it('should return 404 if the appeal does not exist', async () => {
		const nonExistentId = '00000000-0000-0000-0000-000000000000';
		const response = await appealsApi.patch(`/api/v2/appeals/${nonExistentId}`).send({
			legacyAppealSubmissionId: null
		});
		expect(response.status).toEqual(404);
	});
});
