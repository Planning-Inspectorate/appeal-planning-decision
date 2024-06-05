const stream = require('stream');

const { downloadBlob } = require('../common/azure-storage/blobs');
const { sendMessageBatch } = require('../common/azure-service-bus/service-bus');
const config = require('../common/config');

const { InvocationContext } = require('@azure/functions');
const handler = require('./listed-building-http');

jest.mock('../common/azure-storage/blobs');
jest.mock('../common/azure-service-bus/service-bus');
jest.mock('../common/config');

function renameArrayProp(array, prop, propRename) {
	return array.map((obj) => {
		const newObj = {};
		for (const key in obj) {
			if (key === prop) {
				newObj[propRename] = obj[key];
			} else {
				newObj[key] = obj[key];
			}
		}
		return newObj;
	});
}

describe('listed-building-file-trigger', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-document' });
	ctx.log = jest.fn();
	ctx.error = jest.fn();
	let request = {};

	beforeEach(() => {
		jest.clearAllMocks();
		config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.MAX_BATCH_SIZE = 2;
		request.query = {
			get: () => 0
		};
	});

	it('should import listed buildings', async () => {
		const data = {
			entities: [
				{ name: 'building1', reference: '10101' },
				{ name: 'building2', reference: '10102' }
			]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		const result = await handler(request, ctx);

		expect(downloadBlob).toHaveBeenCalledTimes(1);
		expect(sendMessageBatch).toHaveBeenCalledTimes(1);
		expect(sendMessageBatch).toHaveBeenCalledWith(undefined, expect.any(String), data.entities);
		expect(result).toEqual({ body: 'Skipped 0 batches | Processed 2 in 1 batches' });
	});

	it('should rename listed-building-grade', async () => {
		const data = {
			entities: [
				{ name: 'building1', reference: '10101', 'listed-building-grade': 'I' },
				{ name: 'building2', reference: '10102', 'listed-building-grade': 'II' }
			]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		await handler(request, ctx);

		const expectedMessageBatch = renameArrayProp(
			data.entities,
			'listed-building-grade',
			'listedBuildingGrade'
		);
		expect(sendMessageBatch).toHaveBeenCalledWith(
			undefined,
			expect.any(String),
			expectedMessageBatch
		);
	});

	it('should strip out unused props', async () => {
		const data = {
			entities: [{ name: 'building1', dataset: 1 }]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		await handler(request, ctx);

		expect(sendMessageBatch).toHaveBeenCalledWith(undefined, expect.any(String), [
			{ name: 'building1' }
		]);
	});

	it('will allow unspecified params', async () => {
		const data = {
			entities: [{ name: 'building1', other: 1 }]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		await handler(request, ctx);

		expect(sendMessageBatch).toHaveBeenCalledWith(undefined, expect.any(String), data.entities);
	});

	it('should use batching', async () => {
		const data = {
			entities: [
				{ name: 'building1', reference: '10101' },
				{ name: 'building2', reference: '10102' },
				{ name: 'building3', reference: '10103' },
				{ name: 'building4', reference: '10104' },
				{ name: 'building5', reference: '10104' }
			]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		const result = await handler(request, ctx);

		expect(downloadBlob).toHaveBeenCalledTimes(1);
		expect(sendMessageBatch).toHaveBeenCalledTimes(3);
		expect(result).toEqual({ body: 'Skipped 0 batches | Processed 5 in 3 batches' });
	});

	it('should skip batches', async () => {
		const data = {
			entities: [
				{ name: 'building1', reference: '10101' },
				{ name: 'building2', reference: '10102' },
				{ name: 'building3', reference: '10103' },
				{ name: 'building4', reference: '10104' },
				{ name: 'building5', reference: '10104' }
			]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValue();

		request.query = {
			get: () => 1
		};
		const result = await handler(request, ctx);

		expect(downloadBlob).toHaveBeenCalledTimes(1);
		expect(sendMessageBatch).toHaveBeenCalledTimes(2);
		expect(sendMessageBatch).toHaveBeenCalledWith(
			config.AZURE.BO_SERVICEBUS.HOSTNAME,
			config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
			[data.entities[2], data.entities[3]]
		);
		expect(sendMessageBatch).toHaveBeenCalledWith(
			config.AZURE.BO_SERVICEBUS.HOSTNAME,
			config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
			[data.entities[4]]
		);

		expect(result).toEqual({ body: 'Skipped 1 batches | Processed 3 in 2 batches' });
	});

	it('should log which batch failed', async () => {
		const data = {
			entities: [
				{ name: 'building1', reference: '10101' },
				{ name: 'building2', reference: '10102' },
				{ name: 'building3', reference: '10103' },
				{ name: 'building4', reference: '10104' },
				{ name: 'building5', reference: '10104' }
			]
		};

		const mockReadableStream = new stream.Readable();
		mockReadableStream.push(JSON.stringify(data));
		mockReadableStream.push(null);

		const expectedError = new Error('Async error');
		downloadBlob.mockResolvedValue(mockReadableStream);
		sendMessageBatch.mockResolvedValueOnce();
		sendMessageBatch.mockRejectedValueOnce(expectedError);

		await expect(handler(request, ctx)).rejects.toThrow(expectedError);

		expect(downloadBlob).toHaveBeenCalledTimes(1);
		expect(sendMessageBatch).toHaveBeenCalledTimes(2);
		expect(sendMessageBatch).toHaveBeenCalledWith(
			config.AZURE.BO_SERVICEBUS.HOSTNAME,
			config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
			[data.entities[0], data.entities[1]]
		);
		expect(sendMessageBatch).toHaveBeenCalledWith(
			config.AZURE.BO_SERVICEBUS.HOSTNAME,
			config.AZURE.BO_SERVICEBUS.LISTED_BUILDING.TOPIC_NAME,
			[data.entities[2], data.entities[3]]
		);

		expect(ctx.error).toHaveBeenCalledWith(`errored on batch 2`);
		expect(ctx.error).toHaveBeenCalledWith(`use --skip=1 to continue processing`);
	});
});
