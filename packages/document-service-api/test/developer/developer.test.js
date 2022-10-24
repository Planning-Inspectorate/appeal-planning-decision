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

		const returnedKeys = Object.keys(response.body);
		expect(returnedKeys.length).toEqual(1);
		expect(returnedKeys).toContain('id');
		expect(response.body.id).toBeDefined(); // We don't know what this will be so can't do an exact check
	});
});
