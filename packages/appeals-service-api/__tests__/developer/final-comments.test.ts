import { env } from 'node:process';
import { MongoDBContainer, StartedMongoDBContainer } from 'testcontainers/';
import mongoose from 'mongoose';

// env.FINAL_COMMENT_FEATURE_ACTIVE = true;

if (true) {
	//Given
	// I am appellant who has submitted an application post /application
	// Aquire relevant appeals object from horizon
	//

	//When
	// the final comments window is open
	// drag in information

	//Then
	// I should be able to add final comments to my application
	// Check the state of the applicaiton in the db that backs the appeals service api
	// Post final comments to horizon

	describe('MongodbContainer', () => {
		jest.setTimeout(240_000);

		it('should work using default version 4.0.1', async () => {
			const mongodbContainer = await new MongoDBContainer().start();

			await checkMongo(mongodbContainer);

			await mongoose.disconnect();
			await mongodbContainer.stop();
		});

		it('should work using version 6.0.1', async () => {
			const mongodbContainer = await new MongoDBContainer('mongo:6.0.1').start();

			await checkMongo(mongodbContainer);

			await mongoose.disconnect();
			await mongodbContainer.stop();
		});

		async function checkMongo(mongodbContainer: StartedMongoDBContainer, port = 27017) {
			const db = await mongoose.createConnection(mongodbContainer.getConnectionString(), {
				directConnection: true
			});
			const fooCollection = db.collection('foo');
			const obj = { value: 1 };

			const session = await db.startSession();
			await session.withTransaction(async () => {
				await fooCollection.insertOne(obj);
			});

			expect(
				await fooCollection.findOne({
					value: 1
				})
			).toEqual(obj);
		}
	});
}
