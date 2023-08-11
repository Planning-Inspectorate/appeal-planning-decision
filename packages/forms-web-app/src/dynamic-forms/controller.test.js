const { renderTaskList } = require('./controller');
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const {
	VIEW: { TASK_LIST }
} = require('./dynamic-components/views');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

jest.mock('../lib/appeals-api-wrapper');
jest.mock('../services/lpa-user.service');

describe('dynamic-form/controller', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAppealDetails', () => {
		it('should render the view', async () => {
			const appeal = { a: 1 };
			const lpaUser = {
				lpaCode: 'E9999'
			};

			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			getLPAUserFromSession.mockReturnValue(lpaUser);

			await renderTaskList(req, res);

			expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
				appeal
			});
		});
	});
});
