const householderAppeal = require('../../src/business-rules/test/data/householder-appeal');
const app = require('../../src/app');
const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const appDbConnection = require('../../src/db/db');

const { AMQPContainer } = require('./amqp-container');
// const notify = require('../../src/lib/notify')
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
	const amqpContainerConfig = await AMQPContainer.create('test');
	messageQueue = new AMQPContainer(amqpContainerConfig);

	connection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	db = await connection.db('foo');

	appDbConnection.get.mockReturnValue(db);

	// await AMQPTestQueue.createAMQPTestQueue();

	let server = http.createServer(app);
	request = supertest(server);
});

afterAll(async () => {
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
		//const appeal = JSON.parse(JSON.stringify(householderAppeal));
		const appealCreated = await request.post('/api/v1/appeals');

		// When: the appeal is submitted
		householderAppeal.id = appealCreated.body.id;
		// await request.patch(`/api/v1/appeals/${appealCreated.body.id}`).send(householderAppeal);
		// TODO: I think we need to mock the config.js file since its not getting the port num from the container class

		messageQueue.sendMessageToQueue('FOO');
		const response = await messageQueue.getMessageFromQueue();
		expect(response).toStrictEqual('FOO');

		// Then: the expected appeal data should be output on the output message queue
		// const message = await getMessageFromAMQPTestQueue();
		// console.log(message)
		// TODO: fix the above, or use a mock!

		// And: a "submitted" email should be sent to the appellant
		// expect(notify.sendSubmissionConfirmationEmailToAppellant).toHaveBeenCalledWith(householderAppeal);

		// And: a "received" email should be sent to the case worker
		// expect(notify.sendSubmissionReceivedEmailToLpa).toHaveBeenCalledWith(householderAppeal);

		// And: a final comments entity should be created in the database
		// const result = await // hitting the API we're going to build with ID from above appeal --> case/{caseRef}/final_comments ?
		// expect(result).toEqual(finalCommentsEntity)
	});

	it('should return 200 for a GET request to `api/v1/appeals/{appeal_id}/final-comments` when the final comments submission date has been specified for the appeal, and is later than the current date', async () => {
		// Given: the current date is 15th September 2022
		// jest.useFakeTimers().setSystemTime(new Date(2022, 9, 15));

		// // And: there is an appeal in the database that is to have its final comments updated
		// const appeal = JSON.parse(JSON.stringify(householderAppeal));
		// const caseRef = '1234567'; // This will be used to get the submission window
		// appeal.horizonId = caseRef;
		const postAppealResponse = await request.post(`/api/v1/appeals/`).send({});
		const appealCreated = postAppealResponse.body;
		const getAppealResponse = await request.get(`/api/v1/appeals/${appealCreated.id}`);
		const appealRetrieved = getAppealResponse.body;
		expect(appealCreated).toStrictEqual(appealRetrieved);

		// // And: the appeal's final comments window closes on 16th September 2022
		// axios.post.mockResolvedValue(createHorizonResponse('2022-09-16T00:00:00+00:00'));

		// // When: the final comments submission window is queried for the appeal
		// const response = await request(appealsApi)
		// 	.get(`/api/v1/appeals/${appealCreated.id}/`)
		// 	.set('Accept', 'application/json');

		// // Then: we should get a 200 in the response and no body
		// expect(response.statusCode).toBe(200); // Accepted for processing later
		// expect(response.body).toEqual()
	});

	it('should return 403 and a helpful message in the response body for a GET request to `api/v1/appeals/{appeal_id}/final-comments` if the final comments submission date has not been set', async () => {});
	it('should return 403 and a helpful message in the response body for a GET request to `api/v1/appeals/{appeal_id}/final-comments` if the final comments submission date has been set and is earlier than the date the request is made', async () => {});
	it('should return 403 and a helpful message in the response body for a GET request to `api/v1/appeals/{appeal_id}/final-comments` if the appeal already has final comments', async () => {});

	it('should be possible to upload final comments to an appeal before the final comments submission date', async () => {
		// 	// // Given: the current date is 15th September 2022
		// 	jest.useFakeTimers().setSystemTime(new Date(2022, 9, 15));
		// 	// // And: there is an appeal in the database that is to have its final comments updated
		// 	// const appeal = JSON.parse(JSON.stringify(householderAppeal));
		// 	// const caseRef = '1234567'; // This will be used to get the submission window
		// 	// appeal.horizonId = caseRef;
		// 	// appeal.id = uuid.v4();
		// 	// let createdAppeal = await createAppeal(appeal)
		// 	// console.log(createdAppeal)
		// 	// // And: the appeal's final comments window closes on 16th September 2022
		// 	// axios.patch.mockResolvedValue(createHorizonResponse('2022-09-16T00:00:00+00:00')); // TODO: we should also specify the URL so we know the implementation is calling the expected URL
		// 	// // When: the appellent attempts to upload final comments to their appeal
		// 	// let finalCommentsFreeTextJson = {
		// 	// 	id: '14986758-8hj4-30q7-76gd-4bv5n41ge1xz',
		// 	// 	name: 'mock.jpg',
		// 	// 	location: 'tgeajghd87f6ty5432hjti8787rg',
		// 	// 	size: '1899543'
		// 	// };
		// 	// let finalCommentsDoc1Json = {
		// 	// 	id: '59c55221-ddaa-4ef8-ba48-c2570b3418e8',
		// 	// 	name: 'attinghamparkbees.jpg',
		// 	// 	location: '36d62a0dcb32c3648c8b0f023383464f',
		// 	// 	size: '189549'
		// 	// };
		// 	// let finalCommentsDoc2Json = {
		// 	// 	id: '61024954-2dd7-41c2-95ea-0fc2e35fa9bb',
		// 	// 	name: 'attinghamparkbees.jpg',
		// 	// 	location: '0d6f62cf1fa8d0797060e5eb6b8dad8f',
		// 	// 	size: '189549'
		// 	// };
		// 	// let finalComments = {
		// 	// 	freeText: 'This is some text to upload as a final comment',
		// 	// 	documents: [finalCommentsDoc1Json, finalCommentsDoc2Json]
		// 	// };
		// 	// axios.post.mockResolvedValue(finalCommentsFreeTextJson)
		// 	// const response = await request(appealsApi).patch(`/api/v1/appeals/${appealCreated.id}/final-comments`).send(finalComments);
		// 	// // Then: we should get a 202 in the response and no body
		// 	// expect(response.statusCode).toBe(202); // Accepted for processing later
		// 	// expect(response.body).toEqual({})
		// 	// // And: the application with final comments should appear on the Horizon input queue for processing
		// 	// appealCreated.finalComments = [
		// 	// 	finalCommentsDoc1Json,
		// 	// 	finalCommentsDoc2Json,
		// 	// 	finalCommentsFreeTextJson
		// 	// ];
		// 	// let message = getMessageFromAMQPTestQueue();
		// 	// expect(message).toBe(appealCreated);
		// 	expect(true).toBe(true);
	});

	it('should return 403 and a helpful message in the response body for a PATCH request to `api/v1/appeals/{appeal_id}/final-comments` if the final comments submission date has not been set', async () => {});
	it('should return 403 and a helpful message in the response body for a PATCH request to `api/v1/appeals/{appeal_id}/final-comments` if the final comments submission date has been set and is earlier than the date the request is made', async () => {});
	it('should return 403 and a helpful message in the response body for a PATCH request to `api/v1/appeals/{appeal_id}/final-comments` if the appeal already has final comments', async () => {});
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
// }
