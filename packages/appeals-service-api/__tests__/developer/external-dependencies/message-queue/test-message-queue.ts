import { StringSchema } from "@pins/business-rules/src/lib/pins-yup";

// import { TestMessageQueueConfiguration } from './test-message-queue-configuration';
var container = require('rhea');
// import { expect } from '@jest/globals'

	// private amqpTestConfiguration: TestMessageQueueConfiguration;

export class TestMessageQueue {

	constructor(){

	}

	verifyMessagesAreOnQueue(queueName: StringSchema) {

		container.connect().open_receiver(queueName);
		
		container.on('message', (context: any) => {
			const output = context.message.body.content;
			// expect(JSON.parse(output.toString())).toMatchObject(expectations[index]);
			// index++;
			console.log(output.toString())
			context.receiver.detach();
			context.connection.close();
		});
	}
}