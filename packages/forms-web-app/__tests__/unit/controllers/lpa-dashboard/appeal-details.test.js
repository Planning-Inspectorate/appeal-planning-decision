const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const {
	getAppealByLPACodeAndId,
	getAppealDocumentMetaData
} = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { isFeatureActive } = require('../../../../src/featureFlag');

const FIXED_SYSTEM_TIME = '2023-07-10T13:53:31.600Z';
const req = {
	...mockReq(null)
};
const res = mockRes();

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/featureFlag');

const mockAppeal = {
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

const mockDocuments = {
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

const backOverride = {
	href: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
	text: 'Back to appeals'
};

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
		it('should render the view', async () => {
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.applicationForm);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.decisionLetter);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.appealStatement);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.supportingDocuments);
			isFeatureActive.mockResolvedValueOnce(false);

			getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);
			req.session.lpaUser = {
				lpaCode: 'E9999'
			};
			await getAppealDetails(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				backOverride,
				appeal: mockAppeal,
				documents: mockDocuments,
				dueInDays: -3,
				appealQuestionnaireLink: `/${VIEW.LPA_QUESTIONNAIRE.QUESTIONNAIRE}`,
				questionnaireDueDate: 'Friday, 7 July 2023',
				showQuestionnaire: false
			});
		});

		it('should render the view with a link to add-remove', async () => {
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.applicationForm);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.decisionLetter);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.appealStatement);
			getAppealDocumentMetaData.mockResolvedValueOnce(mockDocuments.supportingDocuments);
			isFeatureActive.mockResolvedValueOnce(true);
			getAppealByLPACodeAndId.mockResolvedValue(mockAppeal);

			req.session.lpaUser = {
				lpaCode: 'E9999'
			};

			await getAppealDetails(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				backOverride,
				appeal: mockAppeal,
				documents: mockDocuments,
				dueInDays: -3,
				appealQuestionnaireLink: `/${VIEW.LPA_QUESTIONNAIRE.QUESTIONNAIRE}`,
				questionnaireDueDate: 'Friday, 7 July 2023',
				showQuestionnaire: true
			});
		});
	});
});
