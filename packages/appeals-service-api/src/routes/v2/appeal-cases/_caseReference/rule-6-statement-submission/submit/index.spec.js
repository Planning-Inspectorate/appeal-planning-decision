const config = require('../../../../../../configuration/config');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
let validEmail = '';
const validLpa = 'Q9999';
const testCase1 = '405';
const testCase2 = '406';
const testR6ServiceUserID2 = 'testR6ServiceUserId2';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client').PrismaClient} dependencies.getSqlClient
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
					subject: expect.stringContaining(`We have received your statement: 405`),
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
		await sqlClient.serviceUser.createMany({
			data: [
				{
					internalId: crypto.randomUUID(),
					emailAddress: email,
					id: testR6ServiceUserID2,
					serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
					caseReference: testCase1
				},
				{
					internalId: crypto.randomUUID(),
					emailAddress: email,
					id: testR6ServiceUserID2,
					serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
					caseReference: testCase2
				}
			]
		});
		validUser = user.id;
		validEmail = user.email;
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
					create: {
						...createTestAppealCase(caseRef, 'S78', validLpa),
						finalCommentsDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const formattedStatement1 = {
		caseReference: testCase1,
		representation: 'This is a test comment',
		representationSubmittedDate: expect.any(String),
		representationType: 'statement',
		serviceUserId: testR6ServiceUserID2,
		documents: []
	};
	const formattedStatement2 = {
		caseReference: testCase2,
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

	describe('/api/v2/appeal-cases/:caseReference/rule-6-statement-submission/submit', () => {
		it('Formats S78 rule 6 statement submission without docs for case 405', async () => {
			await createAppeal(testCase1);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6StatementData = {
				rule6Statement: 'This is a test comment',
				rule6AdditionalDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCase1}/rule-6-statement-submission`)
				.send(rule6StatementData);
			await appealsApi
				.post(`/api/v2/appeal-cases/${testCase1}/rule-6-statement-submission/submit`)
				.expect(200);
			expectEmails();
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement1],
				'Create'
			);
		});
		it('Formats S78 rule 6 statement submission with docs for case 406', async () => {
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

			await createAppeal(testCase2);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6StatementData = {
				rule6Statement: 'Another statement text for rule 6 case 406',
				rule6AdditionalDocuments: true,
				uploadRule6StatementDocuments: true
			};
			const result = await appealsApi
				.post(`/api/v2/appeal-cases/${testCase2}/rule-6-statement-submission`)
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
				.post(`/api/v2/appeal-cases/${testCase2}/rule-6-statement-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement2],
				'Create'
			);
		});
		it('404s if the statement submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/rule-6-statement-submissions/submit')
				.expect(404);
		});
	});
};
