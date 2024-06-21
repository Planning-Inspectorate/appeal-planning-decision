const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';

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
		})
	};
});

// jest.setTimeout(140000);

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	let server = http.createServer(app);
	appealsApi = supertest(server);

	await seedStaticData(sqlClient);
});

beforeEach(async () => {
	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(async () => {
	jest.clearAllMocks();
});

afterAll(async () => {
	await sqlClient.$disconnect();
});

describe('documents v2', () => {
	describe('create document', () => {
		it('should return 500 if unknown field supplied', async () => {
			const response = await appealsApi.put('/api/v2/documents').send({
				id: 'doc_001',
				unknownField: '123'
			});

			expect(response.status).toBe(500);
		});

		it('should create a document', async () => {
			await sqlClient.appealCase.create({
				data: { Appeal: { create: {} }, ...createTestAppealCase('ref_001', 'HAS', 'lpa_001') }
			});

			/** @type {import('pins-data-model/src/schemas').AppealDocument} */
			const doc = {
				documentId: '45d3ba60-47e2-4b4d-a92d-da2e79a2007c',
				caseId: 1,
				caseReference: 'ref_001',
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
			expect(document?.AppealCase.caseReference).toBe('ref_001');
		});
	});

	describe('delete document', () => {
		it('deletes documents', async () => {
			await sqlClient.document.create({
				data: {
					id: 'd15138a2-9e02-4a16-a6ab-0568aaccab78',
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
					caseReference: 'ref_001'
				}
			});

			const response = await appealsApi.delete(
				'/api/v2/documents/d15138a2-9e02-4a16-a6ab-0568aaccab78'
			);

			expect(response.status).toBe(200);

			const notDoc = await sqlClient.document.findFirst({
				where: {
					id: 'd15138a2-9e02-4a16-a6ab-0568aaccab78'
				}
			});

			expect(notDoc).toBe(null);
		});
	});
});
