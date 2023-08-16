const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const {
	fakeDocumentMetadata,
	getRandomInt,
	DOCUMENT_TYPES
} = require('./fixtures/documentMetadata');
const { isFeatureActive } = require('../../src/configuration/featureFlag');
const app = require('../../src/app');
let appealsApi;
let databaseConnection;
const collectionName = 'documentMetadata';
const { fakeDocuments } = fakeDocumentMetadata();

jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag');

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
	it('should retrieve a planning application form', async () => {
		const fakeDocument = fakeDocuments.filter(
			(fakeDocument) => fakeDocument.documentType === DOCUMENT_TYPES.PLANNING_APPLICATION_FORM
		)[getRandomInt(99)];
		const url = `/api/v1/document-meta-data/${encodeURIComponent(
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
		const url = `/api/v1/document-meta-data/${encodeURIComponent(
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
		const url = `/api/v1/document-meta-data/${encodeURIComponent(
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
		const url = `/api/v1/document-meta-data/${encodeURIComponent(
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
		const url = `/api/v1/document-meta-data/${encodeURIComponent(
			fakeDocument.caseRef
		)}?documenttype=nope`;
		const response = await appealsApi.get(url);
		expect(response.status).toEqual(404);
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
