const { householderAppeal } = require('./fixtures/householder-appeal');
const app = require('../../src/app');
const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const notify = require('../../src/lib/notify');
const uuid = require('uuid');

const { AMQPTestMessageQueue } = require('./amqp/amqp-test-message-queue');
const { AMQPTestConfiguration } = require('./amqp/amqp-test-configuration');
jest.setTimeout(120000);

jest.mock('../../src/lib/notify');
jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

let appealsApi;
let databaseConnection;
let messageQueue;

beforeAll(async () => {
	////////////////////////////
	///// SETUP TEST QUEUE /////
	////////////////////////////

	const amqpTestConfig = await AMQPTestConfiguration.create('test');
	messageQueue = new AMQPTestMessageQueue(amqpTestConfig);
	appConfiguration.messageQueue.horizonHASPublisher =
		amqpTestConfig.getTestConfigurationSettingsJSON();

	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db('foo');
	appDbConnection.get.mockReturnValue(mockedDatabase);

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);
});

afterAll(async () => {
	await databaseConnection.close();
	await messageQueue.teardown();
});

afterEach(() => {
	jest.clearAllMocks(); // We need to do this so that mock interactions are reset correctly between tests :)
});

describe('Appeals', () => {
	it('should submit an appeal to the message queue and send emails to the appellant and case worker when we create and submit an appeal', async () => {
		// Given an appeal is saved and when that appeal is submitted
		const savedAppealResponse = await _createAppeal();
		const savedAppeal = savedAppealResponse.body;

		// When: the appeal is submitted
		savedAppeal.state = 'SUBMITTED';
		await appealsApi.patch(`/api/v1/appeals/${savedAppeal.id}`).send(savedAppeal);

		// Then: the expected appeal data should be output on the output message queue
		const messageQueueData = await messageQueue.getMessageFromQueue();
		let appeal = JSON.parse(messageQueueData).appeal;
		savedAppeal.submissionDate = appeal.submissionDate;
		savedAppeal.updatedAt = appeal.updatedAt;
		expect(appeal).toMatchObject(savedAppeal);

		// And: a "submitted" email should be sent to the appellant and case worker
		savedAppeal.createdAt = new Date(savedAppeal.createdAt);
		savedAppeal.decisionDate = new Date(savedAppeal.decisionDate);
		savedAppeal.submissionDate = new Date(savedAppeal.submissionDate);
		savedAppeal.updatedAt = new Date(savedAppeal.updatedAt);
		expect(notify.sendSubmissionConfirmationEmailToAppellant).toHaveBeenCalledWith(savedAppeal);
		expect(notify.sendSubmissionReceivedEmailToLpa).toHaveBeenCalledWith(savedAppeal);
	});
	db = await connection.db('foo');

	appDbConnection.get.mockReturnValue(db);

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	request = supertest(server);
});

afterAll(async () => {
	await connection.close();
	await messageQueue.teardown();
});

describe('The API', () => {
	it('should submit an appeal to the message queue, send emails, and create a final comment entity when we make a PATCH request to /api/v1/appeals/{appeal_id}', async () => {
		// const finalCommentsEntity = {
		// 	case_reference: "",
		// 	secure_code: {
		// 		expires: 15431543126,
		// 		code: 1234,
		// 	},
		// 	documents:[{"id": ""}],
		// 	submitted_date: 15431543126,
		// 	created: "",
		// 	updated: ""
		// 	}

		// Given: an appeal
		const appealCreated = await request.post('/api/v1/appeals');
		householderAppeal.id = appealCreated.body.id;
		const savedAppeal = await request
			.put(`/api/v1/appeals/${appealCreated.body.id}`)
			.send(householderAppeal);

		// When: the appeal is submitted
		savedAppeal.body.state = 'SUBMITTED';
		await request.patch(`/api/v1/appeals/${appealCreated.body.id}`).send(savedAppeal.body);

		// Then: the expected appeal data should be output on the output message queue
		const response = await messageQueue.getMessageFromQueue();
		let appealObject = JSON.parse(response);
		savedAppeal.body.submissionDate = appealObject.appeal.submissionDate;
		savedAppeal.body.updatedAt = appealObject.appeal.updatedAt;

		expect(appealObject.appeal).toMatchObject(savedAppeal.body);

		// And: a "submitted" email should be sent to the appellant
		savedAppeal.body.createdAt = new Date(savedAppeal.body.createdAt);
		savedAppeal.body.decisionDate = new Date(savedAppeal.body.decisionDate);
		savedAppeal.body.submissionDate = new Date(savedAppeal.body.submissionDate);
		savedAppeal.body.updatedAt = new Date(savedAppeal.body.updatedAt);
		expect(notify.sendSubmissionConfirmationEmailToAppellant).toHaveBeenCalledWith(
			savedAppeal.body
		);

		// And: a "received" email should be sent to the case worker
		expect(notify.sendSubmissionReceivedEmailToLpa).toHaveBeenCalledWith(savedAppeal.body);

describe('Final comments API', () => {
	it('should return `true` when a GET request is made to `final_comments/{case_reference}` after a POST request to `/final_comments` with {case_reference} in the body', async () => {
		// Given: a request to create a case reference
		const caseReference = 'FOO/BAR/BAZ12345';
		await request.post('/api/v1/final_comments').send({ case_reference: caseReference });

	it('should return an error when requesting a final comment entity that does not exist', async () => {
		// When: we try to get a final comment entry using a case reference that does not exist
		const getResponse = await appealsApi.get(`/api/v1/final_comments/DOES_NOT_EXIST`);

		// Then: we get 404 in the response
		expect(getResponse.status).toBe(404);
	});
});

const _createAppeal = async () => {
	const appealCreatedResponse = await appealsApi.post('/api/v1/appeals');
	const appealCreated = appealCreatedResponse.body;

	householderAppeal.id = appealCreated.id;
	const savedAppealResponse = await appealsApi
		.put(`/api/v1/appeals/${appealCreated.id}`)
		.send(householderAppeal);

	return savedAppealResponse;
};

// function createHorizonResponse(finalCommentsDueDate) {
// 	return {
// 		Envelope: {
// 			Body: {
// 				GetCaseResponse: {
// 					GetCaseResult: {
// 						Metadata: {
// 							Attributes: [
// 								{
// 									Name: {
// 										value: 'Case Document Dates:Final Comments Due Date'
// 									},
// 									Value: {
// 										value: finalCommentsDueDate
// 									}
// 								},
// 								{
// 									Name: {
// 										value: 'Curb your enthusiasm'
// 									},
// 									Value: {
// 										value: 'frolic'
// 									}
// 								}
// 							]
// 						}
// 					}
// 				}
// 			}
// 		}
// 	};
