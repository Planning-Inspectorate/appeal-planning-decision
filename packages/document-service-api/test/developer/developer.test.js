const supertest = require('supertest');
const app = require('../../src/app');
const api = supertest(app);
const path = require('path');

jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

// TODO: add a test that actually checks if a document to be uploaded IS uploaded!

describe('document-service-api', () => {
	it('Given a "%s" document type, when a document of this type is uploaded via the API, the response will state that the Horizon document type and group type are "%s" and "%s"', async (documentType) => {
		// When
		const response = await api
			.post('/api/v1/12345')
			.set('local-planning-authority-code', 'DEV_TEST')
			.field('documentType', documentType)
			.attach('file', path.join(__dirname, './test-files/sample.pdf'));

		// Then
		expect(response.statusCode).toBe(202);

<<<<<<< HEAD
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
			horizon_document_type: expectedHorizonDocumentType,
			horizon_document_group_type: expectedHorizonDocumentGroupType
		};
		expect(response.body).toStrictEqual(expectedResponseBody);
=======
		const returnedKeys = Object.keys(response.body);
		expect(returnedKeys.length).toEqual(1);
		expect(returnedKeys).toContain('id');
		expect(response.body.id).toBeDefined(); // We don't know what this will be so can't do an exact check
>>>>>>> fix(as-5031): initial cleanup commit
	});
});
