const fakeDocuments = require('./fixtures/mongo-db-data');
const { MongoClient, ObjectId } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const { MongoRepository } = require('../../src/repositories/mongo-repository');

const dbName = 'test';
const collectionName = 'testCollection';
const seedData = fakeDocuments();

let databaseConnection;

jest.setTimeout(120000);
jest.mock('../../src/db/db');

let mockedDatabase;

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	appDbConnection.connect();
	mockedDatabase = await databaseConnection.db(dbName);
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
		const repo = new MongoRepository(collectionName);
		const query = {
			_id: ObjectId('5ca4bbcea2dd94ee58162a65')
		};

		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);
		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});
		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query);
		expect(result).toBeTruthy();
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query);
	});
});
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();
	for (const collection of databaseCollections) {
		await collection.drop();
	}
};

const _seedDatabase = async () => {
	const collection = await databaseConnection.db(dbName).collection(collectionName);
	await collection.insertMany(seedData);
};
