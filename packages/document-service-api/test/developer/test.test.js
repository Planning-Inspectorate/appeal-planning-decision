const { documentTypes } = require('@pins/common');
const supertest = require('supertest');
const app = require('../../src/app');
const api = supertest(app);
const path = require('path');
const each = require('jest-each').default;

describe('document-service-api', () => {
	// To prevent this test being brittle (since it inherently relies on the @pins/common NPM module),
	// we're constructing the parameters for the test based on introspecting what is in that
	// @pins/common module. By doing this we don't need to update this test if that module changes.

	let parameters = [];
	for (const key in documentTypes) {
		parameters.push([
			key,
			documentTypes[key].horizonDocumentType,
			documentTypes[key].horizonDocumentGroupType
		]);
	}

	each(parameters).test(
		'Given a "%s" document type, when a document of this type is uploaded via the API, the response will state that the Horizon document type and group type are "%s" and "%s"',
		async (documentType, expectedHorizonDocumentType, expectedHorizonDocumentGroupType) => {
			// When
			const response = await api
				.post('/api/v1/12345')
				.field('lpaCode', 'DEV_TEST')
				.field('documentType', documentType)
				.attach('file', path.join(__dirname, './test-files/sample.pdf'));

			// Then
			expect(response.statusCode).toBe(202);
			expect(response.body.horizon_document_type).toBe(expectedHorizonDocumentType);
			expect(response.body.horizon_document_group_type).toBe(expectedHorizonDocumentGroupType);
		}
	);
});
