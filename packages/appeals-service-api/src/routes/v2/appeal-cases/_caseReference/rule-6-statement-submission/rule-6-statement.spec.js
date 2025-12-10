const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	let validUser = '';
	const validLpa = 'validLpa';

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
			}
		});
		validUser = user.id;
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
						role: APPEAL_USER_ROLES.RULE_6_PARTY
					}
				},
				AppealCase: {
					create: createTestAppealCase(caseRef, 'S78', validLpa)
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	describe('/appeal-cases/_caseReference/rule-6-statement-submission', () => {
		it('should create a new rule 6 statement submission', async () => {
			const testCaseRef = '2734127';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6StatementData = {
				rule6Statement: 'test text',
				rule6AdditionalDocuments: false,
				uploadRule6StatementDocuments: false
			};
			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
				.send(rule6StatementData);
			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject({ ...rule6StatementData, userId: validUser });
		});
		it('should retrieve an existing rule 6 statement submission', async () => {
			const testCaseRef = '2734128';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6StatementData = {
				rule6Statement: 'test text',
				rule6AdditionalDocuments: false,
				uploadRule6StatementDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
				.send(rule6StatementData);
			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`
			);
			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...rule6StatementData,
				caseReference: testCaseRef,
				userId: validUser
			});
		});
		it('should patch/update an existing rule 6 statement submission', async () => {
			const testCaseRef = '2734129';
			await createAppeal(testCaseRef);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const originalRule6StatementData = {
				rule6Statement: 'test text',
				rule6AdditionalDocuments: false,
				uploadRule6StatementDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
				.send(originalRule6StatementData);
			const updatedRule6StatementData = {
				rule6Statement: 'test text',
				rule6AdditionalDocuments: true,
				uploadRule6StatementDocuments: true
			};
			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/rule-6-statement-submission`)
				.send(updatedRule6StatementData);
			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedRule6StatementData,
				caseReference: testCaseRef,
				userId: validUser
			});
		});
	});
};
