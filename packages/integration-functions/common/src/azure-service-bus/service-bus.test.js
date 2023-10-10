const { sendMessageBatch } = require('./service-bus');
const { ServiceBusClient } = require('@azure/service-bus');
const { DefaultAzureCredential } = require('@azure/identity');

// Mock the Azure SDK dependencies
jest.mock('@azure/service-bus');
jest.mock('@azure/identity');

// Mock the ServiceBusClient and Sender
function getMockSender() {
	return {
		createMessageBatch: jest.fn(),
		tryAddMessage: jest.fn(),
		sendMessages: jest.fn(),
		close: jest.fn()
	};
}

const serviceBusHostname = 'test-hostname';
const topicName = 'test-topic';
const messages = [{ body: 'message1' }, { body: 'message2' }];

describe('service-bus', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('sendMessageBatch', () => {
		it('should send messages to the topic', async () => {
			const mockSender = getMockSender();
			const mockServiceBusClient = {
				createSender: jest.fn(() => mockSender),
				close: jest.fn()
			};

			ServiceBusClient.mockImplementation(() => mockServiceBusClient);

			mockSender.createMessageBatch.mockResolvedValue(mockSender);
			mockSender.tryAddMessage.mockReturnValue(true);

			await sendMessageBatch(serviceBusHostname, topicName, messages);

			expect(ServiceBusClient).toHaveBeenCalledWith(
				serviceBusHostname,
				expect.any(DefaultAzureCredential)
			);
			expect(mockServiceBusClient.createSender).toHaveBeenCalledWith(topicName);

			expect(mockSender.createMessageBatch).toHaveBeenCalledTimes(1);
			expect(mockSender.tryAddMessage).toHaveBeenCalledTimes(2);
			expect(mockSender.sendMessages).toHaveBeenCalledTimes(1);

			expect(mockSender.close).toHaveBeenCalledTimes(1);
			expect(mockServiceBusClient.close).toHaveBeenCalledTimes(1);
		});

		it('should format service bus messages', async () => {
			const mockSender = getMockSender();
			const mockServiceBusClient = {
				createSender: jest.fn(() => mockSender),
				close: jest.fn()
			};

			ServiceBusClient.mockImplementation(() => mockServiceBusClient);

			mockSender.createMessageBatch.mockResolvedValue(mockSender);
			mockSender.tryAddMessage.mockReturnValue(true);

			await sendMessageBatch(serviceBusHostname, topicName, messages);

			expect(mockSender.tryAddMessage).toHaveBeenCalledWith({
				body: messages[0]
			});
			expect(mockSender.tryAddMessage).toHaveBeenCalledWith({
				body: messages[1]
			});
		});

		it('should throw an error if tryAddMessage fails twice in a row', async () => {
			const mockSender = getMockSender();
			const mockServiceBusClient = {
				createSender: jest.fn(() => mockSender),
				close: jest.fn()
			};

			ServiceBusClient.mockImplementation(() => mockServiceBusClient);

			mockSender.createMessageBatch.mockResolvedValue(mockSender);
			mockSender.tryAddMessage.mockReturnValueOnce(false).mockReturnValueOnce(false);

			await expect(sendMessageBatch(serviceBusHostname, topicName, messages)).rejects.toThrow(
				'Message too big to fit in a batch'
			);

			// Assertions
			expect(mockSender.createMessageBatch).toHaveBeenCalledTimes(2);
			expect(mockSender.tryAddMessage).toHaveBeenCalledTimes(2);
			expect(mockSender.sendMessages).toHaveBeenCalledTimes(1);

			expect(mockSender.close).toHaveBeenCalledTimes(1);
			expect(mockServiceBusClient.close).toHaveBeenCalledTimes(1);
		});

		it('should send batch and create a new one if a message fails to add', async () => {
			const mockSender = getMockSender();
			const mockServiceBusClient = {
				createSender: jest.fn(() => mockSender),
				close: jest.fn()
			};

			ServiceBusClient.mockImplementation(() => mockServiceBusClient);

			mockSender.createMessageBatch.mockResolvedValue(mockSender);
			mockSender.tryAddMessage
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true);

			await sendMessageBatch(serviceBusHostname, topicName, [...messages, { body: 'message3' }]);

			// Assertions
			expect(mockSender.createMessageBatch).toHaveBeenCalledTimes(2);
			expect(mockSender.tryAddMessage).toHaveBeenCalledTimes(4);
			expect(mockSender.sendMessages).toHaveBeenCalledTimes(2);

			expect(mockSender.close).toHaveBeenCalledTimes(1);
			expect(mockServiceBusClient.close).toHaveBeenCalledTimes(1);
		});
	});
});
