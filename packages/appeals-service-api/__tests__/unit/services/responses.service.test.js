const { patchResponse } = require('../../../src/services/responses.service');
const logger = require('../../../src/lib/logger');
const ResponsesRepository = require('../../../src/repositories/responses-repository');
const ApiError = require('../../../src/errors/apiError');

jest.mock('../../../src/lib/logger', () => {
	return {
		error: jest.fn()
	};
});

describe('./src/services/responses.service', () => {
	let patchResponsesSpy;

	beforeEach(() => {
		patchResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'patchResponses');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('patchResponse', () => {
		it('calls repository with uniqueId and answers and returns response if successful', async () => {
			patchResponsesSpy.mockResolvedValue({});

			const result = await patchResponse('has-questionnaire', '12345', { test: 'testing' });

			expect(patchResponsesSpy).toHaveBeenCalledWith('has-questionnaire:12345', {
				test: 'testing'
			});
			expect(result).toEqual({});
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			patchResponsesSpy.mockRejectedValue(error);

			try {
				await patchResponse('has-questionnaire', '12345', { test: 'testing' });
			} catch (err) {
				expect(patchResponsesSpy).toHaveBeenCalledWith('has-questionnaire:12345', {
					test: 'testing'
				});
				expect(logger.error).toHaveBeenCalledWith(error);
				expect(err).toEqual(ApiError.unableToUpdateResponse());
			}
		});

		it('throws error if no referenceId provided', async () => {
			try {
				await patchResponse('has-questionnaire');
			} catch (err) {
				expect(patchResponsesSpy).not.toHaveBeenCalled();
				expect(err).toEqual(ApiError.noReferenceIdProvided());
			}
		});

		it('throws error if no formId provided', async () => {
			try {
				await patchResponse();
			} catch (err) {
				expect(patchResponsesSpy).not.toHaveBeenCalled();
				expect(err).toEqual(ApiError.noFormIdProvided());
			}
		});
	});
});
