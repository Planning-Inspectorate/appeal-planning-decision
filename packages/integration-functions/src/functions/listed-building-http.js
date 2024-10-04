/*
 * listed-building-http-trigger
 * function app that can be manually triggered via an http call
 * temporary solution until ODW provides a listed building topic
 * requires a function key in the request
 * reads a file from the function app storage account and adds each listed building as a message to the listed building queue
 * file can be downloaded manually and added to the storage account
 * will overwhelm the DB as there will be 100,000s of messages, so collection will need scaling before running
 * will take some time and may be safer to split file into a few smaller files or bump up max function run time
 * file taken from: https://www.planning.data.gov.uk/dataset/listed-building
 */

const { Readable } = require('node:stream');
const { downloadBlob } = require('../common/azure-storage/blobs');
const { sendMessageBatch } = require('../common/azure-service-bus/service-bus');

// json streaming
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { pick } = require('stream-json/filters/Pick');
const { ignore } = require('stream-json/filters/Ignore');
const { streamArray } = require('stream-json/streamers/StreamArray');

// configuration settings
const config = require('../common/config');

/**
 * @typedef {Object} ImportResult
 * @property {Number} processedCount - number of listed buildings processed
 * @property {Number} batchCount - number of batches processed
 */

const { app } = require('@azure/functions');

/**
 * Http trigger that will convert a json file of listed buildings into messages on the service bus topic
 * skip can be passed as a query string param to skip a previously successful batches
 * @type {import('@azure/functions').HttpHandler}
 */
const handler = async (request, context) => {
	context.log('listed building file trigger function processed request');

	const skip = Number(request.query.get('skip')) || 0;

	// download the file
	const blob = await downloadBlob(
		config.AZURE.FUNCTION_APP.LISTED_BUILDING.CONTAINER,
		config.AZURE.FUNCTION_APP.LISTED_BUILDING.FILENAME,
		config.AZURE.FUNCTION_APP.STORAGE_CONNECTION
	);

	// wrap node webstream in node stream so we can parse it with json-stream
	// https://nodejs.org/docs/latest-v18.x/api/webstreams.html considered experimental but used by Azure
	// https://nodejs.org/docs/latest-v18.x/api/stream.html required by json-stream
	// https://github.com/uhop/stream-chain/issues/9
	const fileStream = new Readable().wrap(blob);

	// parse json stream and send messages to service bus topic in batches
	const result = await importListedBuildingsFromFile(context, fileStream, skip);

	// return success response message
	const message = `Skipped ${skip} batches | Processed ${result.processedCount} in ${
		result.batchCount - skip
	} batches`;

	return {
		body: message
	};
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {Readable} fileStream
 * @param {Number} [skipBatches]
 * @returns {Promise.<ImportResult>}
 */
async function importListedBuildingsFromFile(context, fileStream, skipBatches = 0) {
	const pipeline = chain([
		fileStream,
		parser(),
		pick({ filter: 'entities' }),
		ignore({
			filter:
				/dataset|geometry|entry-date|end-date|entity|organisation-entity|point|prefix|typology|documentation-url|start-date/i
		}),
		streamArray()
	]);

	let batch = [];
	let batchCount = 0;
	let processedCount = 0;

	try {
		for await (const { value } of pipeline) {
			// Rename listed-building-grade property
			value.listedBuildingGrade = value['listed-building-grade'];
			delete value['listed-building-grade'];

			batch.push(value);

			// send batch if count reaches max batch size
			if (batch.length === config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.MAX_BATCH_SIZE) {
				if (batchCount >= skipBatches) {
					context.log('send batch' + batchCount, batch.length);
					await sendMessageBatch(
						config.AZURE.BO_SERVICEBUS.HOSTNAME,
						config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
						batch
					);

					processedCount += batch.length;
				}

				batchCount++;
				batch = [];
			}
		}

		// send final messages
		if (batch.length > 0) {
			context.log('send batch' + batchCount, batch.length);
			await sendMessageBatch(
				config.AZURE.BO_SERVICEBUS.HOSTNAME,
				config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
				batch
			);
			processedCount += batch.length;
			batchCount++;
			batch = [];
		}
	} catch (err) {
		context.error(`errored on batch ${batchCount + 1}`);
		context.error(`use --skip=${batchCount} to continue processing`);
		throw err;
	}

	return {
		processedCount,
		batchCount
	};
}

app.http('listed-building', {
	methods: ['GET', 'POST'],
	authLevel: 'function',
	handler: handler
});

module.exports = handler;
