const { InvocationContext } = require('@azure/functions');
const handler = require('../../src/functions/appeal-document');
const createApiClient = require('../../src/common/api-client');
const config = require('../../src/common/config');

jest.mock('../../src/common/api-client');

/** @type {import('pins-data-model/src/schemas').AppealDocument} */
const testData = {
	documentId: 'a443f10a-e6c2-416a-8eb7-dd82ad8db2a0',
	caseRef: '3221288',
	documentReference: '<APP/Q9999/W/22/3221288><1>',
	version: 1,
	examinationRefNo: 'XXX-123',
	filename: 'a.pdf',
	originalFilename: 'a.pdf',
	size: 1,
	mime: 'application/pdf',
	documentURI: 'https://example.org/a.pdf',
	path: '/a.pdf',
	virusCheckStatus: 'scanned',
	fileMD5: 'b57987f7594c89366f7183ee9b7ae6b2',
	dateCreated: '2023-06-21T09:47:24.563Z',
	lastModified: '2023-06-21T10:47:24.563Z',
	caseType: 'C',
	documentStatus: 'submitted',
	redactedStatus: 'redacted',
	publishedStatus: 'published',
	datePublished: '2023-06-21T11:47:24.563Z',
	documentType: 'appellantCaseCorrespondence',
	securityClassification: 'public',
	sourceSystem: 'back-office-appeals',
	origin: 'pins',
	owner: 'someone',
	author: 'someone',
	representative: 'some agency',
	description: 'this is a description',
	stage: 'decision',
	filter1: 'Deadline 2',
	filter2: 'Scoping Option Report',
	caseId: 123,
	caseReference: '0000001',
	publishedDocumentURI: 'https://example.com/picture',
	dateReceived: new Date('2024-01-01').toISOString(),
	caseStage: 'appellant-case',
	horizonFolderId: 'horz_001'
};

describe('appeal-document', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-document' });
	ctx.log = jest.fn();
	const mockClient = {
		putAppealDocument: jest.fn()
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		createApiClient.mockResolvedValue(mockClient);
		config.API = {
			...config.API,
			HOSTNAME: 'test'
		};
	});

	it('should send valid message to api', async () => {
		const result = await handler(testData, ctx);

		expect(ctx.log).toHaveBeenCalledWith('Handle document metadata message', testData);
		expect(ctx.log).toHaveBeenCalledWith('Sending document metadata message to API');
		expect(mockClient.putAppealDocument).toHaveBeenCalledWith(testData);
		expect(ctx.log).toHaveBeenCalledWith(`Finished handling: ${testData.documentId}`);
		expect(result).toEqual({});
	});

	it('should error if call to api fails', async () => {
		createApiClient.mockResolvedValue({
			putAppealDocument: async () => {
				throw new Error('badness 10000');
			}
		});

		await expect(async () => handler(testData, ctx)).rejects.toThrowError('badness 10000');
	});

	it('should error if message schema is invalid', async () => {
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrowError(
			'Invalid message schema'
		);
		expect(mockClient.putAppealDocument).not.toHaveBeenCalled();
	});

	it('should ignore unpublished documents', async () => {
		const invalidMessage = {
			...testData,
			datePublished: null
		};

		await expect(async () => handler(invalidMessage, ctx)).rejects.toThrowError(
			'Invalid message schema'
		);
		expect(mockClient.putAppealDocument).not.toHaveBeenCalled();
	});

	const invalidVirusStatuses = ['not_scanned', 'affected', 'unknown'];

	it.each(invalidVirusStatuses)(
		'should ignore message if virus status is not valid: [%s]',
		async (status) => {
			const invalidMessage = {
				...testData,
				virusCheckStatus: status
			};

			await handler(invalidMessage, ctx);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(mockClient.putAppealDocument).not.toHaveBeenCalled();
		}
	);

	const invalidRedactedStatuses = ['not_redacted', 'unknown'];

	it.each(invalidRedactedStatuses)(
		'should ignore message if redacted status is not valid: [%s]',
		async (status) => {
			const invalidMessage = {
				...testData,
				virusCheckStatus: status
			};

			await handler(invalidMessage, ctx);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(mockClient.putAppealDocument).not.toHaveBeenCalled();
		}
	);
});
