const { mockReq, mockRes } = require('../../../../../../test/utils/mocks');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const testCaseReference = '1234567890';
const testDocumentTypes = [
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE
];

jest.mock('@pins/common/src/lib/getAzureBlobPathFromUri', () =>
	jest.fn().mockImplementation((uri) => {
		return uri;
	})
);

jest.mock('../../../../../configuration/featureFlag', () => ({
	isFeatureActive: jest.fn().mockResolvedValue(true)
}));

jest.mock('@pins/common/src/constants', () => ({
	...jest.requireActual('@pins/common/src/constants')
}));

const { checkDocAccess } = require('@pins/common/src/access/document-access');
jest.mock('@pins/common/src/access/document-access');

const mockAppend = jest.fn();

jest.mock('archiver', () =>
	jest.fn().mockReturnValue({
		pipe: jest.fn(),
		append: jest.fn().mockImplementation((...params) => mockAppend(...params)),
		finalize: jest.fn()
	})
);

const documentURI = 'https://some-url.com/document.pdf';

jest.mock('../../../../../db/repos/repository', () => ({
	DocumentsRepository: jest.fn().mockImplementation(() => ({
		getDocumentsByTypes: jest.fn().mockImplementation(async ({ documentTypes }) => [
			{
				id: 'doc1',
				documentURI,
				documentType: documentTypes[0],
				filename: 'document.pdf',
				redacted: true
			},
			{
				id: 'doc2',
				documentURI,
				documentType: documentTypes[1],
				filename: 'document2.pdf',
				redacted: false
			},
			{
				id: 'doc3',
				documentURI,
				documentType: documentTypes[2],
				filename: 'document3.pdf',
				redacted: true
			},
			{
				id: 'doc4',
				documentURI,
				documentType: documentTypes[3],
				filename: 'document4.pdf',
				redacted: true
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

const { getDocumentsByCaseReference } = require('./controller');

describe('/v2/back-office/{caseReference}/document-type', () => {
	let res = mockRes();

	let req;

	beforeEach(() => {
		req = {
			...mockReq,
			params: {
				caseReference: testCaseReference
			},
			query: {
				filter: testDocumentTypes.join(',')
			},
			auth: {
				payload: {
					sub: '456'
				}
			},
			id_token: {
				b: 2
			}
		};
		res = {
			...mockRes,
			sendStatus: jest.fn(),
			status: jest.fn(),
			locals: {
				appealCase: {
					appealId: '123',
					caseReference: 'ABC',
					LPACode: 'Q1111',
					appealTypeCode: 'HAS'
				},
				appealUserRoles: [
					{
						appealId: '123',
						userId: '456',
						role: 'Appellant'
					}
				]
			}
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return status of 200', async () => {
		checkDocAccess.mockImplementation(() => true);
		await getDocumentsByCaseReference(req, res);
		expect(mockAppend).toHaveBeenCalledTimes(4);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should expect 1 blob stream to be appended, 3 not included due to access rules', async () => {
		checkDocAccess.mockImplementation(
			(params) => params.documentWithAppeal.documentType === testDocumentTypes[0]
		);
		await getDocumentsByCaseReference(req, res);
		expect(mockAppend).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should throw an error if invalid doc type', async () => {
		req.query.filter = 'invalid-doc-type';
		await expect(getDocumentsByCaseReference(req, res)).rejects.toThrow('Invalid document type');
	});
});
