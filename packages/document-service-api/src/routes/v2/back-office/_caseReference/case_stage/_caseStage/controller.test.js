const { mockReq, mockRes } = require('../../../../../../../test/utils/mocks');
const { getDocumentsByCaseReferenceAndCaseStage } = require('./controller');

const testCaseReference = '1234567890';
const testCaseStage = 'lpa-questionnaire';
const testDocumentTypes = ['doctype-one', 'doc-type-two', 'doc-type-three'];

jest.mock('../../../../../../configuration/featureFlag', () => ({
	isFeatureActive: jest.fn().mockResolvedValue(true)
}));

jest.mock('@pins/common/src/constants', () => ({
	FOLDERS: testDocumentTypes.map((documentType) => `${testCaseStage}/${documentType}`)
}));

const mockAppend = jest.fn();

jest.mock('archiver', () =>
	jest.fn().mockReturnValue({
		pipe: jest.fn(),
		append: jest.fn().mockImplementation((...params) => mockAppend(...params)),
		finalize: jest.fn()
	})
);

const documentURI = 'https://some-url.com/document.pdf';

jest.mock('../../../../../../db/repos/repository', () => ({
	DocumentsRepository: jest.fn().mockImplementation(() => ({
		getDocuments: jest.fn().mockImplementation(async ({ documentType }) => [
			{
				documentURI,
				documentType,
				filename: 'document.pdf',
				redacted: true
			},
			{
				documentURI,
				documentType,
				filename: 'document2.pdf',
				redacted: false
			}
		])
	}))
}));

jest.mock('#lib/back-office-storage-client', () => ({
	getProperties: jest.fn().mockResolvedValue({}),
	downloadBlob: jest.fn().mockImplementation(async (_, filename) => {
		return {
			readableStreamBody: true,
			blobDownloadStream: { stream: filename }
		};
	})
}));

describe('/v2/back-office/{caseReference}/case_stage/{caseStage}', () => {
	let res = mockRes();

	let req;

	beforeEach(() => {
		req = {
			...mockReq,
			params: {
				caseReference: testCaseReference,
				caseStage: testCaseStage
			}
		};
		res = {
			...mockRes,
			sendStatus: jest.fn(),
			status: jest.fn()
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return status of 200', async () => {
		await getDocumentsByCaseReferenceAndCaseStage(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should expect 3 blob streams to be appended instead of 6 due to one document being unredacted', async () => {
		await getDocumentsByCaseReferenceAndCaseStage(req, res);

		// Testing archive append was called correctly 3 times
		expect(mockAppend).toBeCalledTimes(3);

		testDocumentTypes.map((documentType, index) => {
			expect(mockAppend).toHaveBeenNthCalledWith(
				index + 1,
				{ stream: documentURI },
				{ name: `${documentType}/document.pdf` }
			);
		});
	});
});
