const { InvocationContext } = require('@azure/functions');
const handler = require('../../src/functions/appeal-document');
const createApiClient = require('../../src/common/api-client');
const config = require('../../src/common/config');
const { APPEAL_REDACTED_STATUS } = require('@planning-inspectorate/data-model');

jest.mock('../../src/common/api-client');

/** @type {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} */
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
	ctx.debug = jest.fn();
	const mockClient = {
		putAppealDocument: jest.fn(),
		deleteAppealDocument: jest.fn()
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

		expect(ctx.debug).toHaveBeenCalledWith('Handle document metadata message', testData);
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

		await expect(async () => handler(testData, ctx)).rejects.toThrow('badness 10000');
	});

	it('should error if message schema is invalid', async () => {
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrow('Invalid message schema');
		expect(mockClient.putAppealDocument).not.toHaveBeenCalled();
	});

	it('should ignore unpublished documents', async () => {
		const invalidMessage = {
			...testData,
			datePublished: null
		};

		await handler(invalidMessage, ctx);

		expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
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

	const redactedStatuses = [
		APPEAL_REDACTED_STATUS.NOT_REDACTED,
		APPEAL_REDACTED_STATUS.NO_REDACTION_REQUIRED,
		APPEAL_REDACTED_STATUS.REDACTED,
		null
	];

	it.each(redactedStatuses)('should accept all redaction statuses: [%s]', async (status) => {
		const message = {
			...testData,
			redactedStatus: status
		};

		const result = await handler(message, ctx);

		expect(mockClient.putAppealDocument).toHaveBeenCalledWith(message);
		expect(result).toEqual({});
	});

	it('Should delete documents if the invocation context says so', async () => {
		const result = await handler(testData, {
			...ctx,
			triggerMetadata: { applicationProperties: { type: 'Delete' } }
		});

		expect(ctx.debug).toHaveBeenCalledWith('Handle document metadata message', testData);
		expect(ctx.log).not.toHaveBeenCalledWith('Sending document metadata message to API');
		expect(mockClient.deleteAppealDocument).toHaveBeenCalledWith(testData.documentId);
		expect(ctx.log).toHaveBeenCalledWith(`Finished handling: ${testData.documentId}`);
		expect(result).toEqual({});
	});
});
