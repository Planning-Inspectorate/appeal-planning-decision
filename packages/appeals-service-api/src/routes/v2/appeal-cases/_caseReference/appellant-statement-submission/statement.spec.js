const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
const validLpa = 'Q9999';
const invalidLpa = 'nope';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});
		validUser = user.id;
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

	describe('/appeal-cases/_caseReference/appellant-statement-submission', () => {
		it('should create a new appellant statement', async () => {
			const testCaseRef = '4636390';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const statementData = {
				appellantStatement: 'This is a test statement',
				additionalDocuments: false
			};

			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`)
				.send(statementData);

			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(statementData);
		});

		it('should retrieve an existing appellant statement', async () => {
			const testCaseRef = '4636391';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const statementData = {
				appellantStatement: 'This is the second test statement',
				additionalDocuments: false
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`)
				.send(statementData);

			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`
			);

			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...statementData,
				appealCaseReference: testCaseRef
			});
		});

		it('should patch/ update an existing appellant statement', async () => {
			const testCaseRef = '4636392';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const originalstatement = {
				appellantStatement: 'This is the third test statement'
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`)
				.send(originalstatement);

			const updatedStatement = {
				appellantStatement: 'This is the updated third test statement',
				additionalDocuments: true
			};

			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`)
				.send(updatedStatement);

			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedStatement,
				appealCaseReference: testCaseRef
			});
		});

		it('should return 403 if invalid appellant user', async () => {
			const testCaseRef = '4636393';
			await createAppeal(testCaseRef);

			setCurrentLpa(invalidLpa);
			setCurrentSub('fakeUser');

			const statementData = {
				appellantStatement: 'This is the fourth test statement'
			};

			const response = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-statement-submission`)
				.send(statementData);

			expect(response.status).toEqual(403);
			expect(response.body[0]).toEqual('forbidden');
		});
	});
};
