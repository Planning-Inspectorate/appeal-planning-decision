import { env } from 'node:process';
const {
	startContainer,
	stopContainer,
	sendMessage,
	getMessages
} = require('./rabbitmq-test-helper');

if (env.FINAL_COMMENT_FEATURE_ACTIVE) {
	jest.setTimeout(60000);

	beforeAll(async () => {
		await startContainer();
	});

	afterAll(async () => {
		await stopContainer();
	});

	describe('AS-5408', () => {
		it('works', async () => {
			sendMessage(`message`);
			let messages: Promise<string[]> = getMessages(1);
			expect((await messages).length).toBe(1);
		});

		it('works again', async () => {
			sendMessage(`message`);
			let messages: Promise<string[]> = getMessages(1);
			expect((await messages).length).toBe(1);
		});

		// it('should be possible to upload final comments to an appeal if this is attempted during the final comments window', async () => {

		// 	// Given: a request date of the 15th September 2022
		// 	const requestDate = new Date(2022, 9, 15);

		// 	// And: an appeal whose final comments window spans 14th September 2022 to 16th September 2022
		// 	const finalCommentsWindowStart = new Date(2022, 9, 14);
		// 	const finalCommentsWindowEnd = new Date(2022, 9, 16);
		// 	horizonMock.get('case/' + application.id).shouldReturn(horizonApplication);

		// 	// When: the appellent uploads final comments within the final comments window
		// 	application.finalComments = // ¯\_(ツ)_/¯
		// 	const response = request.post('application/{id}/final_comments');

		// 	// Then: we should get a 2xx in the response

		// 	// And: the application with final comments should appear on the Horizon input queue for processing
		// 	queue.getFirst() == application;
		// });

		// it('should not be possible to upload final comments to an appeal if this is attempted before the final comments window', async () => {
		// 	//Given
		// 	// I am appellant who has submitted an application post /application
		// 	// Aquire relevant appeals object from horizon
		// 	requestDate = // some date
		// 		horizonApplication.finalCommentsWindowStart = // request date + 1 day
		// 		horizonApplication.finalCommentsWindowEnd = // request date + 2 day
		// 			horizonMock.get('case/' + application.id).shouldReturn(horizonApplication); // Make work good

		// 	//When: the appellent uploads final comments within the final comments window
		// 	application.finalComments = // ¯\_(ツ)_/¯
		// 		response = request.post('application/{id}/final_comments');

		// 	//Then: we should get a 4xx in the response
		// 	response.status().shouldEqual('4xx');

		// 	// And: the application with final comments should not appear on the Horizon input queue for processing
		// 	queue.isEmpty();
		// });

		// it('should not be possible to upload final comments to an appeal if this is attempted after the final comments window', async () => {
		// 	//Given
		// 	// I am appellant who has submitted an application post /application
		// 	// Aquire relevant appeals object from horizon
		// 	requestDate = // some date
		// 		horizonApplication.finalCommentsWindowStart = // request date - 2 day
		// 		horizonApplication.finalCommentsWindowEnd = // request date - 1 day
		// 			horizonMock.get('case/' + application.id).shouldReturn(horizonApplication); // Make work good

		// 	//When: the appellent uploads final comments within the final comments window
		// 	application.finalComments = // ¯\_(ツ)_/¯
		// 		response = request.post('application/{id}/final_comments');

		// 	//Then: we should get a 4xx in the response
		// 	response.status().shouldEqual('4xx');

		// 	// And: the application with final comments should not appear on the Horizon input queue for processing
		// 	queue.isEmpty();
		// });
	});
}
