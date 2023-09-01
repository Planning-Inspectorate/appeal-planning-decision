const { patchResponse, getResponse } = require('../../../src/services/responses.service');
const logger = require('../../../src/lib/logger');
const { ResponsesRepository } = require('../../../src/repositories/responses-repository');
const ApiError = require('../../../src/errors/apiError');

jest.mock('../../../src/lib/logger', () => {
	return {
		error: jest.fn()
	};
});

describe('./src/services/responses.service', () => {
	const journeyId = 'has-questionnaire';
	const referenceId = '12345';
	let patchResponsesSpy, getResponsesSpy;

	beforeEach(() => {
		patchResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'patchResponses');
		getResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'getResponses');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('patchResponse', () => {
		it('calls repository with journeyId, referenceId and answers and returns response if successful', async () => {
			patchResponsesSpy.mockResolvedValue({});

			const result = await patchResponse(journeyId, referenceId, { test: 'testing' });

			expect(patchResponsesSpy).toHaveBeenCalledWith(journeyId, referenceId, {
				test: 'testing'
			});
			expect(result).toEqual({});
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			patchResponsesSpy.mockRejectedValue(error);

			try {
				await patchResponse(journeyId, referenceId, { test: 'testing' });
			} catch (err) {
				expect(patchResponsesSpy).toHaveBeenCalledWith(journeyId, referenceId, {
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

		it('throws error if no journeyId provided', async () => {
			try {
				await patchResponse();
			} catch (err) {
				expect(patchResponsesSpy).not.toHaveBeenCalled();
				expect(err).toEqual(ApiError.noJourneyIdProvided());
			}
		});
	});

	describe('getResponse', () => {
		it('calls repository with uniqueId and answers and returns response if successful', async () => {
			getResponsesSpy.mockResolvedValue({});

			const result = await getResponse('has-questionnaire', '12345', { test: 'testing' });

			expect(getResponsesSpy).toHaveBeenCalledWith('has-questionnaire:12345', {
				test: 'testing'
			});
			expect(result).toEqual({});
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			getResponsesSpy.mockRejectedValue(error);

			try {
				await getResponse('has-questionnaire', '12345', { test: 'testing' });
			} catch (err) {
				expect(getResponsesSpy).toHaveBeenCalledWith('has-questionnaire:12345', {
					test: 'testing'
				});
				expect(logger.error).toHaveBeenCalledWith(error);
				expect(err).toEqual(ApiError.unableToGetResponse());
			}
		});

		it('throws error if no referenceId provided', async () => {
			try {
				await getResponse('has-questionnaire');
			} catch (err) {
				expect(getResponsesSpy).not.toHaveBeenCalled();
				expect(err).toEqual(ApiError.noReferenceIdProvided());
			}
		});

		it('throws error if no journeyId provided', async () => {
			try {
				await getResponse();
			} catch (err) {
				expect(getResponsesSpy).not.toHaveBeenCalled();
				expect(err).toEqual(ApiError.noJourneyIdProvided());
			}
		});
	});
});
