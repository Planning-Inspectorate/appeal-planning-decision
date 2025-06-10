const { mockReq, mockRes } = require('../../../../../../../test/utils/mocks');

const testCaseReference = '1234567890';
const testCaseStage = 'lpa-questionnaire';
const testDocumentTypes = ['doctype-one', 'doc-type-two', 'doc-type-three'];

jest.mock('@pins/common/src/lib/getAzureBlobPathFromUri', () =>
	jest.fn().mockImplementation((uri) => {
		return uri;
	})
);

jest.mock('../../../../../../configuration/featureFlag', () => ({
	isFeatureActive: jest.fn().mockResolvedValue(true)
}));

jest.mock('@pins/common/src/constants', () => ({
	...jest.requireActual('@pins/common/src/constants'),
	FOLDERS: testDocumentTypes.map((documentType) => `${testCaseStage}/${documentType}`)
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

jest.mock('../../../../../../db/repos/repository', () => ({
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
				documentType: documentTypes[0],
				filename: 'document2.pdf',
				redacted: false
			},
			{
				id: 'doc3',
				documentURI,
				documentType: documentTypes[0],
				filename: 'document3.pdf',
				redacted: true
			},
			{
				id: 'doc4',
				documentURI,
				documentType: documentTypes[0],
				filename: 'document4.pdf',
				redacted: true
			}
		]),
		getRepresentationDocsByCaseReference: jest.fn().mockImplementation(async () => [
			{
				documentId: 'doc1',
				userOwnsRepresentation: true,
				representationStatus: 'DRAFT',
				documentType: testDocumentTypes[0]
			},
			{
				documentId: 'doc2',
				userOwnsRepresentation: true,
				representationStatus: 'PUBLISHED',
				documentType: testDocumentTypes[0]
			},
			{
				documentId: 'doc3',
				userOwnsRepresentation: false,
				representationStatus: 'PUBLISHED',
				documentType: testDocumentTypes[0]
			},
			{
				documentId: 'doc4',
				userOwnsRepresentation: false,
				representationStatus: 'DRAFT',
				documentType: testDocumentTypes[0]
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

const { getDocumentsByCaseReferenceAndCaseStage } = require('./controller');

describe('/v2/back-office/{caseReference}/case_stage/{caseStage}', () => {
	let res = mockRes();

	let req;

	beforeEach(() => {
		req = {
			...mockReq,
			params: {
				caseReference: testCaseReference,
				caseStage: testCaseStage
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
		await getDocumentsByCaseReferenceAndCaseStage(req, res);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('should expect 2 blob streams to be appended, 4 not included due to access rules', async () => {
		checkDocAccess.mockImplementation(
			(params) => params.documentWithAppeal.documentType === testDocumentTypes[0]
		);

		await getDocumentsByCaseReferenceAndCaseStage(req, res);

		// only adds
		expect(mockAppend).toHaveBeenCalledTimes(2);

		testDocumentTypes
			.filter((x) => x === testDocumentTypes[0])
			.forEach((documentType, index) => {
				expect(mockAppend).toHaveBeenNthCalledWith(
					index + 1,
					{ stream: documentURI },
					{ name: `${documentType}/document.pdf` }
				);
			});
	});
});
