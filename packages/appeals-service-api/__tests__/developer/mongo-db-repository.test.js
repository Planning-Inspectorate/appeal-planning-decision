const fakeDocuments = require('./fixtures/mongo-db-data');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const { MongoRepository } = require('../../src/repositories/mongo-repository');

const dbName = 'test';
const seedData = fakeDocuments();

let databaseConnection;

jest.setTimeout(120000);
jest.mock('../../src/db/db');

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	let mockedDatabase = await databaseConnection.db(dbName);
	appDbConnection.get.mockReturnValue(mockedDatabase);
});

beforeEach(async () => {
	jest.clearAllMocks();
	await _clearDatabaseCollections();
	await _seedDatabase();
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
});

describe('mongo-db-repository', () => {
	it('should perform a simple query with no projection and return 1 document', async () => {
		const repo = new MongoRepository(dbName);
		const result = await repo.findOneByQuery({
			_id: '5ca4bbcea2dd94ee58162a68'
		});
		console.log(result);
	});
});
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();
	for (const collection of databaseCollections) {
		await collection.drop();
	}
};

const _seedDatabase = async () => {
	const collection = await databaseConnection.db(dbName).collection(dbName);
	await collection.insertMany(seedData);
};
