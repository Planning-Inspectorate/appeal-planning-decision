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
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
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

	describe('/appeal-cases/_caseReference/lpa-statement-submission', () => {
		it('should create a new lpa statement', async () => {
			const testCaseRef = '4636366';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const statementData = {
				lpaStatement: 'This is a test statement',
				additionalDocuments: false
			};

			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
				.send(statementData);

			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(statementData);
		});

		it('should retrieve an existing lpa statement', async () => {
			const testCaseRef = '4636367';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const statementData = {
				lpaStatement: 'This is the second test statement',
				additionalDocuments: false
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
				.send(statementData);

			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`
			);

			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...statementData,
				appealCaseReference: testCaseRef
			});
		});

		it('should patch/ update an existing lpa statement', async () => {
			const testCaseRef = '4636368';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const originalstatement = {
				lpaStatement: 'This is the third test statement'
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
				.send(originalstatement);

			const updatedStatement = {
				lpaStatement: 'This is the updated third test statement',
				additionalDocuments: true
			};

			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
				.send(updatedStatement);

			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedStatement,
				appealCaseReference: testCaseRef
			});
		});

		it('should return 403 if invalid lpa user', async () => {
			const testCaseRef = '4636369';
			await createAppeal(testCaseRef);

			setCurrentLpa(invalidLpa);
			setCurrentSub(validUser);

			const statementData = {
				lpaStatement: 'This is the fourth test statement'
			};

			const response = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-statement-submission`)
				.send(statementData);

			expect(response.status).toEqual(403);
			expect(response.body[0]).toEqual('forbidden');
		});
	});
};
