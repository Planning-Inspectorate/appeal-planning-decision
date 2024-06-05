const { ServiceBusClient } = require('@azure/service-bus');
const { DefaultAzureCredential } = require('@azure/identity');

/**
 * todo: potentially extend/reuse class from back-office/aapd 313
 * however will listed building messages need the message transformations used there?
 * @param {String} serviceBusHostname
 * @param {String} topicName
 * @param {Array.<Object>} messages
 */
async function sendMessageBatch(serviceBusHostname, topicName, messages) {
	// Create a Service Bus sender
	const serviceBusClient = new ServiceBusClient(serviceBusHostname, new DefaultAzureCredential());
	const sender = serviceBusClient.createSender(topicName);

	try {
		let batch = await sender.createMessageBatch();
		for (const message of messages) {
			// try to add the message to the batch
			const data = {
				body: message
			};

			if (!batch.tryAddMessage(data)) {
				// if it fails to add the message to the current batch
				// send the current batch as it is full
				await sender.sendMessages(batch);

				// then, create a new batch
				batch = await sender.createMessageBatch();

				// now, add the message failed to be added to the previous batch to this batch
				if (!batch.tryAddMessage(data)) {
					// if it still can't be added to the batch, the message is probably too big to fit in a batch
					throw new Error('Message too big to fit in a batch');
				}
			}
		}

		// Send the last created batch of messages to the topic
		await sender.sendMessages(batch);
	} finally {
		// Close the sender and the Service Bus client
		await sender.close();
		await serviceBusClient.close();
	}
}

module.exports = { sendMessageBatch };
