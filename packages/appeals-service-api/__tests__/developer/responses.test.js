const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const { ResponsesRepository } = require('../../src/repositories/responses-repository');

const dbName = 'test';
//const collectionName = 'responses';

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
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
	jest.useRealTimers();
});

describe('responses', () => {
	it('creates a new entry in db', async () => {
		const repo = new ResponsesRepository();
		const journeyId = 'has-questionnaire';
		const referenceId = '987654';
		const answers = {
			answers: {
				answer1: 'this',
				answer2: 'that'
			}
		};

		await repo.patchResponses(journeyId, referenceId, answers);

		const result = await repo.getResponses(`${journeyId}:${referenceId}`);

		expect(result.answers).toEqual(answers.answers);
		expect(result.uniqueId).toEqual(`${journeyId}:${referenceId}`);
		expect(result.journeyId).toEqual(journeyId);
		expect(result.referenceId).toEqual(referenceId);
		expect(result.startDate instanceof Date).toBe(true);
		expect(result.updateDate instanceof Date).toBe(true);
		expect(result.updateDate).toEqual(result.startDate);
	});

	it('updates an existing entry in db', async () => {
		const repo = new ResponsesRepository();
		const journeyId = 'has-questionnaire';
		const referenceId = '123456';
		const answers = {
			answers: {
				answer1: 'answer to keep',
				answer2: 'answer to update'
			}
		};

		// create initial entry
		await repo.patchResponses(journeyId, referenceId, answers);
		const initialResult = await repo.getResponses(`${journeyId}:${referenceId}`);
		const initialDate = initialResult.startDate;

		// update entry
		const updatedAnswers = {
			answers: {
				answer2: 'updated answer'
			}
		};
		//allow some time to pass before updating
		jest.setTimeout(200);
		await repo.patchResponses(journeyId, referenceId, updatedAnswers);

		// expect entry to be updated

		const result = await repo.getResponses(`${journeyId}:${referenceId}`);

		expect(result.answers).toEqual({
			answer1: answers.answers.answer1,
			answer2: updatedAnswers.answers.answer2
		});
		expect(result.startDate).toEqual(initialDate);
		expect(result.updateDate).not.toEqual(result.startDate);
	});
});

const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();
	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
