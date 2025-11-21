const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const crypto = require('crypto');

let validUser = '';
let email = '';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({
	getSqlClient,
	setCurrentSub,

	appealsApi
}) => {
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
	 * @param {string} caseType
	 * @returns {Promise<import('@pins/database/src/client').AppellantSubmission & { AppellantSubmission: import('@pins/database/src/client').AppellantSubmission })}>}
	 */
	const createAppellantSubmission = async (caseType) => {
		const appeal = await sqlClient.appeal.create({
			select: {
				AppellantSubmission: true
			},
			data: {
				Users: {
					create: {
						userId: validUser,
						role: APPEAL_USER_ROLES.APPELLANT
					}
				},
				AppellantSubmission: {
					create: {
						LPACode: 'Q9999',
						appealTypeCode: caseType
					}
				}
			}
		});

		return appeal;
	};

	const appealTypes = Object.values(CASE_TYPES).map((caseType) => caseType.processCode);

	describe('/api/v2/appellant-submissions/_id/document-upload', () => {
		it.each(appealTypes)('Handles document for case type: %s', async (caseType) => {
			const appeal = await createAppellantSubmission(caseType);
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
				.post(`/api/v2/appellant-submissions/${appeal.AppellantSubmission.id}/document-upload`)
				.send(documentUploads);

			expect(postResponse.statusCode).toBe(200);

			const uploadedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					appellantSubmissionId: appeal.AppellantSubmission.id
				}
			});

			expect(uploadedData).toHaveLength(1);

			const deleteResponse = await appealsApi
				.delete(`/api/v2/appellant-submissions/${appeal.AppellantSubmission.id}/document-upload`)
				.send(uploadedData.map((doc) => doc.id));

			expect(deleteResponse.statusCode).toBe(200);

			const deletedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					appellantSubmissionId: appeal.AppellantSubmission.id
				}
			});

			expect(deletedData).toHaveLength(0);
		});
	});
};
