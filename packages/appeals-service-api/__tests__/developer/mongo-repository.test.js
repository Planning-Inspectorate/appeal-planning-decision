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

describe('mongo-repository', () => {
	it('should perform a simple query with no projection and return 1 document', async () => {
		const repo = new MongoRepository(collectionName);
		const query = {
			_id: ObjectId('5ca4bbcea2dd94ee58162a65')
		};
		const [expectedDocument] = seedData.filter((s) => s._id.toString() === query._id.toString());
		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);
		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});
		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query);
		expect(result).toBeTruthy();
		expect(result._id).toEqual(expectedDocument._id);
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query);
	});
	it('should perform a simple query with a projection, and return 1 document with the correct fields', async () => {
		const repo = new MongoRepository(collectionName);
		const query = {
			_id: ObjectId('5ca4bbcea2dd94ee58162a65')
		};

		const projection = {
			username: 1,
			email: 1
		};

		const [expectedDocument] = seedData.filter((s) => s._id.toString() === query._id.toString());
		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});

		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query, null, projection);
		expect(result).toBeTruthy();
		expect(result._id).toEqual(expectedDocument._id);
		expect(result.address).toBeFalsy();
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			projection: projection
		});
	});
	it('should perform a descended sorted query', async () => {
		// NB as unintuitive as this sounds a sorted query will affect which document is returned. As in highlander, there can be only one!
		const repo = new MongoRepository(collectionName);
		const query = {
			username: 'ekrabappel'
		};
		const sort = {
			version: -1 // descending order
		};

		const [expectedDocument] = seedData.filter(
			(s) => s.username === query.username && s.version === 3
		);
		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});

		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query, sort);
		expect(result).toBeTruthy();
		expect(result._id).toEqual(expectedDocument._id);
		expect(result.version).toEqual(expectedDocument.version);
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			sort: sort
		});
	});
	it('should perform an ascended sorted query', async () => {
		// NB as unintuitive as this sounds a sorted query will affect which document is returned. As in highlander, there can be only one!
		const repo = new MongoRepository(collectionName);
		const query = {
			username: 'ekrabappel'
		};
		const sort = {
			version: 1 // ascending order
		};

		const [expectedDocument] = seedData.filter(
			(s) => s.username === query.username && s.version === 1
		);
		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});

		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query, sort);
		expect(result).toBeTruthy();
		expect(result._id).toEqual(expectedDocument._id);
		expect(result.version).toEqual(expectedDocument.version);
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			sort: sort
		});
	});
	it('should perform a descended sorted query with projection', async () => {
		// NB as unintuitive as this sounds a sorted query will affect which document is returned. As in highlander, there can be only one!
		const repo = new MongoRepository(collectionName);
		const query = {
			username: 'ekrabappel'
		};
		const projection = {
			username: 1,
			email: 1,
			version: 1
		};
		const sort = {
			version: -1 // descending order
		};

		const [expectedDocument] = seedData.filter(
			(s) => s.username === query.username && s.version === 3
		);
		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});

		const spy2 = jest.spyOn(collection, 'findOne');
		const result = await repo.findOneByQuery(query, sort, projection);
		expect(result).toBeTruthy();
		expect(result._id).toEqual(expectedDocument._id);
		expect(result.version).toEqual(expectedDocument.version);
		expect(result.address).toBeFalsy();
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			sort: sort,
			projection: projection
		});
	});
	it('should get all documents with a projection and an empty sort', async () => {
		const repo = new MongoRepository(collectionName);
		const query = {
			username: 'ekrabappel'
		};
		const sort = {};
		const expectedDocuments = seedData
			.filter((s) => s.username === query.username)
			.map((document) => ({
				_id: document._id,
				username: document.username,
				email: document.email
			}));

		const projection = {
			username: 1,
			email: 1
		};

		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});
		const spy2 = jest.spyOn(collection, 'find');
		const result = await repo.getAllDocumentsThatMatchQuery(query, sort, projection);
		expect(result).toBeTruthy();
		expect(result).toEqual(expectedDocuments);
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			projection: projection
		});
	});

	it('should perform a descended sorted query with projection for all documents', async () => {
		const repo = new MongoRepository(collectionName);
		const query = {
			username: 'ekrabappel'
		};
		const sort = {
			version: -1
		};
		const expectedDocuments = seedData
			.filter((s) => s.username === query.username)
			.map((document) => ({
				_id: document._id,
				username: document.username,
				email: document.email
			}));

		const projection = {
			username: 1,
			email: 1
		};

		const sortedExpectedDocuments = [
			expectedDocuments[2],
			expectedDocuments[1],
			expectedDocuments[0]
		];

		const spy = jest.spyOn(mockedDatabase, 'collection');
		const collection = mockedDatabase.collection(collectionName);

		appDbConnection.get = jest.fn().mockReturnValue({
			collection: () => collection
		});
		const spy2 = jest.spyOn(collection, 'find');
		const result = await repo.getAllDocumentsThatMatchQuery(query, sort, projection);
		expect(result).toBeTruthy();
		expect(result).toEqual(sortedExpectedDocuments);
		expect(spy).toHaveBeenCalledWith(collectionName);
		expect(spy2).toHaveBeenCalledWith(query, {
			sort: sort,
			projection: projection
		});
	});

	it('should insert document using updateOne if filter value does not already exist', async () => {
		const repo = new MongoRepository('testUpdateCollection');
		const filter = { id: '1234' };
		const testDate = new Date('2020-12-17T03:24:00');
		const set = { testField: 'test value', updateDate: testDate };
		await repo.updateOne(filter, { $set: set, $setOnInsert: { startDate: testDate } });

		const result = await repo.findOneByQuery(filter);

		expect(result.id).toBe('1234');
		expect(result.startDate).toBeInstanceOf(Date);
		expect(result.updateDate).toEqual(result.startDate);
		expect(result.testField).toBe('test value');
	});

	it('should update document using updateOne if filter value already exists', async () => {
		let set;
		const repo = new MongoRepository('testUpdateCollection');
		const filter = { id: '5678' };
		const testDate = new Date('2020-12-17T03:24:00');
		set = { testField: 'created', testField2: 'stays the same', updateDate: testDate };

		//create
		await repo.updateOne(filter, { $set: set, $setOnInsert: { startDate: testDate } });

		//set updated document value and update
		const testDate2 = new Date('2021-12-17T03:24:00');
		set = { testField: 'updated', updateDate: testDate2 };
		await repo.updateOne(filter, { $set: set, $setOnInsert: { startDate: testDate2 } });

		// check result
		const result = await repo.findOneByQuery(filter);

		expect(result.id).toBe('5678');
		expect(result.startDate).toEqual(testDate);
		expect(result.updateDate).toEqual(testDate2);
		expect(result.testField).toBe('updated');
		expect(result.testField2).toBe('stays the same');
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
