// const app = require('../../src/app');
// const http = require('http');
// const supertest = require('supertest');
// const householderAppeal = require('../../src/business-rules/test/data/householder-appeal');
const { MongoClient } = require('mongodb');
// const { destroyMongoContainer } = require('./mongodb-container-helper');
// const { destroyAMQPTestQueue } = require('./amqp-container-helper');
// const appDbConnection = require('../../src/db/db');

// jest.mock('../../src/db/db');
// jest.mock('axios');
jest.setTimeout(120000);

if (process.env.FINAL_COMMENT_FEATURE_ACTIVE) {
	// let request;
	let db;

	beforeAll(async () => {
		let connection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db('foo');

		// appDbConnection.get.mockReturnValue(db);
		// console.log('Setup mock!');
		// let server = http.createServer(app);
		// request = supertest(server);
	});

	afterAll(async () => {
		// await destroyMongoContainer();
		// await destroyAMQPTestQueue();
	});

	describe('AS-5408', () => {
		it('should return true when the final comments submission date has been specified for the appeal, and is later than the current date', async () => {
			// Given: the current date is 15th September 2022
			// jest.useFakeTimers().setSystemTime(new Date(2022, 9, 15));

			// // And: there is an appeal in the database that is to have its final comments updated
			// const appeal = JSON.parse(JSON.stringify(householderAppeal));
			// const caseRef = '1234567'; // This will be used to get the submission window
			// appeal.horizonId = caseRef;
			// const appealCreated = await request.post(`/api/v1/appeals/`).send(appeal);
			// console.log(appealCreated);

			// const response = await request.get(`/api/v1/appeals/${appealCreated.id}`);

			const foo = db.collection('foo');
			const fooInserted = await foo.insertOne({ value: 'test' });
			const fooInsertedId = fooInserted.insertedId;
			const fooReturned = await foo.findOne({ _id: fooInsertedId }, {});
			console.log(fooInsertedId);

			expect(fooReturned).toEqual({ _id: fooInsertedId, value: 'test' });

			// // And: the appeal's final comments window closes on 16th September 2022
			// axios.post.mockResolvedValue(createHorizonResponse('2022-09-16T00:00:00+00:00'));

			// // When: the final comments submission window is queried for the appeal
			// const response = await request(appealsApi)
			// 	.get(`/api/v1/appeals/${appealCreated.id}/`)
			// 	.set('Accept', 'application/json');

			// // Then: we should get a 200 in the response and the body should say that the window is open
			// expect(response.statusCode).toBe(200); // Accepted for processing later
			// expect(response.body).toEqual({open: true})
		});

		// it('should be possible to upload final comments to an appeal during the final comments window', async () => {
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
		// });
	});
}

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
