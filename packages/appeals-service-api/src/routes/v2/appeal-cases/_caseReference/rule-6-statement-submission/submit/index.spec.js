const config = require('../../../../../../configuration/config');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

let validUser = '';
let validEmail = '';
const validLpa = 'Q9999';
const testR6ServiceUserID2 = 'testR6ServiceUserId2';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('../../../../index.test').NotifyClientMock} dependencies.mockNotifyClient
 * @param {import('../../../../index.test').EventClientMock} dependencies.mockEventClient
 * @param {import('../../../../index.test').BlobMetaGetterMock} dependencies.mockBlobMetaGetter
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({
	getSqlClient,
	setCurrentSub,
	setCurrentLpa,
	mockNotifyClient,
	mockEventClient,
	mockBlobMetaGetter,
	appealsApi
}) => {
	const sqlClient = getSqlClient();

	const expectEmails = () => {
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
		expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
			config.services.notify.templates.generic,
			validEmail,
			{
				personalisation: {
					subject: expect.stringContaining(`We have received your statement: `),
					content: expect.stringContaining(
						'local planning authority and any other parties have submitted their statements'
					)
				},
				reference: expect.any(String),
				emailReplyToId: undefined
			}
		);
		mockNotifyClient.sendEmail.mockClear();
	};

	beforeAll(async () => {
		const email = crypto.randomUUID() + '@example.com';
		validEmail = email;
		const user = await sqlClient.appealUser.create({
			data: {
				email
			}
		});
		validUser = user.id;
		validEmail = user.email;
	});

	/**
	 * @returns {Promise<string|undefined>}
	 */
	const createAppeal = async (caseRef, caseType) => {
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
					create: {
						...createTestAppealCase(caseRef, caseType, validLpa),
						finalCommentsDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const appealTypes = Object.values(CASE_TYPES)
		.filter((caseType) => !caseType.expedited)
		.map((caseType) => caseType.processCode);

	describe('/api/v2/appeal-cases/:caseReference/rule-6-statement-submission/submit', () => {
		it.each(appealTypes)(
			'Formats rule 6 statement submission without docs %s',
			async (caseType) => {
				const id = crypto.randomUUID();
				const statement = {
					caseReference: id,
					representation: 'This is a test comment',
					representationSubmittedDate: expect.any(String),
					representationType: 'statement',
					serviceUserId: testR6ServiceUserID2,
					documents: []
				};

				await sqlClient.serviceUser.create({
					data: {
						internalId: crypto.randomUUID(),
						emailAddress: validEmail,
						id: testR6ServiceUserID2,
						serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
						caseReference: id
					}
				});

				await createAppeal(id, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const rule6StatementData = {
					rule6Statement: 'This is a test comment',
					rule6AdditionalDocuments: false
				};
				await appealsApi
					.post(`/api/v2/appeal-cases/${id}/rule-6-statement-submission`)
					.send(rule6StatementData);
				await appealsApi
					.post(`/api/v2/appeal-cases/${id}/rule-6-statement-submission/submit`)
					.expect(200);
				expectEmails();
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[statement],
					'Create'
				);
			}
		);

		it.each(appealTypes)(
			'Formats rule 6 statement submission without docs %s',
			async (caseType) => {
				const id = crypto.randomUUID();
				const statement = {
					caseReference: id,
					representation: 'Another statement text for rule 6 case 406',
					representationSubmittedDate: expect.any(String),
					representationType: 'statement',
					serviceUserId: testR6ServiceUserID2,
					documents: [
						{
							dateCreated: expect.any(String),
							documentId: expect.any(String),
							documentType: APPEAL_DOCUMENT_TYPE.RULE_6_STATEMENT,
							documentURI: 'https://example.com',
							filename: 'doc.pdf',
							mime: 'doc',
							originalFilename: 'mydoc.pdf',
							size: 10293
						}
					]
				};

				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async () => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type: 'uploadRule6StatementDocuments'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				await sqlClient.serviceUser.create({
					data: {
						internalId: crypto.randomUUID(),
						emailAddress: validEmail,
						id: testR6ServiceUserID2,
						serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
						caseReference: id
					}
				});

				await createAppeal(id, caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const rule6StatementData = {
					rule6Statement: 'Another statement text for rule 6 case 406',
					rule6AdditionalDocuments: true,
					uploadRule6StatementDocuments: true
				};
				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${id}/rule-6-statement-submission`)
					.send(rule6StatementData);

				await sqlClient.submissionDocumentUpload.create({
					data: {
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'uploadRule6StatementDocuments',
						location: 'https://example.com',
						name: 'doc.pdf',
						rule6StatementSubmissionId: result.body.id,
						storageId: crypto.randomUUID()
					}
				});

				await appealsApi
					.post(`/api/v2/appeal-cases/${id}/rule-6-statement-submission/submit`)
					.expect(200);
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[statement],
					'Create'
				);
			}
		);

		it('404s if the statement submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/rule-6-statement-submissions/submit')
				.expect(404);
		});
	});
};
