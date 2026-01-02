const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
const validLpa = 'Q9999';

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

	describe('/appeal-cases/_caseReference/appellant-final-comment-submission', () => {
		it('should create a new appellant final comment', async () => {
			const testCaseRef = '4639966';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const appellantFinalCommentData = {
				appellantFinalComment: true,
				appellantFinalCommentDetails: 'This is a test comment',
				appellantFinalCommentDocuments: false
			};

			const createResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
				.send(appellantFinalCommentData);

			expect(createResponse.status).toEqual(200);
			expect(createResponse.body).toMatchObject(appellantFinalCommentData);
		});

		it('should retrieve an existing appellant final comment', async () => {
			const testCaseRef = '4639967';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const appellantFinalCommentData = {
				appellantFinalComment: true,
				appellantFinalCommentDetails: 'This is another test comment',
				appellantFinalCommentDocuments: false
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
				.send(appellantFinalCommentData);

			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`
			);

			expect(response.status).toEqual(200);
			expect(response.body).toMatchObject({
				...appellantFinalCommentData,
				caseReference: testCaseRef
			});
		});

		it('should patch/ update an existing appellant final comment', async () => {
			const testCaseRef = '4639968';
			await createAppeal(testCaseRef);

			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const originalComment = {
				appellantFinalComment: true,
				appellantFinalCommentDetails: 'This is yet another test comment'
			};

			await appealsApi
				.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
				.send(originalComment);

			const updatedComment = {
				appellantFinalComment: true,
				appellantFinalCommentDetails: 'This is what I meant to say',
				appellantFinalCommentDocuments: true
			};

			const updatedResponse = await appealsApi
				.patch(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
				.send(updatedComment);

			expect(updatedResponse.status).toEqual(200);
			expect(updatedResponse.body).toMatchObject({
				...updatedComment,
				caseReference: testCaseRef
			});
		});
	});
};
