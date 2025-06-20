const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

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

	const config = require('../../../../../../configuration/config');

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
	const formattedFinalComment1 = {
		caseReference: '003',
		representation: 'This is a test comment',
		representationSubmittedDate: expect.any(String),
		representationType: 'final_comment',
		lpaCode: 'Q9999',
		documents: []
	};
	const formattedFinalComment2 = {
		caseReference: '004',
		representation: 'Another final comment text for lpa case 004',
		representationSubmittedDate: expect.any(String),
		representationType: 'final_comment',
		lpaCode: 'Q9999',
		documents: [
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: 'lpaFinalComment',
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		]
	};

	const formattedFinalComment3 = {
		caseReference: '015',
		representation: 'This is a test comment',
		representationSubmittedDate: expect.any(String),
		representationType: 'final_comment',
		lpaCode: 'Q9999',
		documents: []
	};

	const formattedFinalComment4 = {
		caseReference: '016',
		representation: 'Another final comment text for lpa case 016',
		representationSubmittedDate: expect.any(String),
		representationType: 'final_comment',
		lpaCode: 'Q9999',
		documents: [
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: 'lpaFinalComment',
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		]
	};

	describe('/api/v2/appeal-cases/:caseReference/lpa-final-comment-submission/submit', () => {
		const expectEmail = (email, appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				email,
				{
					personalisation: {
						subject: `We’ve received your final comments: ${appealReferenceNumber}`,
						content: expect.stringContaining('We’ve received your final comments.')
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it('Formats S78 lpa final comment submission without docs for case 003', async () => {
			await createAppeal('003', 'S78');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is a test comment',
				lpaFinalCommentDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/003/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);
			await appealsApi
				.post(`/api/v2/appeal-cases/003/lpa-final-comment-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedFinalComment1],
				'Create'
			);
			expectEmail('lpa@example.com', '003');
		});
		it('Formats S78 lpa final comment submission with docs for case 004', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadLPAFinalCommentDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});

			await createAppeal('004', 'S78');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'Another final comment text for lpa case 004',
				lpaFinalCommentDocuments: true,
				uploadLPAFinalCommentDocuments: true
			};
			const result = await appealsApi
				.post('/api/v2/appeal-cases/004/lpa-final-comment-submission')
				.send(lpaFinalCommentData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadLPAFinalCommentDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					lpaFinalCommentId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/004/lpa-final-comment-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedFinalComment2],
				'Create'
			);
			expectEmail('lpa@example.com', '004');
		});

		it('Formats S20 lpa final comment submission without docs for case 015', async () => {
			await createAppeal('015', 'S20');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'This is a test comment',
				lpaFinalCommentDocuments: false
			};
			await appealsApi
				.post(`/api/v2/appeal-cases/015/lpa-final-comment-submission`)
				.send(lpaFinalCommentData);
			await appealsApi
				.post(`/api/v2/appeal-cases/015/lpa-final-comment-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedFinalComment3],
				'Create'
			);
			expectEmail('lpa@example.com', '015');
		});

		it('Formats S20 lpa final comment submission with docs for case 016', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadLPAFinalCommentDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});

			await createAppeal('016', 'S20');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const lpaFinalCommentData = {
				lpaFinalComment: true,
				lpaFinalCommentDetails: 'Another final comment text for lpa case 016',
				lpaFinalCommentDocuments: true,
				uploadLPAFinalCommentDocuments: true
			};
			const result = await appealsApi
				.post('/api/v2/appeal-cases/016/lpa-final-comment-submission')
				.send(lpaFinalCommentData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadLPAFinalCommentDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					lpaFinalCommentId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/016/lpa-final-comment-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedFinalComment4],
				'Create'
			);
			expectEmail('lpa@example.com', '016');
		});
		it('404s if the final comment submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/lpa-final-comment-submissions/submit')
				.expect(404);
		});
	});
};
