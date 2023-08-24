const { jsonRequest, METHOD_POST } = require('./httpClient');
const nock = require('nock');
const {
	caseAppealDataMock
} = require('../../../appeals-case-data/appeals-case-data-fo-integration/serviceBusMessageMock');
const {
	fakeContext
} = require('../../../appeals-case-data/appeals-case-data-fo-integration/serviceBusMessageMock');
describe('./src/packages/integration-functions/common/src/http/httpClient.js', () => {
	it('should post a json request to an http endpoint', async () => {
		const mockCaseData = caseAppealDataMock();
		const mockResponse = { id: 1 };
		nock('http://myapi.example.com').post('/resource').reply(201, JSON.stringify(mockResponse));
		const response = await jsonRequest(
			fakeContext(),
			mockCaseData,
			METHOD_POST,
			'http://myapi.example.com/resource'
		);
		expect(response).toEqual(JSON.stringify(mockResponse));
	});
	it('should post a json request to an https endpoint', async () => {
		const mockCaseData = caseAppealDataMock();
		const mockResponse = { id: 1 };
		nock('https://myapi.example.com').post('/resource').reply(200, JSON.stringify(mockResponse));
		const response = await jsonRequest(
			fakeContext(),
			mockCaseData,
			METHOD_POST,
			'https://myapi.example.com/resource'
		);
		expect(response).toEqual(JSON.stringify(mockResponse));
	});
});
