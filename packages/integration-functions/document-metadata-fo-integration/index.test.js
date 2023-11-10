const got = require('got');
const run = require('./index.js');
const testData = require('./example.json');

jest.mock('got');

describe('document-metadata-fo-integration', () => {
	function getTestContext() {
		const ctx = {};
		ctx.log = jest.fn();
		ctx.log.info = jest.fn();
		ctx.log.warn = jest.fn();
		ctx.log.error = jest.fn();
		return ctx;
	}

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
		const ctx = getTestContext();
		await run(ctx, testData);

		expect(ctx.log).toHaveBeenCalledWith('Handle document metadata message', testData);
		expect(ctx.log).toHaveBeenCalledWith('Sending document metadata message to API');
		expect(got.put).toHaveBeenCalledWith(
			`https://test/document-meta-data/${testData.body.documentId}`,
			{ json: testData.body }
		);
		expect(ctx.log).toHaveBeenCalledWith(`Finished handling: ${testData.body.documentId}`);
	});

	it('should error if call to api fails', async () => {
		const ctx = getTestContext();
		got.put.mockImplementation(() => {
			throw new Error('test error');
		});

		await expect(async () => run(ctx, testData)).rejects.toThrowError('test error');
	});

	it('should error if message schema is invalid', async () => {
		const ctx = getTestContext();
		await expect(async () => run(ctx, { body: {} })).rejects.toThrowError('Invalid message schema');
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
			const ctx = getTestContext();
			const invalidMessage = {
				body: {
					...testData.body,
					publishedStatus: status
				}
			};

			await run(ctx, invalidMessage);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);

	const invalidVirusStatuses = ['not_scanned', 'affected', 'unknown'];

	it.each(invalidVirusStatuses)(
		'should ignore message if virus status is not valid: [%s]',
		async (status) => {
			const ctx = getTestContext();
			const invalidMessage = {
				body: {
					...testData.body,
					virusCheckStatus: status
				}
			};

			await run(ctx, invalidMessage);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);

	const invalidRedactedStatuses = ['not_redacted', 'unknown'];

	it.each(invalidRedactedStatuses)(
		'should ignore message if redacted status is not valid: [%s]',
		async (status) => {
			const ctx = getTestContext();
			const invalidMessage = {
				body: {
					...testData.body,
					virusCheckStatus: status
				}
			};

			await run(ctx, invalidMessage);

			expect(ctx.log).toHaveBeenCalledWith('Invalid message status, skipping');
			expect(got.put).not.toHaveBeenCalled();
		}
	);
});
