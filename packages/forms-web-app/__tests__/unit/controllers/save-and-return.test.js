const { mockReq, mockRes } = require('../mocks');
const { postSaveAndReturn } = require('../../../src/controllers/save');
const { saveAppeal } = require('../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../src/lib/submit-appeal/views');

jest.mock('../../../src/lib/appeals-api-wrapper');

describe('controllers/save-and-return', () => {
	let req;
	let res;
	let appeal;

	beforeEach(() => {
		appeal = 'data';
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('postSaveAndReturn', () => {
		it('should redirect to the expected route if valid', async () => {
			req = {
				...req,
				session: {
					appeal
				}
			};
			await postSaveAndReturn(req, res);
			expect(saveAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.SUBMIT_APPEAL.APPLICATION_SAVED}`);
		});
	});
});
