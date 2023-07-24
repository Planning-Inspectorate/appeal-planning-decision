const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');
const { getExistingAppealByLPACodeAndId } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');

jest.mock('../../../../src/services/lpa-user.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com',
	lpaName: 'test-lpa'
};

const mockAppeal = {
	appealValidDate: new Date('2023-07-24T12:21:11.208Z'),
	type: APPEAL_ID.HOUSEHOLDER
};

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAppealDetails', () => {
		it('should render the view with a link to add-remove', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getExistingAppealByLPACodeAndId.mockResolvedValue(mockAppeal);

			await getAppealDetails(req, res);
			const expectedQuesionnaireDueDate = 'Monday, 31 July 2023';

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				lpaName: mockUser.lpaName,
				dashboardLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				questionnaireDueDate: expectedQuesionnaireDueDate
			});
		});
	});
});
