import { env } from 'node:process';
import * as appealsDatabaseContainer from 'testcontainers-mongoose';
import fullAppeal from '../../../forms-web-app/__tests__/mockData/full-appeal';

const appealsDatabase = require('mongoose');
const axios = require('axios');
const {
	createAMQPTestQueue,
	sendMessageToAMQPTestQueue,
	getMessageFromAMQPTestQueue,
	destroyAMQPTestQueue
} = require('./amqp-external-system-test-helper');

if (env.FINAL_COMMENT_FEATURE_ACTIVE) {
	jest.setTimeout(120000);
	jest.mock('axios');

	beforeAll(async () => {
		await appealsDatabaseContainer.connect();
		await createAMQPTestQueue();
	});

	afterAll(async () => {
		await appealsDatabaseContainer.closeDatabase();
		await destroyAMQPTestQueue();
	});

	describe('AS-5408', () => {
		// it('works', async () => {
		// 	sendMessageToAMQPTestQueue(`message1`);
		// 	let message = await getMessageFromAMQPTestQueue();
		// 	expect(message).toBe(`message1`);
		// });

		// it('works again', async () => {
		// 	sendMessageToAMQPTestQueue(`message2`);
		// 	let message = await getMessageFromAMQPTestQueue();
		// 	expect(message).toBe(`message2`);
		// });

		it('should be possible to upload final comments to an appeal during the final comments window', async () => {
			// Given: the current date is 15th September 2022
			jest.useFakeTimers().setSystemTime(new Date(2022, 9, 15));

			// And: there is an appeal in the database that is to have its final comments updated
			let appealJson = fullAppeal.appeal;
			const caseRef = '1234567'; // This will be used to get the submission window
			appealJson.horizonId = caseRef;
			const Appeal = appealsDatabase.model(
				'appeals',
				new appealsDatabase.Schema({}, { strict: false })
			); // We don't want to specify the *MASSIVE* spec for an appeal here...
			const appeal = new Appeal(appealJson);
			await appeal.save();

			// And: the appeal's final comments window closes on 16th September 2022
			axios.patch.mockResolvedValue(createHorizonResponse('2022-09-16T00:00:00+00:00')); // TODO: we should also specify the URL so we know the implementation is calling the expected URL

			// When: the appellent attempts to upload final comments to their appeal
			let finalCommentsFreeTextJson = {
				id: '14986758-8hj4-30q7-76gd-4bv5n41ge1xz',
				name: 'mock.jpg',
				location: 'tgeajghd87f6ty5432hjti8787rg',
				size: '1899543'
			};
			let finalCommentsDoc1Json = {
				id: '59c55221-ddaa-4ef8-ba48-c2570b3418e8',
				name: 'attinghamparkbees.jpg',
				location: '36d62a0dcb32c3648c8b0f023383464f',
				size: '189549'
			};
			let finalCommentsDoc2Json = {
				id: '61024954-2dd7-41c2-95ea-0fc2e35fa9bb',
				name: 'attinghamparkbees.jpg',
				location: '0d6f62cf1fa8d0797060e5eb6b8dad8f',
				size: '189549'
			};
			let finalComments = {
				freeText: 'This is some text to upload as a final comment',
				documents: [finalCommentsDoc1Json, finalCommentsDoc2Json]
			};
			axios.put.mockResolvedValue(finalCommentsFreeTextJson);
			const response = await axios.patch(`appeals/${appeal._id}/final_comments?caseRef`, {
				finalComments: finalComments
			});

			// Then: we should get a 2xx in the response
			expect(response.status()).toBe('202'); // Accepted for processing later

			// And: the application with final comments should appear on the Horizon input queue for processing
			appealJson.finalComments = [
				finalCommentsDoc1Json,
				finalCommentsDoc2Json,
				finalCommentsFreeTextJson
			];
			let message = getMessageFromAMQPTestQueue();
			expect(message).toBe(appealJson);
		});
	});
}

function createHorizonResponse(finalCommentsDueDate) {
	return {
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
										value: finalCommentsDueDate
									}
								},
								{
									Name: {
										value: 'Curb your enthusiasm'
									},
									Value: {
										value: 'frolic'
									}
								}
							]
						}
					}
				}
			}
		}
	};
}
