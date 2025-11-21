const { APPEAL_USER_ROLES, REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	createTestRepresentationPayload
} = require('../../../../../../__tests__/developer/fixtures/representation-data');
let validUserId = '';
let invalidUserId = '';
const email = crypto.randomUUID() + '@example.com';
const invalidUserEmail = crypto.randomUUID() + '@example.com';
const validLpa = 'Q9999';
const testCase1 = '7845678';
const testCase2 = '7834587';
const testCase3 = '7834588';
const testCase4 = '7834589';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string|undefined, string|undefined): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		const invalidUser = await sqlClient.appealUser.create({
			data: {
				email: invalidUserEmail
			}
		});
		const user = await sqlClient.appealUser.create({
			data: {
				email
			}
		});
		await sqlClient.serviceUser.createMany({
			data: [
				{
					internalId: crypto.randomUUID(),
					emailAddress: email,
					id: crypto.randomUUID(),
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					caseReference: testCase1
				},
				{
					internalId: crypto.randomUUID(),
					emailAddress: email,
					id: crypto.randomUUID(),
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					caseReference: testCase2
				},
				{
					internalId: crypto.randomUUID(),
					emailAddress: email,
					id: crypto.randomUUID(),
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					caseReference: testCase3
				}
			]
		});
		invalidUserId = invalidUser.id;
		validUserId = user.id;
	});

	beforeEach(() => {
		setCurrentSub(validUserId);
		setCurrentLpa(validLpa, email);
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
						userId: validUserId,
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

	describe('/appeal-cases/{caseReference}/representations', () => {
		describe('put', () => {
			it('should upsert a representation', async () => {
				const testRepId = '12345';

				await createAppeal(testCase1);

				const testPutRepresentation = createTestRepresentationPayload(
					testRepId,
					testCase1,
					REPRESENTATION_TYPES.STATEMENT
				);

				const response = await appealsApi
					.put(`/api/v2/appeal-cases/${testCase1}/representations/${testRepId}`)
					.send(testPutRepresentation);
				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', testCase1);
				expect(response.body).toHaveProperty('representationId', testRepId);
				const repDocs = await sqlClient.representationDocument.findMany({
					where: {
						representationId: response.body.id
					}
				});
				expect(repDocs.length).toBe(1);
			});
		});

		describe('get', () => {
			it('should retrieve all representations for the given case reference', async () => {
				const testRepId1 = '23456';
				const testRepId2 = '34567';
				await createAppeal(testCase2);

				const testGetRepresentation1 = createTestRepresentationPayload(
					testRepId1,
					testCase2,
					REPRESENTATION_TYPES.STATEMENT
				);
				const testGetRepresentation2 = createTestRepresentationPayload(
					testRepId2,
					testCase2,
					REPRESENTATION_TYPES.FINAL_COMMENT,
					'citizen'
				);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase2}/representations/${testRepId1}`)
					.send(testGetRepresentation1);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase2}/representations/${testRepId2}`)
					.send(testGetRepresentation2);

				const response = await appealsApi.get(`/api/v2/appeal-cases/${testCase2}/representations`);
				expect(response.status).toEqual(200);
				expect(response.body.Representations.length).toBe(2);
				expect(response.body.Representations).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							caseReference: testCase2,
							representationId: testRepId1,
							source: 'lpa',
							representationType: REPRESENTATION_TYPES.STATEMENT
						}),
						expect.objectContaining({
							caseReference: testCase2,
							representationId: testRepId2,
							source: 'citizen',
							representationType: REPRESENTATION_TYPES.FINAL_COMMENT
						})
					])
				);
			});

			it('should error for user with no roles', async () => {
				const testRepId1 = '5678';
				const testRepId2 = '9876';
				await createAppeal(testCase4);

				const testGetRepresentation1 = createTestRepresentationPayload(
					testRepId1,
					testCase4,
					REPRESENTATION_TYPES.STATEMENT
				);
				const testGetRepresentation2 = createTestRepresentationPayload(
					testRepId2,
					testCase4,
					REPRESENTATION_TYPES.FINAL_COMMENT,
					'citizen'
				);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase4}/representations/${testRepId1}`)
					.send(testGetRepresentation1);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase4}/representations/${testRepId2}`)
					.send(testGetRepresentation2);

				setCurrentSub(invalidUserId);
				setCurrentLpa(undefined, invalidUserEmail);

				const response = await appealsApi.get(`/api/v2/appeal-cases/${testCase4}/representations`);
				expect(response.status).toEqual(403);
			});

			it('should retrieve representations filtered by type', async () => {
				const testRepId3 = '45678';
				const testRepId4 = '56789';
				await createAppeal(testCase3);

				const testGetRepresentation3 = createTestRepresentationPayload(
					testRepId3,
					testCase3,
					REPRESENTATION_TYPES.STATEMENT
				);
				const testGetRepresentation4 = createTestRepresentationPayload(
					testRepId4,
					testCase3,
					REPRESENTATION_TYPES.FINAL_COMMENT,
					'citizen'
				);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase3}/representations/${testRepId3}`)
					.send(testGetRepresentation3);

				await appealsApi
					.put(`/api/v2/appeal-cases/${testCase3}/representations/${testRepId4}`)
					.send(testGetRepresentation4);

				const response = await appealsApi.get(
					`/api/v2/appeal-cases/${testCase3}/representations?type=statement`
				);
				expect(response.status).toEqual(200);
				expect(response.body.Representations.length).toBe(1);
				expect(response.body.Representations[0]).toMatchObject({
					caseReference: testCase3,
					representationId: testRepId3,
					representationType: REPRESENTATION_TYPES.STATEMENT
				});
			});
		});
	});
};
