const eventClient = require('../../../../src/infrastructure/event-client');
const { EventType } = require('../../../../src/event-client/event-type');
const config = require('../../../../src/configuration/config');
const { appeal, questionnaire } = require('../../../../src/services/back-office-v2/forwarders');

jest.mock('../../../../src/infrastructure/event-client');
jest.mock('../../../../src/configuration/config');

describe('appeal and questionnaire', () => {
	let mockData;

	beforeEach(() => {
		mockData = [{ id: 1 }, { id: 2 }];
	});

	it('should send events', async () => {
		const sendEventsMock = jest.fn().mockResolvedValue(true);
		eventClient.sendEvents = sendEventsMock;

		const result = await appeal(mockData);
		expect(sendEventsMock).toHaveBeenCalledWith(
			config.serviceBus.topics.appellantSubmission,
			mockData,
			EventType.Create
		);
		expect(result).toEqual(true);

		const result2 = await questionnaire(mockData);
		expect(sendEventsMock).toHaveBeenCalledWith(
			config.serviceBus.topics.lpaSubmission,
			mockData,
			EventType.Create
		);
		expect(result2).toEqual(true);
	});
});
