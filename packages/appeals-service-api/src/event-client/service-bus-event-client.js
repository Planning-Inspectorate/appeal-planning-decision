const logger = require('../lib/logger');
const { ServiceBusClient } = require('@azure/service-bus');
const { DefaultAzureCredential } = require('@azure/identity');

/**
 * Event client used to broadcast messages to service bus topics.
 * @class
 */
class ServiceBusEventClient {
	/**
	 * @param {string} serviceBusHostname
	 */
	constructor(serviceBusHostname) {
		this.client = new ServiceBusClient(serviceBusHostname, new DefaultAzureCredential());
	}
	/**
	 *
	 * @param {string} topic
	 * @returns Instance of the service bus sender from the service bus client
	 */
	#createSender = (topic) => {
		return this.client.createSender(topic);
	};

	/**
	 * Returns unix timestamp representing the trace id
	 *
	 * @returns {number}
	 */
	#createTraceId = () => {
		return Date.now();
	};

	/**
	 *
	 * @param {object[]} events
	 * @param {number} traceId
	 * @param {import('./event-type.js').EventType} type
	 * @returns {import('@azure/service-bus').ServiceBusMessage []}
	 */
	#transformMessagesToSend = (events, traceId, type) => {
		return events.map((body) => ({
			body,
			contentType: 'application/json',
			applicationProperties: {
				version: '0.1',
				traceId,
				type
			}
		}));
	};

	/**
	 *
	 * @param {string} topic
	 * @param {any[]} events
	 * @param {import('./event-type.js').EventType} eventType
	 */
	sendEvents = async (topic, events, eventType) => {
		const sender = this.#createSender(topic);

		try {
			const traceId = this.#createTraceId();

			logger.info(`Publishing ${events.length} events to topic ${topic} with trace id ${traceId}`);

			await sender.sendMessages(this.#transformMessagesToSend(events, traceId, eventType));

			return events;
		} finally {
			if (!sender.isClosed) {
				await sender.close();
			}
		}
	};
}

module.exports = { ServiceBusEventClient };
