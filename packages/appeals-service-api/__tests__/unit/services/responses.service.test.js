const {
	getResponse,
	mapQuestionnaireDataForBackOffice,
	patchResponse,
	submitResponseFactory
} = require('../../../src/services/responses.service');
const logger = require('../../../src/lib/logger');
const { ResponsesRepository } = require('../../../src/repositories/responses-repository');
const ApiError = require('../../../src/errors/apiError');
const {
	submittedQuestionnaireObjectPreMap,
	submittedQuestionnaireObjectPostMap
} = require('../testConstants');

jest.mock('../../../src/lib/logger', () => {
	return {
		error: jest.fn(),
		info: jest.fn()
	};
});

jest.mock('../../../src/data-producers/lpa-response-producer');
jest.mock('../../../src/services/object-store', () => ({
	...jest.requireActual('../../../src/services/object-store'),
	blobMetaGetter: jest.fn(() => async () => ({
		createdOn: '2023-11-06T11:40:07.453Z',
		lastModified: '2023-11-06T11:40:07.453Z',
		document_type: undefined,
		metadata: {
			mime_type: 'image/jpeg'
		},
		_response: {
			request: {
				url: 'http://blob-storage:10000/devstoreaccount1/uploads/has-questionnaire%3AAPP_Q9999_W_22_1234567/5b857ec6-9317-4530-81c3-d4ed5994ade2/APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg'
			}
		}
	}))
}));

describe('./src/services/responses.service', () => {
	const journeyId = 'has-questionnaire';
	const referenceId = '12345';
	const lpaCode = 'Q9999';

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

	describe('submitResponseFactory', () => {
		it('maps data and calls the callback function with the map result', async () => {
			const testMappingFunction = (a) => a + 'b';

			const testCallback = (a) => a + 'c';

			const submitResponse = submitResponseFactory(testMappingFunction, testCallback);

			expect(await submitResponse('a')).toBe('abc');
		});
	});

	it('throws error if submission unsuccessful', async () => {
		const testMappingFunction = (a) => a + 'b';

		const testCallback = () => {
			throw Error('some error');
		};

		const submitResponse = submitResponseFactory(testMappingFunction, testCallback);
		try {
			await submitResponse('a');
		} catch (err) {
			expect(logger.error).toHaveBeenCalledWith(Error('some error'));
			expect(err).toEqual(ApiError.unableToSubmitResponse());
		}

		expect.hasAssertions();
	});

	describe('mapQuestionnaireDataForBackOffice', () => {
		it('maps questionnaire data to the format specified by the PINS data model', async () => {
			const result = await mapQuestionnaireDataForBackOffice(submittedQuestionnaireObjectPreMap);

			expect(result).toEqual(submittedQuestionnaireObjectPostMap);
		});
	});
});
