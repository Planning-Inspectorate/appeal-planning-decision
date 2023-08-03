const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

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
				type: 'Householder (HAS) Appeal',
				caseReference: '1345264',
				appealValidDate: '2023-07-24T12:21:11.208Z',
				appealType: 'Householder (HAS) Appeal',
				siteAddressLine1: '2 Aubrey House',
				siteAddressLine2: 'Aubrey Road',
				siteAddressTown: '',
				siteAddressCounty: '',
				siteAddressPostcode: 'BS3 3EX',
				appellant: 'Rachel Silver',
				LPAApplicationReference: '23/04125/FUL',
				questionnaireDueDate: '2023-07-07T13:53:31.600Z',
				agent: 'Jane Fischold',
				ownershipCertificate: 'Fully owned',
				isSiteVisible: 'Yes',
				doesSiteHaveHealthAndSafetyIssues: 'Yes',
				healthAndSafetyIssuesDetails: 'The site needs to be seen from a height'
			};
			const applicationForm = {
				filename: 'a.pdf',
				documentURI: 'https://example.org/a.pdf'
			};
			getAppealDocumentMetaData.mockResolvedValue(applicationForm);
			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			req.session.lpaUser = {
				lpaCode: 'E9999'
			};
			await getAppealDetails(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				dashboardLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				appeal,
				applicationForm,
				questionnaireDueDate: 'Friday, 7 July 2023'
			});
		});
	});
});
