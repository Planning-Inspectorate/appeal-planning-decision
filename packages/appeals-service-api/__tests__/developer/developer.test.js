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
const mockserver = require('mockserver-node');
var mockServer = require('mockserver-client'),
	mockServerClient = mockServer.mockServerClient;

let appealsApi;
let databaseConnection;
let messageQueue;

jest.setTimeout(120000);
jest.mock('../../src/lib/notify');
jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag', () => ({
	isFeatureActive: () => true
}));

beforeAll(async () => {
	////////////////////////////
	///// SETUP MOCKSERVER /////
	////////////////////////////

	mockserver.start_mockserver({ serverPort: 1080 });

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

	appConfiguration.secureCodes.finalComments.length = 4;
	appConfiguration.secureCodes.finalComments.expirationTimeInMinutes = 30;
	appConfiguration.services.horizon.url = 'http://localhost:1080/horizon';

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);
});

beforeEach(() => {
	// Clear all instances and calls to constructor and all methods:
	//HorizonGateway.mockClear();
	//mockGetFinalCommentsDueDate.mockClear();
});

afterAll(async () => {
	await databaseConnection.close();
	await messageQueue.teardown();
	mockserver.stop_mockserver({ serverPort: 1080 });
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
	it('should return a final comment entity and email the secure code for it to the appellant when requested, after creating the entity', async () => {
		// Given: a request to create a final comments entry for a case
		const caseReference = 'BAZ12345';
		const appellantEmail = 'foo@bar.com';

		// And: the final comments end date is set in the future
		await mockServerClient('localhost', 1080).mockSimpleResponse(
			'/horizon',
			finalCommentsEndDateInTheFutureJson,
			200
		);

		// When: we issue the request and try to see if it exists afterwards
		const postResponse = await _createFinalComment(caseReference, appellantEmail);
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get 204 in the POST response
		expect(postResponse.status).toBe(204);

		// And: we should get 200 in the GET response
		expect(getResponse.status).toBe(200);

		// And: it should send an email to the appellant with the final comments entity secure code
		expect(notify.sendSaveAndReturnEnterCodeIntoServiceEmail).toHaveBeenCalledWith(
			new RegExp(appConfiguration.secureCodes.finalComments.length)
		);
	});

	it('should return an error when requesting to create a final comment that has the same case reference as one already created', async () => {
		// Given: a request to create a final comments entry for a case is made
		const caseReference = 'BAZ12345';
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// When: we issue the request again
		const postResponse = _createFinalComment(caseReference, appellantEmail);

		// Then: we should get 409 in the POST response
		expect(postResponse.status).toBe(409);
	});

	it('should return an error when requesting a final comment entity that does not exist, not contact Horizon for a final comment end date, and not send an email to the appellant', async () => {
		// When: we try to get a final comment entry using a case reference that does not exist
		const getResponse = await appealsApi.get(`/api/v1/final_comments/DOES_NOT_EXIST`);

		// Then: we get 404 in the response
		expect(getResponse.status).toBe(404);

		// And: Horizon is not contacted for a final comments end date
		// expect(axios.post).not.toHaveBeenCalled();

		// And: no email is sent to the appellant containing the final comment's secure code
		expect(notify.sendFinalCommentsSecureCodeEmailToAppellant).not.toHaveBeenCalled();
	});

	it('should return an error when requesting a final comment entity that does exist, but its end date has not been set', async () => {
		// Given: there is a valid final comment entity
		const caseReference = 'BAZ12345';
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// And: the final comments end date has not been set
		// finalCommentsEndDate = undefined;
		// axios.post.mockResolvedValueOnce(createHorizonResponse(finalCommentsEndDate))

		// When: we try to get that final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: no email is sent to the appellant containing the final comment's secure code
		expect(notify.sendFinalCommentsSecureCodeEmailToAppellant).not.toHaveBeenCalled();
	});

	it('should return an error when requesting a final comment entity that does exist, but the date of the request is after its end date', async () => {
		// Given: there is a valid final comment entity
		const caseReference = 'BAZ12345'; // TODO: use this case ref in wiremock to return the end date in future response
		const appellantEmail = 'foo@bar.com';
		await _createFinalComment(caseReference, appellantEmail);

		// When: we try to get that final comment entity
		const getResponse = await appealsApi.get(`/api/v1/final_comments/${caseReference}`);

		// Then: we should get a 403 in the response
		expect(getResponse.status).toEqual(403);

		// And: no email is sent to the appellant containing the final comment's secure code
		expect(notify.sendFinalCommentsSecureCodeEmailToAppellant).not.toHaveBeenCalled();
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

const _createFinalComment = async (caseReference, appellantEmail) => {
	return await appealsApi
		.post('/api/v1/final_comments')
		.send({ case_reference: caseReference, appellant_email: appellantEmail });
};

const finalCommentsEndDateInTheFutureJson = {
	Envelope: {
		Body: {
			GetCaseResponse: {
				GetCaseResult: {
					Metadata: {
						Attributes: [
							{
								Name: {
									value: 'Case Document Dates:Final Comments Due Date'
								},
								Value: {
									value: '2100-12-31T00:00:00+00:00'
								}
							},
							{
								Name: {
									value: 'Curb your'
								},
								Value: {
									value: 'enthusiasm'
								}
							}
						]
					}
				}
			}
		}
	}
};
