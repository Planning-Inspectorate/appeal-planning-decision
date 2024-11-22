const { mockReq, mockRes } = require('../../../../../../../test/utils/mocks');
const { getDocumentsByCaseReferenceAndCaseStage } = require('./controller');

const testCaseReference = '1234567890';
const testCaseStage = 'lpa-questionnaire';
const testDocumentType = 'doctype';
const testDocuments = ['document-one.pdf', 'document-two.pdf', 'document-three.pdf'];

jest.mock('../../../../../../configuration/featureFlag', () => ({
	isFeatureActive: jest.fn().mockResolvedValue(true)
}));

const mockAppend = jest.fn();

jest.mock('archiver', () =>
	jest.fn().mockReturnValue({
		pipe: jest.fn(),
		append: jest.fn().mockImplementation((...params) => mockAppend(...params)),
		finalize: jest.fn()
	})
);

jest.mock('../../../../../../db/repos/repository', () => ({
	DocumentsRepository: jest.fn().mockImplementation(() => ({
		getSubmissionDocumentsByCaseRef: jest.fn().mockImplementation(async (caseReference) =>
			testDocuments.map((document) => ({
				location: `${testDocumentType}:${caseReference}/${document}`,
				originalFileName: `${caseReference}-${document}`,
				type: testDocumentType
			}))
		)
	}))
}));

jest.mock('#lib/front-office-storage-client', () => ({
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

	it('should expect 3 blob streams to be appended', async () => {
		await getDocumentsByCaseReferenceAndCaseStage(req, res);

		// Testing archive append was called correctly 3 times
		expect(mockAppend).toBeCalledTimes(3);

		testDocuments.map((testDocument, index) => {
			const document = `${testCaseReference}-${testDocument}`;
			expect(mockAppend).toHaveBeenNthCalledWith(
				index + 1,
				{ stream: document },
				{ name: `${testDocumentType}/${document}` }
			);
		});
	});
});
