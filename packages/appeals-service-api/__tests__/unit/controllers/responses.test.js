const { patchResponseByReferenceId } = require('../../../src/controllers/responses');
const ApiError = require('../../../src/errors/apiError');
const { patchResponse } = require('../../../src/services/responses.service');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

jest.mock('../../../src/services/responses.service');

describe('Responses API controller', () => {
	describe('patchResponseByReferenceId', () => {
		const formId = 'has-questionnaire';
		const referenceId = '12345';
		const answers = { test: 'testing' };

		it('should return 200 and data returned from service call if successful', async () => {
			req.params = {
				formId: formId,
				referenceId: referenceId
			};

			req.body.answers = answers;
			patchResponse.mockReturnValue({});

			await patchResponseByReferenceId(req, res);

			expect(patchResponse).toHaveBeenCalledWith(formId, referenceId, answers);
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
});
