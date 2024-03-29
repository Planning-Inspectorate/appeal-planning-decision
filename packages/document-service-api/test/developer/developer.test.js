const { documentTypes } = require('@pins/common'); // TODO: remove this when the document types from @pins/common are brought into this API.
const supertest = require('supertest');
const app = require('../../src/app');
const api = supertest(app);
const path = require('path');
const each = require('jest-each').default;
const { isBlobInStorage } = require('./testcontainer-helpers/azurite-container-helper');

jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

async function _createDocument(documentType) {
	return await api
		.post('/api/v1/12345')
		.set('local-planning-authority-code', 'DEV_TEST') // TODO: remove when AS-5031 feature flag is totally rolled out
		.field('documentType', documentType) // Needed to ensure that the Horizon doc and doc group type fields are populated in Blob metadata
		.attach('file', path.join(__dirname, './test-files/sample.pdf'));
}

describe('document-service-api', () => {
	describe('api/v1', () => {
		// To prevent this test being brittle (since it inherently relies on the @pins/common NPM module),
		// we're constructing the parameters for the test based on introspecting what is in that
		// @pins/common module. By doing this we don't need to update this test if that module changes.
		let documentTypesToTestWith = [];
		for (const key in documentTypes) {
			documentTypesToTestWith.push([
				key,
				documentTypes[key].horizonDocumentType,
				documentTypes[key].horizonDocumentGroupType
			]);
		}

		each(documentTypesToTestWith).test(
			'Given a "%s" document type, when a document of this type is uploaded via the API, the response will be as expected, and the document will have been stored in the storage provider',
			async (documentType) => {
				// When
				const response = await _createDocument(documentType);

				// Then
				expect(response.statusCode).toBe(202);

				const returnedId = response.body.id; // We can't infer this prior to the upload
				const returnedUploadDate = response.body.upload_date; // We can't infer this prior to the upload
				const expectedResponseBody = {
					application_id: '12345',
					name: 'sample.pdf',
					upload_date: returnedUploadDate,
					mime_type: 'application/pdf',
					location: `12345/${returnedId}/sample.pdf`,
					size: '3028',
					id: `${returnedId}`,
					document_type: documentType,
					involvement: documentTypes[documentType].involvement
				};

				expect(response.body).toStrictEqual(expectedResponseBody);

				// And
				const doesBlobExist = await isBlobInStorage(returnedId);
				expect(doesBlobExist).toBe(true);
			}
		);

		each(documentTypesToTestWith).test(
			'Given a saved document, when the document is retrieved in base 64 encoding via the API, the response should be as expected',
			async (documentType, expectedHorizonDocumentType, expectedHorizonDocumentGroupType) => {
				// Given
				const savedDocument = await _createDocument(documentType);

				// When
				const response = await api.get(
					`/api/v1/${savedDocument.body.application_id}/${savedDocument.body.id}/file?base64=true`
				);

				// Then
				expect(response.statusCode).toBe(200);

				const expectedResponseBody = {
					application_id: savedDocument.body.application_id,
					name: 'sample.pdf',
					upload_date: response.body.upload_date, // We can't infer this prior to the upload
					mime_type: 'application/pdf',
					location: `${savedDocument.body.application_id}/${response.body.id}/sample.pdf`, // We can't infer this prior to the upload
					size: '3028',
					id: response.body.id, // We can't infer this prior to the upload
					document_type: documentType,
					horizon_document_type: expectedHorizonDocumentType,
					horizon_document_group_type: expectedHorizonDocumentGroupType,
					dataSize: 4040,
					data: response.body.data, // We can't infer this prior to the upload
					involvement: documentTypes[documentType].involvement
				};
				expect(response.body).toStrictEqual(expectedResponseBody);
			}
		);
	});

	describe('api/v2', () => {
		describe('/back-office', () => {
			// v2 back office

			describe('/sas-url POST', () => {
				it('should 400 with no doc', async () => {
					// When
					const response = await api.post(`/api/v2/back-office/sas-url`);

					// Then
					expect(response.statusCode).toBe(400);
				});

				it('should 404 with invalid doc', async () => {
					// When
					const response = await api.post(`/api/v2/back-office/sas-url`).send({
						document: 'unknown/file.txt'
					});

					// Then
					expect(response.statusCode).toBe(404);
				});

				it('should return sas url', async () => {
					// Given
					const docType = documentTypes.appealPdf;
					const savedDocument = await _createDocument(docType.name);

					// When
					const response = await api.post(`/api/v2/back-office/sas-url`).send({
						document: `${savedDocument.body.application_id}/${savedDocument.body.id}/${savedDocument.body.name}`
					});

					// Then
					expect(response.statusCode).toBe(200);
					const sasUrl = response.body.url;
					const expectedPath = `/${savedDocument.body.application_id}/${savedDocument.body.id}/${savedDocument.body.name}?`;

					expect(sasUrl).toContain(expectedPath); // path to doc
					expect(sasUrl).toContain('&sig='); // sas signature
				});
			});

			describe('/:document GET', () => {
				it('should 404 with invalid doc', async () => {
					// When
					const blobName = Buffer.from('unknown/file.txt').toString('base64url');
					const response = await api.get(`/api/v2/back-office/${blobName}`);

					// Then
					expect(response.statusCode).toBe(404);
				});

				it('should return file content', async () => {
					// Given
					const docType = documentTypes.appealPdf;
					const savedDocument = await _createDocument(docType.name);

					// When
					const blobName = Buffer.from(
						`${savedDocument.body.application_id}/${savedDocument.body.id}/${savedDocument.body.name}`
					).toString('base64url');

					const response = await api.get(`/api/v2/back-office/${blobName}`);

					// Then
					expect(response.statusCode).toBe(200);
					expect(response.header['content-type']).toBe('application/pdf');
				});
			});
		});
	});
});
