const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

const validLpa = 'Q9999';
const testCaseMulti = '901';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentSub, setCurrentLpa, appealsApi }) => {
	const sqlClient = getSqlClient();

	/**
	 * @type {string}
	 */
	let user1Id;
	/**
	 * @type {string}
	 */
	let user2Id;
	/**
	 * @type {string}
	 */
	let email1;
	/**
	 * @type {string}
	 */
	let email2;

	beforeAll(async () => {
		// Create User 1
		email1 = crypto.randomUUID() + '@example.com';
		const user1 = await sqlClient.appealUser.create({
			data: { email: email1 }
		});
		user1Id = user1.id;

		// Create User 2
		email2 = crypto.randomUUID() + '@example.com';
		const user2 = await sqlClient.appealUser.create({
			data: { email: email2 }
		});
		user2Id = user2.id;
	});

	const createAppealWithMultipleRule6 = async (/** @type {string} */ caseRef) => {
		const appeal = await sqlClient.appeal.create({
			include: {
				AppealCase: true
			},
			data: {
				Users: {
					create: [
						{
							userId: user1Id,
							role: APPEAL_USER_ROLES.RULE_6_PARTY
						},
						{
							userId: user2Id,
							role: APPEAL_USER_ROLES.RULE_6_PARTY
						}
					]
				},
				AppealCase: {
					create: {
						...createTestAppealCase(caseRef, 'S78', validLpa),
						finalCommentsDueDate: new Date().toISOString()
					}
				}
			}
		});

		await sqlClient.serviceUser.createMany({
			data: [
				{
					internalId: crypto.randomUUID(),
					emailAddress: email1,
					id: 'serviceUser1',
					serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
					caseReference: caseRef
				},
				{
					internalId: crypto.randomUUID(),
					emailAddress: email2,
					id: 'serviceUser2',
					serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
					caseReference: caseRef
				}
			]
		});

		return appeal.AppealCase?.caseReference;
	};

	describe('Multi-user Rule 6 Statement Submission', () => {
		it('Allows two different Rule 6 parties to submit statements for the same case', async () => {
			await createAppealWithMultipleRule6(testCaseMulti);
			setCurrentLpa(validLpa);

			setCurrentSub(user1Id);
			const statementData1 = {
				rule6Statement: 'Statement from User 1',
				rule6AdditionalDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseMulti}/rule-6-statement-submission`)
				.send(statementData1)
				.expect(200);

			setCurrentSub(user2Id);
			const statementData2 = {
				rule6Statement: 'Statement from User 2',
				rule6AdditionalDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseMulti}/rule-6-statement-submission`)
				.send(statementData2)
				.expect(200);
			const submissions = await sqlClient.rule6StatementSubmission.findMany({
				where: { caseReference: testCaseMulti }
			});

			expect(submissions).toHaveLength(2);
			const u1Sub = submissions.find((s) => s.userId === user1Id);
			const u2Sub = submissions.find((s) => s.userId === user2Id);

			expect(u1Sub).toBeDefined();
			expect(u1Sub?.rule6Statement).toBe('Statement from User 1');

			expect(u2Sub).toBeDefined();
			expect(u2Sub?.rule6Statement).toBe('Statement from User 2');
		});
	});
};
