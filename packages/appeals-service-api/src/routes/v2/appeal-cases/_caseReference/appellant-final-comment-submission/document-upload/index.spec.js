const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
let email = '';
const validLpa = 'Q9999';

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
		email = crypto.randomUUID() + '@example.com';
		const user = await sqlClient.appealUser.create({
			data: {
				email
			}
		});
		validUser = user.id;
	});

	/**
	 * @returns {Promise<import('@prisma/client').AppellantFinalCommentSubmission>}
	 */
	const createFinalCommentSubmission = async (caseRef, caseType) => {
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
					create: createTestAppealCase(caseRef, caseType, validLpa)
				}
			}
		});

		const finalComment = await sqlClient.appellantFinalCommentSubmission.create({
			data: {
				AppealCase: {
					connect: {
						caseReference: caseRef
					}
				}
			}
		});

		await sqlClient.serviceUser.create({
			data: {
				internalId: crypto.randomUUID(),
				emailAddress: email,
				id: crypto.randomUUID(),
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: appeal.AppealCase?.caseReference
			}
		});

		return finalComment;
	};

	const appealTypes = Object.values(CASE_TYPES)
		.filter((caseType) => !caseType.expedited)
		.map((caseType) => caseType.processCode);

	describe('/api/v2/appeal-cases/:caseReference/appellant-final-comment-submissions/document-upload', () => {
		it.each(appealTypes)('Handles document for case type: %s', async (caseType) => {
			const caseRef = crypto.randomUUID();
			const finalCommentSubmission = await createFinalCommentSubmission(caseRef, caseType);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);

			const documentUploads = [
				{
					name: 'test',
					fileName: 'fileName',
					originalFileName: 'orig',
					location: '/file',
					type: 'file-type',
					storageId: 'abcd1234'
				}
			];

			const postResponse = await appealsApi
				.post(`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission/document-upload`)
				.send(documentUploads);

			expect(postResponse.statusCode).toBe(200);

			const uploadedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					appellantFinalCommentId: finalCommentSubmission.id
				}
			});

			expect(uploadedData).toHaveLength(1);

			const deleteResponse = await appealsApi
				.delete(
					`/api/v2/appeal-cases/${caseRef}/appellant-final-comment-submission/document-upload`
				)
				.send(uploadedData.map((doc) => doc.id));

			expect(deleteResponse.statusCode).toBe(200);

			const deletedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					appellantFinalCommentId: finalCommentSubmission.id
				}
			});

			expect(deletedData).toHaveLength(0);
		});

		it('404s if the case cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nope/appellant-final-comment-submissions/document-upload')
				.expect(404);
		});
	});
};
