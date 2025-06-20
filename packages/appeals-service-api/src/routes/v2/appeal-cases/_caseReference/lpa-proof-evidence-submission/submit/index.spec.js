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
						proofsOfEvidenceDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const testCasesWith1DocType = [
		{
			id: '007',
			type: 'S78',
			formattedStatement: {
				caseReference: '007',
				representation: null,
				representationSubmittedDate: expect.any(String),
				representationType: 'proofs_evidence',
				lpaCode: 'Q9999',
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaProofOfEvidence',
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
			id: '013',
			type: 'S20',
			formattedStatement: {
				caseReference: '013',
				representation: null,
				representationSubmittedDate: expect.any(String),
				representationType: 'proofs_evidence',
				lpaCode: 'Q9999',
				documents: [
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaProofOfEvidence',
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
	const testCasesWith2DocTypes = [
		{
			id: '008',
			type: 'S78',
			formattedStatement: {
				caseReference: '008',
				representation: null,
				representationSubmittedDate: expect.any(String),
				representationType: 'proofs_evidence',
				lpaCode: 'Q9999',
				documents: expect.arrayContaining([
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaProofOfEvidence',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					},
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaWitnessesEvidence',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				])
			}
		},
		{
			id: '014',
			type: 'S20',
			formattedStatement: {
				caseReference: '014',
				representation: null,
				representationSubmittedDate: expect.any(String),
				representationType: 'proofs_evidence',
				lpaCode: 'Q9999',
				documents: expect.arrayContaining([
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaProofOfEvidence',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					},
					{
						dateCreated: expect.any(String),
						documentId: expect.any(String),
						documentType: 'lpaWitnessesEvidence',
						documentURI: 'https://example.com',
						filename: 'doc.pdf',
						mime: 'doc',
						originalFilename: 'mydoc.pdf',
						size: 10293
					}
				])
			}
		}
	];

	describe('/api/v2/appeal-cases/:caseReference/lpa-proof-evidence-submission/submit', () => {
		const expectEmail = (email, appealReferenceNumber) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				email,
				{
					personalisation: {
						subject: `We’ve received your proof of evidence and witnesses: ${appealReferenceNumber}`,
						content: expect.stringContaining('We’ve received your proof of evidence and witnesses.')
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};
		it.each(testCasesWith1DocType)(
			'Formats lpa proof of evidence submission with 1 doc type',
			async (test) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async () => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type: 'uploadLpaProofOfEvidenceDocuments'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});
				await createAppeal(test.id, test.type);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const lpaProofOfEvidenceData = {
					uploadLpaProofOfEvidenceDocuments: true,
					lpaWitnesses: false
				};
				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/lpa-proof-evidence-submission`)
					.send(lpaProofOfEvidenceData);

				await sqlClient.submissionDocumentUpload.create({
					data: {
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'uploadLpaProofOfEvidenceDocuments',
						location: 'https://example.com',
						name: 'doc.pdf',
						lpaProofOfEvidenceId: result.body.id,
						storageId: crypto.randomUUID()
					}
				});
				await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/lpa-proof-evidence-submission/submit`)
					.expect(200);
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[test.formattedStatement],
					'Create'
				);
				expectEmail('lpa@example.com', test.id);
			}
		);
		it.each(testCasesWith2DocTypes)(
			'Formats S78 lpa proof of evidence submission with both doc types for case 008',
			async (test) => {
				mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
					return async (location) => ({
						lastModified: '2024-03-01T14:48:35.847Z',
						createdOn: '2024-03-01T13:48:35.847Z',
						metadata: {
							mime_type: 'doc',
							size: 10293,
							document_type:
								location === 'https://example.com/proof'
									? 'uploadLpaProofOfEvidenceDocuments'
									: 'uploadLpaWitnessesEvidence'
						},
						_response: { request: { url: 'https://example.com' } }
					});
				});

				await createAppeal(test.id, test.type);
				setCurrentLpa(validLpa);
				setCurrentSub(validUser);
				const lpaProofOfEvidenceData = {
					uploadLpaProofOfEvidenceDocuments: true,
					lpaWitnesses: true,
					uploadLpaWitnessesEvidence: true
				};
				const result = await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/lpa-proof-evidence-submission`)
					.send(lpaProofOfEvidenceData);
				await sqlClient.submissionDocumentUpload.createMany({
					data: [
						{
							id: crypto.randomUUID(),
							fileName: 'doc.pdf',
							originalFileName: 'mydoc.pdf',
							type: 'uploadLpaProofOfEvidenceDocuments',
							location: 'https://example.com/proof',
							name: 'doc.pdf',
							lpaProofOfEvidenceId: result.body.id,
							storageId: crypto.randomUUID()
						},
						{
							id: crypto.randomUUID(),
							fileName: 'doc.pdf',
							originalFileName: 'mydoc.pdf',
							type: 'uploadLpaWitnessesEvidence',
							location: 'https://example.com',
							name: 'doc.pdf',
							lpaProofOfEvidenceId: result.body.id,
							storageId: crypto.randomUUID()
						}
					]
				});
				await appealsApi
					.post(`/api/v2/appeal-cases/${test.id}/lpa-proof-evidence-submission/submit`)
					.expect(200);
				expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
					'appeal-fo-representation-submission',
					[test.formattedStatement],
					'Create'
				);
				expectEmail('lpa@example.com', test.id);
			}
		);

		it('404s if the proof of evidence submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/lpa-proof-evidence-submissions/submit')
				.expect(404);
		});
	});
};
