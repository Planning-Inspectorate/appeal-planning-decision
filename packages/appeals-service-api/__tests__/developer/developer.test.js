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

    /////////////////////////////
    ///// SETUP TEST CONFIG /////
    /////////////////////////////

    appConfiguration.secureCodes.finalComments.length = 4
    appConfiguration.secureCodes.finalComments.expirationTimeInMinutes = 30

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

	it(`should return an error if we try to update an appeal that doesn't exist`, async () => {
		// When: an appeal is sent via a PUT or PATCH request, but hasn't yet been created
		householderAppeal.id = uuid.v4();
		const putResponse = await appealsApi
			.put(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		const patchResponse = await appealsApi
			.patch(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		// Then: we should get a 404 status code for both requests
		expect(putResponse.status).toBe(404);
		expect(patchResponse.status).toBe(404);

		// And: there should be no data on the message queue
		const messageQueueData = await messageQueue.getMessageFromQueue();
		expect(messageQueueData).toBe(undefined);

		// And: there should be no interactions with the email sender
		expect(notify.sendSubmissionConfirmationEmailToAppellant).not.toHaveBeenCalled();
		expect(notify.sendSubmissionReceivedEmailToLpa).not.toHaveBeenCalled();
	});

	it('should return the relevant appeal when requested after the appeal has been saved', async () => {
		// Given: an appeal is created
		const savedAppeal = await _createAppeal();

		// When: we try to request that appeal
		const requestedAppeal = await appealsApi.get(`/api/v1/appeals/${savedAppeal.body.id}`);

		// Then: we should get a 200 status
		expect(requestedAppeal.status).toEqual(200);

		// And: the correct appeal should be returned
		expect(requestedAppeal.body.id).toEqual(savedAppeal.body.id);
	});

	it(`should return an error if an appeal is requested that doesn't exist`, async () => {
		// When: we try to access a non-existent appeal
		const getAppealResponse = await appealsApi.get(`/api/v1/appeals/${uuid.v4()}`);

		// Then: we should get a 400 status
		expect(getAppealResponse.status).toEqual(404);
	});
});

describe('Final comments', () => {
	it('should return a final comment entity after creating it', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = 'BAZ12345';
		const appellant_email = 'foo@bar.com';

		// When: we issue the request and try to see if it exists afterwards
		const postResponse = await appealsApi
			.post('/api/v1/final_comments')
			.send({ case_reference: caseReference, appellant_email: appellant_email });
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get 204 in the POST response
		expect(postResponse.status).toBe(204);

		// And: we should get 200 in the GET response
		expect(getResponse.status).toBe(200);
	});

	it('should return an error when requesting to create a final comment that has the same case reference as one already created', async () => {
		// Given: a request to create a final comments entry for a case is made
		const caseReference = 'BAZ12345';
		const appellant_email = 'foo@bar.com';
		await appealsApi
			.post('/api/v1/final_comments')
			.send({ case_reference: caseReference, appellant_email: appellant_email });

		// When: we issue the request again
		const postResponse = await appealsApi
			.post('/api/v1/final_comments')
			.send({ case_reference: caseReference, appellant_email: appellant_email });

		// Then: we should get 409 in the POST response
		expect(postResponse.status).toBe(409);
	});

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