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
	describe('patchResponseByReferenceId', () => {
		it('should return 200 and data returned from service call if successful', async () => {
			req.params = {
				journeyId: journeyId,
				referenceId: referenceId
			};

			req.body.answers = answers;
			patchResponse.mockReturnValue({});

			await patchResponseByReferenceId(req, res);

			expect(patchResponse).toHaveBeenCalledWith(journeyId, referenceId, answers);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({});
		});

		it('should return error status code and message if service call errors', async () => {
			const error = ApiError.noReferenceIdProvided();
			patchResponse.mockImplementation(() => {
				throw error;
			});

			await patchResponseByReferenceId(req, res);

			expect(res.status).toHaveBeenCalledWith(error.code);
			expect(res.send).toHaveBeenCalledWith(error.message.errors);
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

			await getResponseByReferenceId(req, res);

			expect(getResponse).toHaveBeenCalledWith(journeyId, referenceId, projection);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({ test: 'test' });
		});

		it('should return error status code and message if service call errors', async () => {
			const error = ApiError.noReferenceIdProvided();
			getResponse.mockImplementation(() => {
				throw error;
			});

			await getResponseByReferenceId(req, res);

			expect(res.status).toHaveBeenCalledWith(error.code);
			expect(res.send).toHaveBeenCalledWith(error.message.errors);
		});
	});
});
