const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');
const config = require('../../../../../../configuration/config');

let validUser = '';
const validLpa = 'Q9999';

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
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
		return appeal.AppealCase?.caseReference;
	};
	const formattedStatement1 = {
		caseReference: '005',
		representation: 'This is a test comment',
		representationSubmittedDate: expect.any(String),
		representationType: 'statement',
		lpaCode: 'Q9999',
		documents: []
	};

	const formattedStatement2 = {
		caseReference: '006',
		representation: 'Another statement text for lpa case 006',
		representationSubmittedDate: expect.any(String),
		representationType: 'statement',
		lpaCode: 'Q9999',
		documents: [
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: 'lpaStatement',
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		]
	};
	const formattedStatement3 = {
		caseReference: '011',
		representation: 'This is a test comment',
		representationSubmittedDate: expect.any(String),
		representationType: 'statement',
		lpaCode: 'Q9999',
		documents: []
	};
	const formattedStatement4 = {
		caseReference: '012',
		representation: 'Another statement text for lpa case 012',
		representationSubmittedDate: expect.any(String),
		representationType: 'statement',
		lpaCode: 'Q9999',
		documents: [
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: 'lpaStatement',
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		]
	};
	describe('/api/v2/appeal-cases/:caseReference/lpa-statement-submission/submit', () => {
		const expectEmail = (email, appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				email,
				{
					personalisation: {
						subject: `We’ve received your statement: ${appealReferenceNumber}`,
						content: expect.stringContaining('We’ve received your statement.')
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it('Formats S78 lpa statement submission without docs for case 005', async () => {
			await createAppeal('005', 'S78');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaStatementData = {
				lpaStatement: 'This is a test comment',
				additionalDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/005/lpa-statement-submission`)
				.send(lpaStatementData);
			await appealsApi.post(`/api/v2/appeal-cases/005/lpa-statement-submission/submit`).expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement1],
				'Create'
			);
			expectEmail('lpa@example.com', '005');
		});
		it('Formats S78 lpa statement submission with docs for case 006', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadLpaStatementDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});
			await createAppeal('006', 'S78');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaStatement: 'Another statement text for lpa case 006',
				additionalDocuments: true,
				uploadLpaStatementDocuments: true
			};
			const result = await appealsApi
				.post('/api/v2/appeal-cases/006/lpa-statement-submission')
				.send(lpaFinalCommentData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadLpaStatementDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					lpaStatementId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi.post(`/api/v2/appeal-cases/006/lpa-statement-submission/submit`).expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement2],
				'Create'
			);
			expectEmail('lpa@example.com', '006');
		});

		it('Formats S20 lpa statement submission without docs for case 011', async () => {
			await createAppeal('011', 'S20');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaStatementData = {
				lpaStatement: 'This is a test comment',
				additionalDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/011/lpa-statement-submission`)
				.send(lpaStatementData);
			await appealsApi.post(`/api/v2/appeal-cases/011/lpa-statement-submission/submit`).expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement3],
				'Create'
			);
			expectEmail('lpa@example.com', '011');
		});

		it('Formats S20 lpa statement submission with docs for case 012', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadLpaStatementDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});
			await createAppeal('012', 'S20');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaStatement: 'Another statement text for lpa case 012',
				additionalDocuments: true,
				uploadLpaStatementDocuments: true
			};
			const result = await appealsApi
				.post('/api/v2/appeal-cases/012/lpa-statement-submission')
				.send(lpaFinalCommentData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadLpaStatementDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					lpaStatementId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi.post(`/api/v2/appeal-cases/012/lpa-statement-submission/submit`).expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedStatement4],
				'Create'
			);
			expectEmail('lpa@example.com', '012');
		});
		it('404s if the statement submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/lpa-statement-submissions/submit')
				.expect(404);
		});
	});
};
