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
	const formId = 'has-questionnaire';
	const referenceId = '12345';

	beforeEach(() => {
		patchResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'patchResponses');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('patchResponse', () => {
		it('calls repository with formId, referenceId and answers and returns response if successful', async () => {
			patchResponsesSpy.mockResolvedValue({});

			const result = await patchResponse(formId, referenceId, { test: 'testing' });

			expect(patchResponsesSpy).toHaveBeenCalledWith(formId, referenceId, {
				test: 'testing'
			});
			expect(result).toEqual({});
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			patchResponsesSpy.mockRejectedValue(error);

			try {
				await patchResponse(formId, referenceId, { test: 'testing' });
			} catch (err) {
				expect(patchResponsesSpy).toHaveBeenCalledWith(formId, referenceId, {
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
