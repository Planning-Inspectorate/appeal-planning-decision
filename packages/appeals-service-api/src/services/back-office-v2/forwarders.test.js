const eventClient = require('../../infrastructure/event-client');
const { EventType } = require('../../event-client/event-type');
const config = require('../../configuration/config');
const { appeal, questionnaire } = require('./forwarders');

jest.mock('../../infrastructure/event-client');
jest.mock('../../configuration/config');

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
