const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE, SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');
const crypto = require('crypto');
const config = require('../../../../../../configuration/config');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

let validUser = '';
let validEmail = '';
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

	const testR6ServiceUser1 = 'testR6ServiceUserID1';

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
						proofsOfEvidenceDueDate: new Date().toISOString()
					}
				}
			}
		});
		return appeal.AppealCase?.caseReference;
	};

	const formattedProofs1 = {
		caseReference: '307',
		representation: null,
		representationSubmittedDate: expect.any(String),
		representationType: 'proofs_evidence',
		serviceUserId: testR6ServiceUser1,
		documents: [
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		]
	};

	const formattedProofs2 = {
		caseReference: '308',
		representation: null,
		representationSubmittedDate: expect.any(String),
		representationType: 'proofs_evidence',
		serviceUserId: testR6ServiceUser1,
		documents: expect.arrayContaining([
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_PROOF_OF_EVIDENCE,
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			},
			{
				dateCreated: expect.any(String),
				documentId: expect.any(String),
				documentType: APPEAL_DOCUMENT_TYPE.RULE_6_WITNESSES_EVIDENCE,
				documentURI: 'https://example.com',
				filename: 'doc.pdf',
				mime: 'doc',
				originalFilename: 'mydoc.pdf',
				size: 10293
			}
		])
	};

	describe('/api/v2/appeal-cases/:caseReference/rule-6-proof-evidence-submission/submit', () => {
		beforeAll(async () => {
			const email = crypto.randomUUID() + '@example.com';
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
						id: testR6ServiceUser1,
						serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
						caseReference: '307'
					},
					{
						internalId: crypto.randomUUID(),
						emailAddress: email,
						id: testR6ServiceUser1,
						serviceUserType: SERVICE_USER_TYPE.RULE_6_PARTY,
						caseReference: '308'
					}
				]
			});
			validUser = user.id;
			validEmail = user.email;
		});

		const expectEmail = (caseRef) => {
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
			expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
				config.services.notify.templates.generic,
				validEmail,
				{
					personalisation: {
						subject: `We've received your proof of evidence and witnesses - ${caseRef}`,
						content: expect.stringContaining(
							'We have received your proof of evidence and witnesses.'
						)
					},
					reference: expect.any(String),
					emailReplyToId: undefined
				}
			);
			mockNotifyClient.sendEmail.mockClear();
		};

		it('Formats S78 rule 6 proof of evidence submission with one doc type for case 307', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async () => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type: 'uploadRule6ProofOfEvidenceDocuments'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});
			await createAppeal('307');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6ProofOfEvidenceData = {
				uploadRule6ProofOfEvidenceDocuments: true,
				rule6Witnesses: false
			};
			const result = await appealsApi
				.post(`/api/v2/appeal-cases/307/rule-6-proof-evidence-submission`)
				.send(rule6ProofOfEvidenceData);
			await sqlClient.submissionDocumentUpload.create({
				data: {
					id: crypto.randomUUID(),
					fileName: 'doc.pdf',
					originalFileName: 'mydoc.pdf',
					type: 'uploadRule6ProofOfEvidenceDocuments',
					location: 'https://example.com',
					name: 'doc.pdf',
					rule6ProofOfEvidenceSubmissionId: result.body.id,
					storageId: crypto.randomUUID()
				}
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/307/rule-6-proof-evidence-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedProofs1],
				'Create'
			);
			expectEmail('307');
		});

		it('Formats S78 rule 6 proof of evidence submission with both doc types for case 308', async () => {
			mockBlobMetaGetter.blobMetaGetter.mockImplementation(() => {
				return async (location) => ({
					lastModified: '2024-03-01T14:48:35.847Z',
					createdOn: '2024-03-01T13:48:35.847Z',
					metadata: {
						mime_type: 'doc',
						size: 10293,
						document_type:
							location === 'https://example.com/proof'
								? 'uploadRule6ProofOfEvidenceDocuments'
								: 'uploadRule6WitnessesEvidence'
					},
					_response: { request: { url: 'https://example.com' } }
				});
			});
			await createAppeal('308');
			setCurrentLpa(validLpa);
			setCurrentSub(validUser);
			const rule6ProofOfEvidenceData = {
				uploadRule6ProofOfEvidenceDocuments: true,
				rule6Witnesses: true,
				uploadRule6WitnessesEvidence: true
			};
			const result = await appealsApi
				.post('/api/v2/appeal-cases/308/rule-6-proof-evidence-submission')
				.send(rule6ProofOfEvidenceData);
			await sqlClient.submissionDocumentUpload.createMany({
				data: [
					{
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'uploadRule6ProofOfEvidenceDocuments',
						location: 'https://example.com/proof',
						name: 'doc.pdf',
						rule6ProofOfEvidenceSubmissionId: result.body.id,
						storageId: crypto.randomUUID()
					},
					{
						id: crypto.randomUUID(),
						fileName: 'doc.pdf',
						originalFileName: 'mydoc.pdf',
						type: 'uploadRule6WitnessesEvidence',
						location: 'https://example.com',
						name: 'doc.pdf',
						rule6ProofOfEvidenceSubmissionId: result.body.id,
						storageId: crypto.randomUUID()
					}
				]
			});
			await appealsApi
				.post(`/api/v2/appeal-cases/308/rule-6-proof-evidence-submission/submit`)
				.expect(200);
			expect(mockEventClient.sendEvents).toHaveBeenCalledWith(
				'appeal-fo-representation-submission',
				[formattedProofs2],
				'Create'
			);
			expectEmail('308');
		});

		it('404s if the proof of evidence submission cannot be found', async () => {
			await appealsApi
				.post('/api/v2/appeal-cases/nothere/rule-6-proof-evidence-submissions/submit')
				.expect(404);
		});
	});
};
