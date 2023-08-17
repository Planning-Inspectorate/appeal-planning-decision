const { list } = require('./controller');
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { HasJourney } = require('./has-questionnaire/journey');
const {
	VIEW: { TASK_LIST }
} = require('./dynamic-components/views');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockJourney = {
	sections: [
		{
			name: 'Section 1',
			segment: 'segment-1',
			questions: [
				{
					title: 'Title 1a',
					question: 'Why?',
					taskList: true,
					fieldName: 'title-1a'
				},
				{
					title: 'Title 1b',
					question: 'Who?',
					taskList: false,
					fieldName: 'title-1b'
				}
			]
		},
		{
			name: 'Section 2',
			segment: 'segment-2',
			questions: [
				{
					title: 'Title 2a',
					question: 'How?',
					taskList: true,
					fieldName: 'title-2a'
				},
				{
					title: 'Title 2b',
					question: 'What?',
					taskList: true,
					fieldName: 'title-2b'
				}
			]
		},
		{
			name: 'Section 3',
			segment: 'segment-3',
			questions: [
				{
					title: 'Title 3a',
					question: 'When?',
					taskList: false,
					fieldName: 'title-3a'
				},
				{
					title: 'Title 3b',
					question: 'Really?',
					taskList: true,
					fieldName: 'title-3b'
				}
			]
		}
	]
};

const mockCaseRef = '123456';

const mockSummaryListData = {
	sections: [
		{
			heading: 'Section 1',
			list: {
				rows: [
					{
						actions: {
							items: [
								{
									href: `/manage-appeals/questionnaire/${mockCaseRef}/${mockJourney.sections[0].segment}/${mockJourney.sections[0].questions[0].fieldName}`,
									text: 'Answer',
									visuallyHiddenText: mockJourney.sections[0].questions[0].question
								}
							]
						},
						key: { text: mockJourney.sections[0].questions[0].title },
						value: { text: 'Not started' }
					}
				]
			}
		},
		{
			heading: 'Section 2',
			list: {
				rows: [
					{
						actions: {
							items: [
								{
									href: `/manage-appeals/questionnaire/${mockCaseRef}/${mockJourney.sections[1].segment}/${mockJourney.sections[1].questions[0].fieldName}`,
									text: 'Answer',
									visuallyHiddenText: mockJourney.sections[1].questions[0].question
								}
							]
						},
						key: { text: mockJourney.sections[1].questions[0].title },
						value: { text: 'Not started' }
					},
					{
						actions: {
							items: [
								{
									href: `/manage-appeals/questionnaire/${mockCaseRef}/${mockJourney.sections[1].segment}/${mockJourney.sections[1].questions[1].fieldName}`,
									text: 'Answer',
									visuallyHiddenText: mockJourney.sections[1].questions[1].question
								}
							]
						},
						key: { text: mockJourney.sections[1].questions[1].title },
						value: { text: 'Not started' }
					}
				]
			}
		},
		{
			heading: 'Section 3',
			list: {
				rows: [
					{
						actions: {
							items: [
								{
									href: `/manage-appeals/questionnaire/${mockCaseRef}/${mockJourney.sections[2].segment}/${mockJourney.sections[2].questions[1].fieldName}`,
									text: 'Answer',
									visuallyHiddenText: mockJourney.sections[2].questions[1].question
								}
							]
						},
						key: { text: mockJourney.sections[2].questions[1].title },
						value: { text: 'Not started' }
					}
				]
			}
		}
	]
};

jest.mock('../lib/appeals-api-wrapper');
jest.mock('../services/lpa-user.service');
jest.mock('./has-questionnaire/journey');

describe('dynamic-form/controller', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('list', () => {
		it('should render the view correctly', async () => {
			req.params.caseRef = mockCaseRef;
			const appeal = { a: 1 };
			const lpaUser = {
				lpaCode: 'E9999'
			};

			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			getLPAUserFromSession.mockReturnValue(lpaUser);
			HasJourney.mockImplementation(() => {
				return mockJourney;
			});

			await list(req, res);

			expect(res.render).toHaveBeenCalledWith(TASK_LIST, {
				appeal,
				summaryListData: mockSummaryListData
			});
		});
	});
});
