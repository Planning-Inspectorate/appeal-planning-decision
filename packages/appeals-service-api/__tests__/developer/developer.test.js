const householderAppeal = require('../../src/business-rules/test/data/householder-appeal');
const app = require('../../src/app');
const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const notify = require('../../src/lib/notify');

const { AMQPTestMessageQueue } = require('./amqp/amqp-test-message-queue');
const { AMQPTestConfiguration } = require('./amqp/amqp-test-configuration');
jest.setTimeout(60000);

jest.mock('../../src/lib/notify');
jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

let request;
let connection;
let db;
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

	connection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
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

describe('Appeals API', () => {
	it('should submit an appeal to the message queue and send emails to the appellant and case worker when we make a PATCH request to /api/v1/appeals/{appeal_id}', async () => {
		// Given: an appeal
		const appealCreated = await request.post('/api/v1/appeals').body;
		householderAppeal.id = appealCreated.id;
		const savedAppeal = await request
			.put(`/api/v1/appeals/${appealCreated.id}`)
			.send(householderAppeal).body;

		// When: the appeal is submitted
		savedAppeal.state = 'SUBMITTED';
		await request.patch(`/api/v1/appeals/${appealCreated.id}`).send(savedAppeal);

		// Then: the expected appeal data should be output on the output message queue
		const response = await messageQueue.getMessageFromQueue();
		let appeal = JSON.parse(response).appeal;
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
});

describe('Final comments API', () => {
	it('should return `true` when a GET request is made to `final_comments/{case_reference}` after a POST request to `/final_comments` with {case_reference} in the body', async () => {
		// Given: a request to create a case reference
		const caseReference = 'FOO/BAR/BAZ12345';
		await request.post('/api/v1/final_comments').send({ case_reference: caseReference });

		// When: we try to see if the final comments entity exists given a known case reference
		const response = await request.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get true in the response
		expect(response.status).toBe(200);
	});
});

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
