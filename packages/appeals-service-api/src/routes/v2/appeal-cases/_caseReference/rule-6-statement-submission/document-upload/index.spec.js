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
	 * @returns {Promise<import('@prisma/client').Rule6StatementSubmission>}
	 */
	const createStatementSubmission = async (caseRef, caseType) => {
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
					create: createTestAppealCase(caseRef, caseType, validLpa)
				}
			}
		});

		const statement = await sqlClient.rule6StatementSubmission.create({
			data: {
				AppealCase: {
					connect: {
						caseReference: caseRef
					}
				},
				AppealUser: {
					connect: {
						id: validUser
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

		return statement;
	};

	const appealTypes = Object.values(CASE_TYPES)
		.filter((caseType) => !caseType.expedited)
		.map((caseType) => caseType.processCode);

	describe('/api/v2/appeal-cases/:caseReference/rule-6-statement-submission/document-upload', () => {
		it.each(appealTypes)('Handles document for case type: %s', async (caseType) => {
			const caseRef = crypto.randomUUID();
			const statementSubmission = await createStatementSubmission(caseRef, caseType);
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
				.post(`/api/v2/appeal-cases/${caseRef}/rule-6-statement-submission/document-upload`)
				.send(documentUploads);

			expect(postResponse.statusCode).toBe(200);

			const uploadedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					rule6StatementSubmissionId: statementSubmission.id
				}
			});

			expect(uploadedData).toHaveLength(1);

			const deleteResponse = await appealsApi
				.delete(`/api/v2/appeal-cases/${caseRef}/rule-6-statement-submission/document-upload`)
				.send(uploadedData.map((doc) => doc.id));

			expect(deleteResponse.statusCode).toBe(200);

			const deletedData = await sqlClient.submissionDocumentUpload.findMany({
				where: {
					rule6StatementSubmissionId: statementSubmission.id
				}
			});

			expect(deletedData).toHaveLength(0);
		});
	});
};
