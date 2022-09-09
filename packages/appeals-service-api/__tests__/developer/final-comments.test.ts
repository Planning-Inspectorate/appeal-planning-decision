import { env } from 'node:process';
const axios = require('axios');
const {
	createAMQPTestQueue,
	sendMessageToAMQPTestQueue,
	getMessageFromAMQPTestQueue,
	destroyAMQPTestQueue
} = require('./amqp-external-system-test-helper');

if (env.FINAL_COMMENT_FEATURE_ACTIVE) {
	jest.setTimeout(60000);
	jest.mock('axios');

	beforeAll(async () => {
		await createAMQPTestQueue();
	});

	afterAll(async () => {
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

			// And: an appeal whose final comments window is 16th September 2022
			axios.patch.mockResolvedValue(createHorizonResponse('2022-09-16T00:00:00+00:00')); // TODO: we should also specify the URL so we know the implementation is calling the expected URL

			// When: the appellent uploads final comments within the final comments window
			let finalComments = '¯_(ツ)_/¯';
			// const response = request.patch('appeal/{id}/final_comments').withBody({"finalComments": finalComments});

			// Then: we should get a 2xx in the response
			// expect(response.status()).toBe("202") // Accepted for processing later

			// And: the application with final comments should appear on the Horizon input queue for processing
			// let expectedApplication = {}
			let message = getMessageFromAMQPTestQueue();
			expect(message).toBe(expectedApplication);
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
							Attributes: {
								AttributeValue: {
									Name: {
										value: 'Case Document Dates:Final Comments Due Date'
									},
									Value: {
										value: finalCommentsDueDate
									}
								},
								AttributeValue: {
									Name: {
										value: 'Curb your enthusiasm'
									},
									Value: {
										value: 'frolic'
									}
								}
							}
						}
					}
				}
			}
		}
	};
}
