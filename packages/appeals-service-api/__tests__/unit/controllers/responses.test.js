const {
	patchResponseByReferenceId,
	getResponseByReferenceId
} = require('../../../src/controllers/responses');
const ApiError = require('../../../src/errors/apiError');
const { patchResponse, getResponse } = require('../../../src/services/responses.service');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

jest.mock('../../../src/services/responses.service');

describe('Responses API controller', () => {
	const journeyId = 'has-questionnaire';
	const referenceId = '12345';
	const answers = { test: 'testing' };
	const lpaCode = 'Q9999';
	beforeEach(async () => {
		jest.clearAllMocks();
	});
	describe('patchResponseByReferenceId', () => {
		it('should return 200 and data returned from service call if successful', async () => {
			req.params = {
				journeyId: journeyId,
				referenceId: referenceId,
				lpaCode: lpaCode
			};

			req.body.answers = answers;
			patchResponse.mockReturnValue({});

			const result = await patchResponseByReferenceId(req, res);

			expect(patchResponse).toHaveBeenCalledWith(journeyId, referenceId, answers, lpaCode);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({});
			expect(result).toEqual(res);
		});

		it('should return error status code and message if service call errors', async () => {
			const error = ApiError.noReferenceIdProvided();
			patchResponse.mockImplementation(() => {
				throw error;
			});

			const result = await patchResponseByReferenceId(req, res);

			expect(res.status).toHaveBeenCalledWith(error.code);
			expect(res.send).toHaveBeenCalledWith(error.message.errors);
			expect(result).toEqual(res);
		});
		it('should throw an error if an unexpected error is thrown', async () => {
			const unexpectedError = new Error('blah');
			patchResponse.mockImplementation(() => {
				throw unexpectedError;
			});
			try {
				await patchResponseByReferenceId(req, res);
			} catch (error) {
				expect(error).toEqual(unexpectedError);
			}
			expect(res.status).not.toHaveBeenCalled();
			expect(res.send).not.toHaveBeenCalled();
		});
	});

	describe('getResponseByReferenceId', () => {
		it('should return 200 and data returned from service call if successful', async () => {
			req.params = {
				journeyId: journeyId,
				referenceId: referenceId
			};

			let projection = undefined;

			getResponse.mockReturnValue({ test: 'test' });

			const result = await getResponseByReferenceId(req, res);

			expect(getResponse).toHaveBeenCalledWith(journeyId, referenceId, projection);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({ test: 'test' });
			expect(result).toEqual(res);
		});

		it('should return error status code and message if service call errors', async () => {
			const error = ApiError.noReferenceIdProvided();
			getResponse.mockImplementation(() => {
				throw error;
			});

			const result = await getResponseByReferenceId(req, res);

			expect(res.status).toHaveBeenCalledWith(error.code);
			expect(res.send).toHaveBeenCalledWith(error.message.errors);
			expect(result).toEqual(res);
		});
	});
});
