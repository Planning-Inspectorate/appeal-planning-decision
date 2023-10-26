const {
	patchResponse,
	getResponse,
	submitResponse
} = require('../../../src/services/responses.service');
const logger = require('../../../src/lib/logger');
const { ResponsesRepository } = require('../../../src/repositories/responses-repository');
const ApiError = require('../../../src/errors/apiError');
const {
	HasQuestionnaireMapper
} = require('../../../src/mappers/questionnaire-submission/has-mapper');

jest.mock('../../../src/lib/logger', () => {
	return {
		error: jest.fn(),
		info: jest.fn()
	};
});

describe('./src/services/responses.service', () => {
	const journeyId = 'has-questionnaire';
	const referenceId = '12345';
	const lpaCode = 'Q9999';
	let patchResponsesSpy, getResponsesSpy, hasQuestionniareMapperSpy;

	beforeEach(() => {
		patchResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'patchResponses');
		getResponsesSpy = jest.spyOn(ResponsesRepository.prototype, 'getResponses');
		hasQuestionniareMapperSpy = jest.spyOn(HasQuestionnaireMapper.prototype, 'mapToPINSDataModel');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('patchResponse', () => {
		it('calls repository with journeyId, referenceId and answers and returns response if successful', async () => {
			patchResponsesSpy.mockResolvedValue({});

			const result = await patchResponse(journeyId, referenceId, { test: 'testing' }, lpaCode);

			expect(patchResponsesSpy).toHaveBeenCalledWith(
				journeyId,
				referenceId,
				{
					test: 'testing'
				},
				lpaCode
			);
			expect(result).toEqual({});
		});

		it('throws error if call to repo unsuccessful', async () => {
			const error = new Error('database error');
			patchResponsesSpy.mockRejectedValue(error);

			try {
				await patchResponse(journeyId, referenceId, { test: 'testing' }, lpaCode);
			} catch (err) {
				expect(patchResponsesSpy).toHaveBeenCalledWith(
					journeyId,
					referenceId,
					{
						test: 'testing'
					},
					lpaCode
				);
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

	describe('submitResponse', () => {
		it('maps questionnaire data and sends to event client if sucessful', async () => {
			getResponsesSpy.mockResolvedValue({});
			hasQuestionniareMapperSpy.mockReturnValue({});

			const questionnaireResponse = {
				_id: 123456789,
				answers: {
					'notified-who': { uploadedFiles: [] },
					'correct-appeal-type': 'no',
					'affects-listed-building': 'yes'
				},
				journeyId: 'has-questionnaire',
				referenceId: 'APP/Q9999/W/22/1234567'
			};
			await submitResponse(questionnaireResponse);
			expect(hasQuestionniareMapperSpy).toHaveBeenCalledWith(questionnaireResponse);
		});

		it('throws error if submission unsuccessful', async () => {
			const error = new Error('database error');
			getResponsesSpy.mockRejectedValue(error);

			try {
				await submitResponse('has-questionnaire', '12345', { test: 'testing' });
			} catch (err) {
				expect(getResponsesSpy).toHaveBeenCalledWith('has-questionnaire:12345', {
					test: 'testing'
				});
				expect(logger.error).toHaveBeenCalledWith(error);
				expect(err).toEqual(ApiError.unableToGetResponse());
			}
		});
	});
});
