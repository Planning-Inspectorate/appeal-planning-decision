const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE, APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('node:crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	createTestDocData
} = require('../../../../../../__tests__/developer/fixtures/appeals-document-data');
let validUserId = '';
let invalidUserId = '';
const email = crypto.randomUUID() + '@example.com';
const invalidUserEmail = crypto.randomUUID() + '@example.com';
const validLpa = 'Q9999';
const testCase1 = '5737623';
const testCase2 = '9826749';
const testCase3 = '2571571';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
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

	describe('/appeal-cases/{caseReference}/costs', () => {
		describe('get', () => {
			it('should error for user with no roles', async () => {
				await createAppeal(testCase1);

				setCurrentSub(invalidUserId);
				setCurrentLpa(undefined, invalidUserEmail);

				const response = await appealsApi.get(
					`/api/v2/appeal-cases/${testCase1}/costs?types=${APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION}`
				);
				expect(response.status).toEqual(403);
			});

			it('should error for user with different LPA', async () => {
				await createAppeal(testCase2);

				setCurrentSub(invalidUserId);
				setCurrentLpa('NOPE', invalidUserEmail);

				const response = await appealsApi.get(
					`/api/v2/appeal-cases/${testCase2}/costs?types=${APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION}`
				);
				expect(response.status).toEqual(403);
			});

			const costTypes = [
				APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
				APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION,
				APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE,
				APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE
			];

			it('should retrieve costs filtered by type', async () => {
				await createAppeal(testCase3);
				await sqlClient.document.create({
					data: createTestDocData(testCase3, 'randomType')
				});
				await sqlClient.document.createMany({
					data: costTypes.map((type) => ({
						...createTestDocData(testCase3, type)
					}))
				});

				const response = await appealsApi.get(
					`/api/v2/appeal-cases/${testCase3}/costs?types=${costTypes.join(',')}`
				);
				console.log(response.body);
				expect(response.status).toEqual(200);
				expect(response.body.Documents.length).toBe(4);
			});
		});
	});
};
