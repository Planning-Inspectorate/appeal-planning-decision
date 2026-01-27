const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const config = require('../../../../../../configuration/config');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');

let validUser = '';
const validLpa = 'Q9999';
/**
 * @type {string}
 */
let validEmail;
const testServiceUserId = 'testAppUserId1';

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentSub
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('supertest').Agent} dependencies.appealsApi
 * @param {import('../../../../index.test').BlobMetaGetterMock} dependencies.mockBlobMetaGetter
 * @param {import('../../../../index.test').EventClientMock} dependencies.mockEventClient
 * @param {import('../../../../index.test').NotifyClientMock} dependencies.mockNotifyClient
 */
module.exports = ({
	getSqlClient,
	setCurrentSub,
	setCurrentLpa,
	mockBlobMetaGetter,
	mockEventClient,
	mockNotifyClient,
	appealsApi
}) => {
	const sqlClient = getSqlClient();

	beforeAll(async () => {
		const user = await sqlClient.appealUser.create({
			data: {
				email: crypto.randomUUID() + '@example.com'
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
						role: APPEAL_USER_ROLES.APPELLANT
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

		await sqlClient.serviceUser.create({
			data: {
				internalId: crypto.randomUUID(),
				emailAddress: validEmail,
				id: testServiceUserId,
				serviceUserType: SERVICE_USER_TYPE.APPELLANT,
				caseReference: caseRef
			}
		});

		return appeal.AppealCase?.caseReference;
	};

	const testCasesNoDocs = [
		{
			id: '050',
			caseType: 'S78',
			formattedStatement: {
				caseReference: '050',
				representation: 'This is a test comment',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: []
			}
		},
		{
			id: '051',
			caseType: 'S20',
			formattedStatement: {
				caseReference: '051',
				representation: 'This is a test comment',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: []
			}
		},
		{
			id: '052',
			caseType: 'ADVERTS',
			formattedStatement: {
				caseReference: '052',
				representation: 'This is a test comment',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: []
			}
		}
	];
	const testCasesWithDocs = [
		{
			id: '053',
			caseType: 'S78',
			formattedStatement: {
				caseReference: '053',
				representation: 'Another statement text for appellant case 053',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'appellantStatement',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				]
			}
		},
		{
			id: '054',
			caseType: 'S20',
			formattedStatement: {
				caseReference: '054',
				representation: 'Another statement text for appellant case 054',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'appellantStatement',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				]
			}
		},
		{
			id: '055',
			caseType: 'ADVERTS',
			formattedStatement: {
				caseReference: '055',
				representation: 'Another statement text for appellant case 055',
				representationSubmittedDate: expect.any(String),
				representationType: 'statement',
				serviceUserId: testServiceUserId,
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'appellantStatement',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				]
			}
		}
	];

	describe('/api/v2/appeal-cases/:caseReference/appellant-statement-submission/submit', () => {
		const expectEmail = (appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				validEmail,
				{
					personalisation: {
						content: expect.stringContaining('We’ve received your statement.'), // content in v2AppellantStatement (v2-appellant-statement.md)
						subject: `We have received your appellant statement: ${appealReferenceNumber}`
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it.each(testCasesNoDocs)(
			'Formats appellant statement submission without docs',
			async (test) => {
				await createAppeal(test.id, test.caseType);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const appellantStatementData = {
					appellantStatement: 'This is a test comment',
					additionalDocuments: false
				};
				await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/appellant-statement-submission`)
					.send(appellantStatementData);
				await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/appellant-statement-submission/submit`)
					.expect(200);
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[test.formattedStatement],
					'Create'
				);
				expectEmail(test.id);
			}
		);
		it.each(testCasesWithDocs)('Formats appellant statement submission with docs', async (test) => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadAppellantStatementDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});
			await createAppeal(test.id, test.caseType);
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const appellantSubmissionData = {
				appellantStatement: `Another statement text for appellant case ${test.id}`,
				additionalDocuments: true,
				uploadAppellantStatementDocuments: true
			};
			const result = await appealsApi
				.post(`/api/v2/appeal-cases/${test.id}/appellant-statement-submission`)
				.send(appellantSubmissionData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadAppellantStatement',
					location: 'https://example.com',
					name: 'doc.pdf',
					appellantStatementId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/${test.id}/appellant-statement-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[test.formattedStatement],
				'Create'
			);
			expectEmail(test.id);
		});

		it('404s if the statement submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/appellant-statement-submissions/submit')
				.expect(404);
		});
	});
};
