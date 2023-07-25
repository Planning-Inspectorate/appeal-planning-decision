const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const { getAppealByLPACodeAndId } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');

const req = {
	...mockReq(null)
};
const res = mockRes();

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAppealDetails', () => {
		it('should render the view with a link to add-remove', async () => {
			const appeal = {
				type: APPEAL_ID.HOUSEHOLDER,
				caseReference: '1345264',
				appealType: 'Householder appeal',
				siteAddressLine1: '2 Aubrey House',
				siteAddressLine2: 'Aubrey Road',
				siteAddressTown: '',
				siteAddressCounty: '',
				siteAddressPostcode: 'BS3 3EX',
				appellant: 'Rachel Silver',
				LPAApplicationReference: '23/04125/FUL'
			};
			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			await getAppealDetails(req, res);
			const expectedQuesionnaireDueDate = 'Monday, 31 July 2023';

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				dashboardLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				expectedQuesionnaireDueDate,
				appeal
			});
		});
	});
});
