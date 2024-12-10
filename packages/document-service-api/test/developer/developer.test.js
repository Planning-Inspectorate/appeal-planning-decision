const config = require('../../src/configuration/config');
const { documentTypes } = require('@pins/common'); // TODO: remove this when the document types from @pins/common are brought into this API.
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_VIRUS_CHECK_STATUS } = require('pins-data-model');
const supertest = require('supertest');
const app = require('../../src/app');
const api = supertest(app);
const path = require('path');
const each = require('jest-each').default;
const { isBlobInStorage } = require('./testcontainer-helpers/azurite-container-helper');
const { createPrismaClient } = require('../../src/db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { seedDev } = require('@pins/database/src/seed/data-dev');
const { appealDocuments } = require('@pins/database/src/seed/appeal-documents-dev');
const blobClient = require('#lib/back-office-storage-client');
const fs = require('fs');

jest.setTimeout(20000);

jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

const validUser = '29670d0f-c4b4-4047-8ee0-d62b93e91a11';
const invalidUser = '3ccd3b97-f434-40de-a76e-999412a5fa8e';

jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = validUser;

	return {
		auth: jest.fn(() => {
			return (req, _res, next) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		}),
		setCurrentSub: (newSub) => {
			currentSub = newSub;
		}
	};
});

const validLpa = 'Q9999';
jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;

	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa) => {
			currentLpa = newLpa;
		}
	};
});

const getDoc = ({
	published = true,
	redacted = true,
	virusCheckStatus = APPEAL_VIRUS_CHECK_STATUS.SCANNED
} = {}) => {
	const doc = appealDocuments.find(
		(item) =>
			item.published === published &&
			item.redacted === redacted &&
			item.virusCheckStatus === virusCheckStatus
	);
	return doc;
};

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;

beforeAll(async () => {
	// sql client
	const exampleFile = fs.createReadStream(path.join(__dirname, './test-files/example.txt'));
	sqlClient = createPrismaClient();
	await seedStaticData(sqlClient);
	await seedDev(sqlClient);
	await blobClient.uploadBlob(config.boStorage.container, 'example.txt', {}, exampleFile);
});

afterAll(async () => {
	await sqlClient.$disconnect();
});

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
			describe('/{id} Get', () => {
				it('should 404 with invalid doc', async () => {
					// When
					const response = await api.get(`/api/v2/back-office/nope`);
					// Then
					expect(response.statusCode).toBe(404);
				});

				it('should 401 for unredacted and not owned', async () => {
					// Given
					const appealDoc = getDoc({
						published: true,
						redacted: false,
						virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.SCANNED
					});

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(invalidUser);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(401);
				});

				it('should 200 for unredacted but owned', async () => {
					// Given
					const appealDoc = getDoc({
						published: true,
						redacted: false,
						virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.SCANNED
					});

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(validUser);

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(undefined);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(200);
				});

				it('should 401 for different lpa', async () => {
					// Given
					const appealDoc = getDoc({
						published: true,
						redacted: false,
						virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.SCANNED
					});

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa('nope');
					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(invalidUser);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(401);
				});

				it('should 401 for not_checked', async () => {
					// Given
					const appealDoc = getDoc({
						published: true,
						redacted: true,
						virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.NOT_SCANNED
					});

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(validUser);

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(undefined);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(401);
				});

				it('should 401 for failed_virus_check', async () => {
					// Given
					const appealDoc = getDoc({
						published: true,
						redacted: true,
						virusCheckStatus: APPEAL_VIRUS_CHECK_STATUS.AFFECTED
					});

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(validUser);

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(undefined);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(401);
				});

				it('should return sas url for published doc', async () => {
					// Given
					const appealDoc = getDoc();

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(validUser);

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(undefined);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(200);
					const sasUrl = response.body.url;
					expect(sasUrl).toContain(appealDoc.documentURI); // path to doc
					expect(sasUrl).toContain('&sig='); // sas signature
				});

				it('should return sas url for published doc for rule 6 user', async () => {
					// Given
					const appealDoc = getDoc();

					const rule6User = await sqlClient.document.findFirst({
						where: {
							id: appealDoc?.id
						},
						select: {
							AppealCase: {
								select: {
									Appeal: {
										select: {
											Users: {
												select: {
													userId: true
												},
												where: {
													role: APPEAL_USER_ROLES.RULE_6_PARTY
												}
											}
										}
									}
								}
							}
						}
					});

					const { setCurrentSub } = require('express-oauth2-jwt-bearer');
					setCurrentSub(rule6User?.AppealCase.Appeal.Users[0].userId);

					const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
					setCurrentLpa(undefined);

					// When
					const response = await api.get(`/api/v2/back-office/${appealDoc.id}`);
					// Then
					expect(response.statusCode).toBe(200);
					const sasUrl = response.body.url;
					expect(sasUrl).toContain(appealDoc.documentURI); // path to doc
					expect(sasUrl).toContain('&sig='); // sas signature
				});
			});
		});

		describe('/submission-document', () => {
			describe('/{id} DELETE', () => {
				it('should 404 with invalid doc', async () => {
					// When
					const response = await api.delete(`/api/v2/submission-document/nope`);
					// Then
					expect(response.statusCode).toBe(404);
				});

				it('should 200 for valid doc', async () => {
					const docType = documentTypes.originalApplication;
					const testDocResponse = await _createDocument(docType.name);
					const returnedId = testDocResponse.body.id; // We can't infer this prior to the upload
					const location = `12345/${returnedId}/sample.pdf`;

					const submission = await sqlClient.submissionDocumentUpload.create({
						data: {
							location,
							fileName: 'sample.pdf',
							name: 'sample.pdf',
							originalFileName: 'sample.pdf',
							type: documentTypes.originalApplication.name
						}
					});

					// When
					const response = await api.delete(`/api/v2/submission-document/${submission.id}`);
					// Then
					expect(response.statusCode).toBe(200);
				});
			});
		});
	});
});
