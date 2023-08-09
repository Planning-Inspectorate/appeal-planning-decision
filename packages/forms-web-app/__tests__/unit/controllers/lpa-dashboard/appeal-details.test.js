const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const FIXED_SYSTEM_TIME = '2023-07-10T13:53:31.600Z';
const req = {
	...mockReq(null)
};
const res = mockRes();

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.useFakeTimers('modern');
		jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
	});

	afterEach(() => {
		jest.useRealTimers();
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

			const documents = {
				applicationForm: {
					filename: 'a.pdf',
					documentURI: 'https://example.org/a.pdf'
				},
				decisionLetter: {
					filename: 'b.pdf',
					documentURI: 'https://example.org/b.pdf'
				},
				appealStatement: {
					filename: 'c.pdf',
					documentURI: 'https://example.org/c.pdf'
				},
				supportingDocuments: [
					{
						filename: 'd.pdf',
						documentURI: 'https://example.org/d.pdf'
					},
					{
						filename: 'e.pdf',
						documentURI: 'https://example.org/e.pdf'
					}
				]
			};

			getAppealDocumentMetaData.mockResolvedValueOnce(documents.applicationForm);
			getAppealDocumentMetaData.mockResolvedValueOnce(documents.decisionLetter);
			getAppealDocumentMetaData.mockResolvedValueOnce(documents.appealStatement);
			getAppealDocumentMetaData.mockResolvedValueOnce(documents.supportingDocuments);

			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			req.session.lpaUser = {
				lpaCode: 'E9999'
			};
			await getAppealDetails(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				dashboardLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				appeal,
				documents,
				dueInDays: -3,
				questionnaireDueDate: 'Friday, 7 July 2023'
			});
		});
	});
});
