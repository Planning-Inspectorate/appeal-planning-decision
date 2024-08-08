const supertest = require('supertest');
const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const { deleteOldSubmissions } = require('./service');
const Repo = require('./repo');
const { docsApiClient } = require('../../../doc-client/docs-api-client');

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

/**
 * @param {string} lpaCode
 * @param {string} appealTypeCode
 * @param {string} appealId
 * @param {Date} decisionDate
 * @returns {Promise<Response>}
 */
const appellantSubmissionPutResponse = async (lpaCode, appealTypeCode, appealId, decisionDate) => {
	return await appealsApi.put('/api/v2/appellant-submissions').send({
		LPACode: lpaCode,
		appealTypeCode: appealTypeCode,
		appealId: appealId,
		applicationDecisionDate: decisionDate
	});
};

/**
 * @param {string} submissionId
 * @param {string} linkedRecordType
 * @returns {Promise<void>}
 */
const createLinkedRecords = async (submissionId, linkedRecordType) => {
	if (linkedRecordType === 'address') {
		return await sqlClient.submissionAddress.create({
			data: {
				appellantSubmissionId: submissionId,
				addressLine1: 'Address Line 1',
				townCity: 'Test town',
				postcode: 'BS1 6PN',
				fieldName: 'question1'
			}
		});
	} else if (linkedRecordType === 'listedBuilding') {
		return await sqlClient.submissionListedBuilding.create({
			data: {
				appellantSubmissionId: submissionId,
				reference: 'ABC123',
				name: 'Test Listed building',
				listedBuildingGrade: 'II',
				fieldName: 'question2'
			}
		});
	} else if (linkedRecordType === 'linkedCase') {
		return await sqlClient.submissionLinkedCase.create({
			data: {
				appellantSubmissionId: submissionId,
				caseReference: '1234567',
				fieldName: 'question3'
			}
		});
	}
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
		const decisionDate = new Date();
		const appealId = await createAppeal();
		const response = await appealsApi.put('/api/v2/appellant-submissions').send({
			LPACode: 'Q9999',
			appealTypeCode: 'HAS',
			appealId: appealId,
			applicationDecisionDate: decisionDate
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
				appealId: appealId,
				applicationDecisionDate: new Date()
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
			const decisionDate = new Date();
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
					appealId: appealId,
					applicationDecisionDate: decisionDate
				});

			expect(response.body).toEqual({
				id: createdAppellantSubmissionId,
				LPACode: 'Q9999',
				appealTypeCode: 'S78',
				appealId: appealId
			});
		});
	});
	describe('/appellant-submissions/cleanup-old-submissions', () => {
		it('should delete old non-submitted submissions past the deadline', async () => {
			const { setCurrentSub } = require('express-oauth2-jwt-bearer');
			setCurrentSub(validUser);
			// Create a non-submitted submission past the deadline
			const oldApplicationDate = new Date();
			oldApplicationDate.setMonth(oldApplicationDate.getMonth() - 7); // 7 months ago
			const appealId = await createAppeal();
			const oldSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				appealId,
				oldApplicationDate
			);

			// Create a non-submitted submission within the deadline
			const recentApplicationDate = new Date();
			recentApplicationDate.setMonth(recentApplicationDate.getMonth() - 1); // 1 month ago
			const recentAppealId = await createAppeal();
			const recentSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				recentAppealId,
				recentApplicationDate
			);

			const response = await appealsApi.delete(
				'/api/v2/appellant-submissions/cleanup-old-submissions'
			);
			expect(response.status).toBe(200);

			// Check that the old submission was deleted
			const deletedSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: oldSubmission.body?.id }
			});
			expect(deletedSubmission).toBeNull();

			// Check that the recent submission still exists
			const existingSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: recentSubmission.body?.id }
			});
			expect(existingSubmission).not.toBeNull();
		});
		it('should delete S78/ HAS submissions appropriately according to differing deadlines', async () => {
			const { setCurrentSub } = require('express-oauth2-jwt-bearer');
			setCurrentSub(validUser);
			// Create non-submitted HAS submissions
			const oldHasApplicationDate = new Date();
			oldHasApplicationDate.setMonth(oldHasApplicationDate.getMonth() - 7);
			const oldHasAppealId = await createAppeal();
			const oldHasSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				oldHasAppealId,
				oldHasApplicationDate
			);

			const recentHasApplicationDate = new Date();
			recentHasApplicationDate.setMonth(recentHasApplicationDate.getMonth() - 1);
			const newHasAppealId = await createAppeal();
			const newHasSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				newHasAppealId,
				recentHasApplicationDate
			);

			// Create non-submitted S78 submissions
			const oldS78ApplicationDate = new Date();
			oldS78ApplicationDate.setMonth(oldS78ApplicationDate.getMonth() - 11);
			const oldS78AppealId = await createAppeal();
			const oldS78Submission = await appellantSubmissionPutResponse(
				'Q9999',
				'S78',
				oldS78AppealId,
				oldS78ApplicationDate
			);

			const recentS78ApplicationDate = new Date();
			recentS78ApplicationDate.setMonth(recentS78ApplicationDate.getMonth() - 1);
			const newS78AppealId = await createAppeal();
			const newS78Submission = await appellantSubmissionPutResponse(
				'Q9999',
				'S78',
				newS78AppealId,
				recentS78ApplicationDate
			);

			const response = await appealsApi.delete(
				'/api/v2/appellant-submissions/cleanup-old-submissions'
			);
			expect(response.status).toBe(200);

			// Check the old submissions were deleted
			const deletedHasSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: oldHasSubmission.body?.id }
			});
			expect(deletedHasSubmission).toBeNull();

			const deletedS78Submission = await sqlClient.appellantSubmission.findUnique({
				where: { id: oldS78Submission.body?.id }
			});
			expect(deletedS78Submission).toBeNull();

			// Check the recent submissions still exist
			const existingHasSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: newHasSubmission.body?.id }
			});
			expect(existingHasSubmission).not.toBeNull();

			const existingS78Submission = await sqlClient.appellantSubmission.findUnique({
				where: { id: newS78Submission.body?.id }
			});
			expect(existingS78Submission).not.toBeNull();
		});
		it('should delete associated records/ data with deleted submissions', async () => {
			const { setCurrentSub } = require('express-oauth2-jwt-bearer');
			setCurrentSub(validUser);
			// Create an old submission past the deadline with linked records
			const oldApplicationDate = new Date();
			oldApplicationDate.setMonth(oldApplicationDate.getMonth() - 7); // 7 months ago
			const oldAppealId = await createAppeal();
			const oldSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				oldAppealId,
				oldApplicationDate
			);
			await createLinkedRecords(oldSubmission.body?.id, 'address');
			await createLinkedRecords(oldSubmission.body?.id, 'listedBuilding');
			await createLinkedRecords(oldSubmission.body?.id, 'linkedCase');

			const oldAppealBeforeDeletion = await sqlClient.appeal.findFirst({
				where: { id: oldAppealId }
			});

			// Create a recent submission within the deadline with records
			const recentApplicationDate = new Date();
			recentApplicationDate.setMonth(recentApplicationDate.getMonth() - 1); // 1 month ago
			const recentAppealId = await createAppeal();
			const recentSubmission = await appellantSubmissionPutResponse(
				'Q9999',
				'HAS',
				recentAppealId,
				recentApplicationDate
			);
			await createLinkedRecords(recentSubmission.body?.id, 'address');
			await createLinkedRecords(recentSubmission.body?.id, 'listedBuilding');

			const recentAppealBeforeDeletion = await sqlClient.appeal.findFirst({
				where: { id: recentAppealId }
			});

			const response = await appealsApi.delete(
				'/api/v2/appellant-submissions/cleanup-old-submissions'
			);
			expect(response.status).toBe(200);

			expect(oldAppealBeforeDeletion).not.toBeNull();
			expect(recentAppealBeforeDeletion).not.toBeNull();
			const oldAppealAfterDeletion = await sqlClient.appeal.findFirst({
				where: { id: oldAppealId }
			});
			const recentAppealAfterDeletion = await sqlClient.appeal.findFirst({
				where: { id: recentAppealId }
			});
			expect(oldAppealAfterDeletion).toBeNull();
			expect(recentAppealAfterDeletion).not.toBeNull();

			// Check the old submission and the linked records were was deleted
			const deletedSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: oldSubmission.body?.id }
			});
			expect(deletedSubmission).toBeNull();

			const deletedAddress = await sqlClient.submissionAddress.findFirst({
				where: { appellantSubmissionId: oldSubmission.body?.id }
			});
			expect(deletedAddress).toBeNull();

			const deletedListedBuilding = await sqlClient.submissionListedBuilding.findFirst({
				where: { appellantSubmissionId: oldSubmission.body?.id }
			});
			expect(deletedListedBuilding).toBeNull();

			const deletedLinkedCase = await sqlClient.submissionLinkedCase.findFirst({
				where: { appellantSubmissionId: oldSubmission.body?.id }
			});
			expect(deletedLinkedCase).toBeNull();

			// Check the recent submission still exists
			const existingSubmission = await sqlClient.appellantSubmission.findUnique({
				where: { id: recentSubmission.body?.id }
			});
			expect(existingSubmission).not.toBeNull();

			const existingAddress = await sqlClient.submissionAddress.findFirst({
				where: { appellantSubmissionId: recentSubmission.body?.id }
			});
			expect(existingAddress).not.toBeNull();

			const existingListedBuilding = await sqlClient.submissionListedBuilding.findFirst({
				where: { appellantSubmissionId: recentSubmission.body?.id }
			});
			expect(existingListedBuilding).not.toBeNull();
		});
		it('should call docsApiClient.deleteDocument for each document', async () => {
			const mockGetNonSubmittedSubmissions = jest.fn();
			const mockGetSubmissionDocumentUploads = jest.fn();
			const mockDeleteDocument = jest.fn();
			const mockDeleteSubmission = jest.fn();
			Repo.prototype.getNonSubmittedSubmissions = mockGetNonSubmittedSubmissions;
			Repo.prototype.getSubmissionDocumentUploads = mockGetSubmissionDocumentUploads;
			Repo.prototype.deleteSubmission = mockDeleteSubmission;
			docsApiClient.deleteSubmissionDocument = mockDeleteDocument;
			const oldApplicationDate = new Date();
			oldApplicationDate.setMonth(oldApplicationDate.getMonth() - 7);
			const mockSubmission = {
				id: crypto.randomUUID(),
				applicationDecisionDate: oldApplicationDate,
				appealTypeCode: 'HAS',
				LPACode: 'Q9999'
			};
			const mockDocuments = [{ id: crypto.randomUUID() }, { id: crypto.randomUUID() }];
			mockGetNonSubmittedSubmissions.mockResolvedValue([mockSubmission]);
			mockGetSubmissionDocumentUploads.mockResolvedValue(mockDocuments);
			mockDeleteDocument.mockResolvedValue();
			mockDeleteSubmission.mockResolvedValue();

			await deleteOldSubmissions();

			expect(mockDeleteDocument).toHaveBeenCalledTimes(mockDocuments.length);
			mockDocuments.forEach((doc) => {
				expect(mockDeleteDocument).toHaveBeenCalledWith(doc.id);
			});
		});
		it('should handle errors when deleting old submissions', async () => {
			const mockGetNonSubmittedSubmissions = jest.fn();
			const mockGetSubmissionDocumentUploads = jest.fn();
			const mockDeleteDocument = jest.fn();
			const mockDeleteSubmission = jest.fn();
			docsApiClient.deleteSubmissionDocument = mockDeleteDocument;
			Repo.prototype.getNonSubmittedSubmissions = mockGetNonSubmittedSubmissions;
			Repo.prototype.getSubmissionDocumentUploads = mockGetSubmissionDocumentUploads;
			Repo.prototype.deleteSubmission = mockDeleteSubmission;

			const oldApplicationDate = new Date();
			oldApplicationDate.setMonth(oldApplicationDate.getMonth() - 7);
			const mockSubmissionId = crypto.randomUUID();
			const mockSubmission = {
				id: mockSubmissionId,
				applicationDecisionDate: oldApplicationDate,
				appealTypeCode: 'HAS',
				LPACode: 'Q9999'
			};
			const mockDocuments = [{ id: crypto.randomUUID() }, { id: crypto.randomUUID() }];
			mockGetNonSubmittedSubmissions.mockResolvedValue([mockSubmission]);
			mockGetSubmissionDocumentUploads.mockResolvedValue(mockDocuments);
			mockDeleteDocument.mockRejectedValue(new Error('Test error'));
			mockDeleteSubmission.mockResolvedValue();
			// const response = await deleteOldSubmissions();
			const response = await appealsApi.delete(
				'/api/v2/appellant-submissions/cleanup-old-submissions'
			);

			expect(response.body.errors[0]).toEqual('Error deleting old submissions');
		});
	});
});
