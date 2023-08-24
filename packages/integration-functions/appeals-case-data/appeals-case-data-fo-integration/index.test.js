const ServiceBusMocks = require('./serviceBusMessageMock');
const appealsCaseDataReceived = require('./index');
const nock = require('nock');
describe('appeals-case-data-fo-integration', () => {
	it('should process a case appeals data message', () => {
		const mockResponse = { id: 1 };
		process.env.BO_APPEALS_API = 'localhost:3000/api/v1/appeals-case-dev';
		nock('http://localhost:3000/api/v1/appeals-case-dev')
			.post('/')
			.reply(201, JSON.stringify(mockResponse));
		const fakeCaseData = ServiceBusMocks.caseAppealDataMock();
		const fakeServiceBusMessage = ServiceBusMocks.serviceBusMessageMock(fakeCaseData);
		const fakeContext = ServiceBusMocks.fakeContext();
		appealsCaseDataReceived(fakeContext, fakeServiceBusMessage);
	});
});
