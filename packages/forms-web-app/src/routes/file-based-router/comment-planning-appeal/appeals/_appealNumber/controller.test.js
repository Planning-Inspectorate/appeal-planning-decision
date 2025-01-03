const { selectedAppeal } = require('./controller');
const { getAppealStatus } = require('#utils/appeal-status');
const { formatCommentDeadlineText } = require('../../../../../utils/format-deadline-text');
const { formatCommentDecidedData } = require('../../../../../utils/format-comment-decided-data');
const { formatCommentHeadlineText } = require('../../../../../utils/format-headline-text');
const { formatCommentInquiryText } = require('../../../../../utils/format-comment-inquiry-text');
const { formatCommentHearingText } = require('../../../../../utils/format-comment-hearing-text');
const { formatHeadlineData } = require('@pins/common');
const { getDepartmentFromCode } = require('../../../../../services/department.service');
const {
	createInterestedPartySession
} = require('../../../../../services/interested-party.service');

jest.mock('#utils/appeal-status');
jest.mock('../../../../../utils/format-deadline-text');
jest.mock('../../../../../utils/format-comment-decided-data');
jest.mock('../../../../../utils/format-headline-text');
jest.mock('../../../../../utils/format-comment-inquiry-text');
jest.mock('../../../../../utils/format-comment-hearing-text');
jest.mock('@pins/common');
jest.mock('../../../../../services/department.service');
jest.mock('../../../../../services/interested-party.service');

describe('selectedAppeal Controller Tests', () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: { appealNumber: '12345' },
			appealsApiClient: {
				getAppealCaseByCaseRef: jest.fn()
			}
		};
		res = {
			render: jest.fn()
		};
	});

	it('should render the appeal page with formatted data', async () => {
		const appeal = {
			LPACode: 'LPA123',
			siteAddressPostcode: 'AB12 3CD',
			Events: []
		};
		const lpa = { name: 'Local Planning Authority' };
		const status = 'In Progress';
		const headlineText = 'Headline Text';
		const deadlineText = 'Deadline Text';
		const decidedData = 'Decided Data';
		const inquiries = [];
		const hearings = [];

		req.appealsApiClient.getAppealCaseByCaseRef.mockResolvedValue(appeal);
		getDepartmentFromCode.mockResolvedValue(lpa);
		getAppealStatus.mockReturnValue(status);
		formatCommentHeadlineText.mockReturnValue(headlineText);
		formatCommentDeadlineText.mockReturnValue(deadlineText);
		formatCommentDecidedData.mockReturnValue(decidedData);
		formatCommentInquiryText.mockReturnValue(inquiries);
		formatCommentHearingText.mockReturnValue(hearings);
		formatHeadlineData.mockReturnValue('Headline Data');

		await selectedAppeal(req, res);

		expect(req.appealsApiClient.getAppealCaseByCaseRef).toHaveBeenCalledWith('12345');
		expect(createInterestedPartySession).toHaveBeenCalledWith(req, '12345', 'AB12 3CD');
		expect(getDepartmentFromCode).toHaveBeenCalledWith('LPA123');
		expect(getAppealStatus).toHaveBeenCalledWith(appeal);
		expect(formatCommentHeadlineText).toHaveBeenCalledWith('12345', status);
		expect(formatCommentDeadlineText).toHaveBeenCalledWith(appeal, status);
		expect(formatCommentDecidedData).toHaveBeenCalledWith(appeal);
		expect(formatCommentInquiryText).toHaveBeenCalledWith(appeal.Events);
		expect(formatCommentHearingText).toHaveBeenCalledWith(appeal.Events);
		expect(formatHeadlineData).toHaveBeenCalledWith(appeal, lpa.name);
		expect(res.render).toHaveBeenCalledWith('comment-planning-appeal/appeals/_appealNumber/index', {
			appeal: {
				...appeal,
				status,
				headlineText,
				deadlineText,
				decidedData,
				inquiries,
				hearings
			},
			headlineData: 'Headline Data'
		});
	});
});
