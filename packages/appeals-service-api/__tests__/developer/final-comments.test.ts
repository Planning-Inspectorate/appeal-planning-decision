import { env } from 'node:process';
import { MongoDBContainer, StartedMongoDBContainer } from 'testcontainers/';
import mongoose from 'mongoose';
import { application, request, response } from 'express';

if (env.FINAL_COMMENT_FEATURE_ACTIVE) {
	describe('AS-5408', () => {
		it('should be possible to upload final comments to an appeal if this is attempted during the final comments window', async () => {
			//Given
			// I am appellant who has submitted an application post /application
			// Aquire relevant appeals object from horizon
			requestDate = // some date
				horizonApplication.finalCommentsWindowStart = // request date - 1 day
				horizonApplication.finalCommentsWindowEnd = // request date + 1 day
					horizonMock.get('case/' + application.id).shouldReturn(horizonApplication); // Make work good

			//When: the appellent uploads final comments within the final comments window
			application.finalComments = // ¯\_(ツ)_/¯
				request.post('application/{id}/final_comments');

			//Then: the application with final comments should appear on the Horizon input queue for processing
			queue.getFirst() == application;
		});

		it('should not be possible to upload final comments to an appeal if this is attempted before the final comments window', async () => {
			//Given
			// I am appellant who has submitted an application post /application
			// Aquire relevant appeals object from horizon
			requestDate = // some date
				horizonApplication.finalCommentsWindowStart = // request date + 1 day
				horizonApplication.finalCommentsWindowEnd = // request date + 2 day
					horizonMock.get('case/' + application.id).shouldReturn(horizonApplication); // Make work good

			//When: the appellent uploads final comments within the final comments window
			application.finalComments = // ¯\_(ツ)_/¯
				response = request.post('application/{id}/final_comments');

			//Then: we should get a 4xx in the response
			response.status().shouldEqual('4xx');

			// And: the application with final comments should not appear on the Horizon input queue for processing
			queue.isEmpty();
		});

		it('should not be possible to upload final comments to an appeal if this is attempted after the final comments window', async () => {
			//Given
			// I am appellant who has submitted an application post /application
			// Aquire relevant appeals object from horizon
			requestDate = // some date
				horizonApplication.finalCommentsWindowStart = // request date - 2 day
				horizonApplication.finalCommentsWindowEnd = // request date - 1 day
					horizonMock.get('case/' + application.id).shouldReturn(horizonApplication); // Make work good

			//When: the appellent uploads final comments within the final comments window
			application.finalComments = // ¯\_(ツ)_/¯
				response = request.post('application/{id}/final_comments');

			//Then: we should get a 4xx in the response
			response.status().shouldEqual('4xx');

			// And: the application with final comments should not appear on the Horizon input queue for processing
			queue.isEmpty();
		});
	});
}
