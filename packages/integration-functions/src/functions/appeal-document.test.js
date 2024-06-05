const { InvocationContext } = require('@azure/functions');
const handler = require('./appeal-document');
const got = require('got');
jest.mock('got');

const testData = {
	body: {
		documentId: 'a443f10a-e6c2-416a-8eb7-dd82ad8db2a0',
		caseRef: '3221288',
		documentReference: '<APP/Q9999/W/22/3221288><1>',
		version: '1',
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
		caseType: 'has',
		documentStatus: 'submitted',
		redactedStatus: 'redacted',
		publishedStatus: 'published',
		datePublished: '2023-06-21T11:47:24.563Z',
		documentType: 'Planning application form',
		securityClassification: 'public',
		sourceSystem: 'back_office',
		origin: 'pins',
		owner: 'someone',
		author: 'someone',
		representative: 'some agency',
		description: 'this is a description',
		stage: 'decision',
		filter1: 'Deadline 2',
		filter2: 'Scoping Option Report'
	}
};

describe('appeal-document', () => {
	const ctx = new InvocationContext({ functionName: 'appeal-document' });
	ctx.log = jest.fn();

	const original_FO_APPEALS_API = process.env.FO_APPEALS_API;

	beforeAll(() => {
		process.env.FO_APPEALS_API = 'test';
	});

	afterAll(() => {
		if (original_FO_APPEALS_API === undefined) {
			process.env.FO_APPEALS_API = undefined;
		} else {
			process.env.FO_APPEALS_API = original_FO_APPEALS_API;
		}
	});

	beforeEach(async () => {
		jest.clearAllMocks();
		got.put.mockImplementation(() => {
			return {
				json: jest.fn()
			};
		});
	});

	it('should send valid message to api', async () => {
		const result = await handler(testData, ctx);

		expect(ctx.log).toHaveBeenCalledWith('Handle document metadata message', testData);
		expect(ctx.log).toHaveBeenCalledWith('Sending document metadata message to API');
		expect(got.put).toHaveBeenCalledWith(
			`https://test/document-meta-data/${testData.body.documentId}`,
			{ json: testData.body }
		);
		expect(ctx.log).toHaveBeenCalledWith(`Finished handling: ${testData.body.documentId}`);
		expect(result).toEqual({});
	});

	it('should error if call to api fails', async () => {
		got.put.mockImplementation(() => {
			throw new Error('test error');
		});

		await expect(async () => handler(testData, ctx)).rejects.toThrowError('test error');
	});

	it('should error if message schema is invalid', async () => {
		await expect(async () => handler({ body: {} }, ctx)).rejects.toThrowError(
			'Invalid message schema'
		);
		expect(got.put).not.toHaveBeenCalled();
	});

	const invalidPublishedStatuses = [
		'not_checked',
		'checked',
		'ready_to_publish',
		'do_not_publish',
		'publishing',
		'publishing',
		'unknown'
	];

	it.each(invalidPublishedStatuses)(
		'should ignore message if published status is not valid: [%s]',
		async (status) => {
			const invalidMessage = {
				body: {
					...testData.body,
					publishedStatus: status
				}
			};

			await handler(invalidMessage, ctx);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);

	const invalidVirusStatuses = ['not_scanned', 'affected', 'unknown'];

	it.each(invalidVirusStatuses)(
		'should ignore message if virus status is not valid: [%s]',
		async (status) => {
			const invalidMessage = {
				body: {
					...testData.body,
					virusCheckStatus: status
				}
			};

			await handler(invalidMessage, ctx);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);

	const invalidRedactedStatuses = ['not_redacted', 'unknown'];

	it.each(invalidRedactedStatuses)(
		'should ignore message if redacted status is not valid: [%s]',
		async (status) => {
			const invalidMessage = {
				body: {
					...testData.body,
					virusCheckStatus: status
				}
			};

			await handler(invalidMessage, ctx);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);
});
