const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const {
	fakeDocumentMetadata,
	getRandomInt,
	DOCUMENT_TYPES
} = require('./fixtures/documentMetadata');
const uuid = require('uuid');
const { isFeatureActive } = require('../../src/configuration/featureFlag');
const app = require('../../src/app');
let appealsApi;
let databaseConnection;
const collectionName = 'documentMetadata';
const { fakeDocuments } = fakeDocumentMetadata();

jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag');
jest.mock('../../src/services/object-store');

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	let mockedDatabase = await databaseConnection.db(collectionName);
	appDbConnection.get.mockReturnValue(mockedDatabase);

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);
});

beforeEach(async () => {
	jest.clearAllMocks();
	await _clearDatabaseCollections();
	await _seedDatabase();
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
});

describe('document-meta-data', () => {
	describe('get by caseref', () => {
		it('should retrieve a planning application form', async () => {
			const fakeDocument = fakeDocuments.filter(
				(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.PLANNING_APPLICATION_FORM
			)[getRandomInt(99)];
			const url = `/api/v1/document-meta-data/case/${encodeURIComponent(
				fakeDocument.caseRef
			)}?documenttype=${encodeURIComponent(DOCUMENT_TYPES.PLANNING_APPLICATION_FORM)}`;
			const response = await appealsApi.get(url);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(fakeDocument);
		});
		it('should retrieve an appeal statement', async () => {
			const fakeDocument = fakeDocuments.filter(
				(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.APPEAL_STATEMENT
			)[getRandomInt(99)];
			const url = `/api/v1/document-meta-data/case/${encodeURIComponent(
				fakeDocument.caseRef
			)}?documenttype=${encodeURIComponent(DOCUMENT_TYPES.APPEAL_STATEMENT)}`;
			const response = await appealsApi.get(url);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(fakeDocument);
		});
		it('should retrieve a decision notice', async () => {
			const fakeDocument = fakeDocuments.filter(
				(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.DECISION_NOTICE
			)[getRandomInt(99)];
			const url = `/api/v1/document-meta-data/case/${encodeURIComponent(
				fakeDocument.caseRef
			)}?documenttype=${encodeURIComponent(DOCUMENT_TYPES.DECISION_NOTICE)}`;
			const response = await appealsApi.get(url);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(fakeDocument);
		});
		it('should retrieve a supporting document', async () => {
			const fakeDocument = fakeDocuments.filter(
				(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.SUPPORTING_DOCUMENTS
			)[getRandomInt(99)];
			const url = `/api/v1/document-meta-data/case/${encodeURIComponent(
				fakeDocument.caseRef
			)}?documenttype=${encodeURIComponent(DOCUMENT_TYPES.SUPPORTING_DOCUMENTS)}`;
			const response = await appealsApi.get(url);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(fakeDocument);
		});
		it('should handle no documents', async () => {
			const fakeDocument = fakeDocuments.filter(
				(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.SUPPORTING_DOCUMENTS
			)[getRandomInt(99)];
			const url = `/api/v1/document-meta-data/case/${encodeURIComponent(
				fakeDocument.caseRef
			)}?documenttype=nope`;
			const response = await appealsApi.get(url);
			expect(response.status).toEqual(404);
		});
	});

	describe('put', () => {
		it('should add a new document', async () => {
			const newDoc = { ...fakeDocuments[0], documentId: uuid.v4() };
			delete newDoc._id;

			const url = `/api/v1/document-meta-data/${newDoc.documentId}`;

			const response = await appealsApi.put(url).send(newDoc);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				matchedCount: 0,
				modifiedCount: 0,
				upsertedCount: 1
			});

			const collection = await databaseConnection.db(collectionName).collection(collectionName);
			const dbdoc = await collection.findOne({ documentId: newDoc.documentId });
			expect(dbdoc).toEqual(expect.objectContaining(newDoc));
		});

		it('should update existing document', async () => {
			const newDoc = { ...fakeDocuments[0], documentId: uuid.v4() };
			delete newDoc._id;
			const url = `/api/v1/document-meta-data/${newDoc.documentId}`;
			await appealsApi.put(url).send(newDoc);

			const updateDoc = { ...newDoc, version: 999, size: 1 };
			delete updateDoc._id;
			const response = await appealsApi.put(url).send(updateDoc);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0
			});
			const collection = await databaseConnection.db(collectionName).collection(collectionName);
			const dbdoc = await collection.findOne({ documentId: updateDoc.documentId });
			expect(dbdoc).toEqual(expect.objectContaining(updateDoc));
		});

		it('should 400 with bad schema', async () => {
			const badDoc = { documentId: '123', badData: 'yep' };
			const url = `/api/v1/document-meta-data/${'123'}`;

			const response = await appealsApi.put(url).send(badDoc);

			expect(response.status).toEqual(400);
		});
	});
});

const _seedDatabase = async () => {
	const collection = await databaseConnection.db(collectionName).collection(collectionName);
	await collection.insertMany(fakeDocuments);
};

const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(collectionName).collections();

	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
