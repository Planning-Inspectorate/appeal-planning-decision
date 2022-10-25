const { documentTypes } = require('@pins/common'); // TODO: remove this when the document types from @pins/common are brought into this API.
const supertest = require('supertest');
const app = require('../../src/app');
const api = supertest(app);
const path = require('path');
const each = require('jest-each').default;
const { isBlobInStorage } = require('./testcontainer-helpers/azurite-container-helper')

jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

describe('document-service-api', () => {
	
	// To prevent this test being brittle (since it inherently relies on the @pins/common NPM module),
	// we're constructing the parameters for the test based on introspecting what is in that
	// @pins/common module. By doing this we don't need to update this test if that module changes.
	let parameters = [];
	for (const key in documentTypes) {
		parameters.push([key]);
	}

	each(parameters).test(
		'Given a "%s" document type, when a document of this type is uploaded via the API, the response will be as expected, and the document will have been stored in the storage provider',
		async (documentType) => {
			
			// When
			const response = await api
				.post('/api/v1/12345')
				.set('local-planning-authority-code', 'DEV_TEST') // TODO: remove when AS-5031 feature flag is totally rolled out
				.field('documentType', documentType) // Needed to ensure that the Horizon doc and doc group type fields are populated in Blob metadata
				.attach('file', path.join(__dirname, './test-files/sample.pdf'));

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
				document_type: documentType
			};
			expect(response.body).toStrictEqual(expectedResponseBody);

			// And
			const doesBlobExist = await isBlobInStorage(returnedId)
			expect(doesBlobExist).toBe(true)
	});
});
