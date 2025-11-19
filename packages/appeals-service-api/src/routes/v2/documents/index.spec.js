const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');

const { APPEAL_REDACTED_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @param {Object} dependencies
 * @param {function(): import('@prisma/client').PrismaClient} dependencies.getSqlClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, appealsApi }) => {
	const sqlClient = getSqlClient();
	describe('documents v2', () => {
		describe('create document', () => {
			it('should return 400 if unknown field supplied', async () => {
				const response = await appealsApi.put('/api/v2/documents').send({
					id: 'doc_001',
					unknownField: '123'
				});

				expect(response.status).toBe(400);
			});

			it('should create a document', async () => {
				const caseRef = 'createDocument_ref_001';
				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				/** @type {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} */
				const doc = {
					documentId: '45d3ba60-47e2-4b4d-a92d-da2e79a2007c',
					caseId: 1,
					caseReference: caseRef,
					version: 1,
					filename: 'test.jpg',
					originalFilename: 'test.jpg',
					size: 1024,
					mime: 'image/jpeg',
					documentURI: 'https://example.com/doc_001',
					publishedDocumentURI: 'https://example.com/published/doc_001',
					virusCheckStatus: 'scanned',
					fileMD5: '6f1ed002ab5595859014ebf0951522d9',
					dateCreated: new Date().toISOString(),
					dateReceived: new Date().toISOString(),
					datePublished: new Date().toISOString(),
					lastModified: new Date().toISOString(),
					caseType: 'C',
					redactedStatus: 'redacted',
					documentType: 'appellantCaseCorrespondence',
					sourceSystem: 'back-office-appeals',
					origin: 'citizen',
					owner: 'Jason',
					author: 'Tom',
					description: 'A picture of a cow',
					caseStage: 'appeal-decision',
					horizonFolderId: 'hor_001'
				};
				const response = await appealsApi.put('/api/v2/documents').send(doc);

				expect(response.status).toEqual(200);

				const document = await sqlClient.document.findFirst({
					where: {
						id: '45d3ba60-47e2-4b4d-a92d-da2e79a2007c'
					},
					include: {
						AppealCase: true
					}
				});

				expect(document).not.toBe(null);
				expect(document?.stage).toBe('appeal-decision');
				expect(document?.published).toBe(true);
				expect(document?.redacted).toBe(true);
				expect(document?.AppealCase.caseReference).toBe(caseRef);
			});

			it('should accept unredacted docs', async () => {
				const caseRef = 'unredacted_ref_001';

				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				/** @type {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} */
				const doc = {
					documentId: '8964ae94-a34f-477f-8248-ef22ae878e38',
					caseId: 1,
					caseReference: caseRef,
					version: 1,
					filename: 'test.jpg',
					originalFilename: 'test.jpg',
					size: 1024,
					mime: 'image/jpeg',
					documentURI: 'https://example.com/doc_001',
					publishedDocumentURI: 'https://example.com/published/doc_001',
					virusCheckStatus: 'scanned',
					fileMD5: '6f1ed002ab5595859014ebf0951522d9',
					dateCreated: new Date().toISOString(),
					dateReceived: new Date().toISOString(),
					datePublished: new Date().toISOString(),
					lastModified: new Date().toISOString(),
					caseType: 'C',
					redactedStatus: null,
					documentType: 'appellantCaseCorrespondence',
					sourceSystem: 'back-office-appeals',
					origin: 'citizen',
					owner: 'Jason',
					author: 'Tom',
					description: 'A picture of a cow',
					caseStage: 'appeal-decision',
					horizonFolderId: 'hor_001'
				};
				await appealsApi.put('/api/v2/documents').send(doc);
				const document = await sqlClient.document.findFirst({
					where: {
						id: doc.documentId
					}
				});
				expect(document?.redacted).toBe(null);

				const id2 = 'b57f7755-7f51-4db2-8a4f-397b57b3f208';
				await appealsApi
					.put('/api/v2/documents')
					.send({ ...doc, documentId: id2, redactedStatus: APPEAL_REDACTED_STATUS.NOT_REDACTED });
				const document2 = await sqlClient.document.findFirst({
					where: {
						id: id2
					}
				});
				expect(document2?.id).toBe(id2);
				expect(document2?.redacted).toBe(false);
			});

			it('should handle 2 calls in quick succession', async () => {
				const caseRef = 'quickcall_ref_001';

				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				/** @type {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} */
				const doc = {
					documentId: '8964ae94-a34f-477f-8248-ef22ae878e38',
					caseId: 1,
					caseReference: caseRef,
					version: 1,
					filename: 'test.jpg',
					originalFilename: 'test.jpg',
					size: 1024,
					mime: 'image/jpeg',
					documentURI: 'https://example.com/doc_001',
					publishedDocumentURI: 'https://example.com/published/doc_001',
					virusCheckStatus: 'scanned',
					fileMD5: '6f1ed002ab5595859014ebf0951522d9',
					dateCreated: new Date().toISOString(),
					dateReceived: new Date().toISOString(),
					datePublished: new Date().toISOString(),
					lastModified: new Date().toISOString(),
					caseType: 'C',
					redactedStatus: null,
					documentType: 'appellantCaseCorrespondence',
					sourceSystem: 'back-office-appeals',
					origin: 'citizen',
					owner: 'Jason',
					author: 'Tom',
					description: 'A picture of a cow',
					caseStage: 'appeal-decision',
					horizonFolderId: 'hor_001'
				};

				for (const _attempt of Array.from(Array(5).keys())) {
					doc.documentId = crypto.randomUUID();
					const request1 = appealsApi.put('/api/v2/documents').send(doc);
					const request2 = appealsApi.put('/api/v2/documents').send(doc);
					const [response1, response2] = await Promise.all([request1, request2]);
					expect(response1.status).toBe(200);
					expect(response2.status).toBe(200);
				}
			});
		});

		describe('delete document', () => {
			it('deletes documents', async () => {
				const caseRef = 'deleteDocument_ref_001';
				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				const docId = 'd15138a2-9e02-4a16-a6ab-0568aaccab78';
				await sqlClient.document.create({
					data: {
						id: docId,
						dateCreated: new Date('2024').toISOString(),
						dateReceived: new Date('2024').toISOString(),
						lastModified: new Date('2024').toISOString(),
						datePublished: new Date('2024').toISOString(),
						stage: 'appeal-decision',
						published: true,
						redacted: true,
						filename: 'goose.jpg',
						originalFilename: 'large_goose.jpg',
						size: 22,
						mime: 'image/jpeg',
						documentURI: 'https://example.com/images/goose.jpg',
						caseReference: caseRef
					}
				});

				const response = await appealsApi.delete(`/api/v2/documents/${docId}`);

				expect(response.status).toBe(200);

				const notDoc = await sqlClient.document.count({
					where: {
						id: docId
					}
				});

				expect(notDoc).toBe(0);
			});

			it('deletes representation document', async () => {
				const caseRef = 'deleteDocument_ref_002';
				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				const rep = await sqlClient.representation.create({
					data: {
						representationId: '8a624412-ce6b-44d5-8f6d-f3bc8cb9b1bf',
						caseReference: caseRef,
						representationStatus: 'valid'
					}
				});

				const docId = 'd14885f7-9483-4b7a-aef3-59181c335da2';
				await sqlClient.document.create({
					data: {
						id: docId,
						dateCreated: new Date('2024').toISOString(),
						dateReceived: new Date('2024').toISOString(),
						lastModified: new Date('2024').toISOString(),
						datePublished: new Date('2024').toISOString(),
						stage: 'appeal-decision',
						published: true,
						redacted: true,
						filename: 'goose.jpg',
						originalFilename: 'large_goose.jpg',
						size: 22,
						mime: 'image/jpeg',
						documentURI: 'https://example.com/images/goose.jpg',
						caseReference: caseRef
					}
				});
				await sqlClient.representationDocument.create({
					data: {
						documentId: docId,
						representationId: rep.id
					}
				});

				const response = await appealsApi.delete(`/api/v2/documents/${docId}`);

				expect(response.status).toBe(200);

				const notDoc = await sqlClient.document.count({
					where: {
						id: docId
					}
				});
				const notRepDoc = await sqlClient.representationDocument.count({
					where: {
						id: docId
					}
				});

				expect(notDoc).toBe(0);
				expect(notRepDoc).toBe(0);
			});
		});

		describe('get document', () => {
			it('get documents', async () => {
				const caseRef = 'getDocument_ref_001';
				await sqlClient.appealCase.create({
					data: {
						Appeal: { create: {} },
						...createTestAppealCase(caseRef, 'HAS', 'lpa_001')
					}
				});

				const docId = 'd15138a2-9e02-4a16-a6ab-0543aaccab62';
				await sqlClient.document.create({
					data: {
						id: docId,
						dateCreated: new Date('2024').toISOString(),
						dateReceived: new Date('2024').toISOString(),
						lastModified: new Date('2024').toISOString(),
						datePublished: new Date('2024').toISOString(),
						stage: 'appeal-decision',
						published: true,
						redacted: true,
						filename: 'moose.jpg',
						originalFilename: 'large_moose.jpg',
						size: 22,
						mime: 'image/jpeg',
						documentURI: 'https://example.com/images/moose.jpg',
						caseReference: caseRef
					}
				});

				const response = await appealsApi.get(`/api/v2/documents/${docId}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty('caseReference', caseRef);
				expect(response.body).toHaveProperty('published', true);
				expect(response.body).toHaveProperty('filename', 'moose.jpg');
				expect(response.body).toHaveProperty('originalFilename', 'large_moose.jpg');
				expect(response.body).toHaveProperty('redacted', true);
				expect(response.body).toHaveProperty('documentURI', 'https://example.com/images/moose.jpg');
			});
		});
	});
};
