const { list, question } = require('./controller');
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { Journey } = require('./journey');
const { getJourney, getJourneyResponseByType } = require('./journey-types');

const {
	VIEW: { TASK_LIST }
} = require('./dynamic-components/views');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const res = mockRes();

const mockBaseUrl = '/manage-appeals/questionnaire';
const mockRef = '123456';

class TestJourney extends Journey {
	constructor(response) {
		super(`${mockBaseUrl}/${mockRef}`, response);

		this.sections = [
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
		];
	}
}

const mockResponse = {
	answers: {}
};

const mockJourney = new TestJourney(mockResponse);

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
									href: `${mockBaseUrl}/${mockRef}/${mockJourney.sections[0].segment}/${mockJourney.sections[0].questions[0].fieldName}`,
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
									href: `${mockBaseUrl}/${mockRef}/${mockJourney.sections[1].segment}/${mockJourney.sections[1].questions[0].fieldName}`,
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
									href: `${mockBaseUrl}/${mockRef}/${mockJourney.sections[1].segment}/${mockJourney.sections[1].questions[1].fieldName}`,
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
									href: `${mockBaseUrl}/${mockRef}/${mockJourney.sections[2].segment}/${mockJourney.sections[2].questions[1].fieldName}`,
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

const sampleQuestionObj = {
	fieldName: 'sampleFieldName',
	renderAction: null,
	prepQuestionForRendering: jest.fn(),
	type: 'sampleType'
};

jest.mock('../lib/appeals-api-wrapper');
jest.mock('../services/lpa-user.service');
jest.mock('./journey-types');

describe('dynamic-form/controller', () => {
	let req;
	beforeEach(() => {
		jest.resetAllMocks();
		req = {
			...mockReq(null)
		};
	});

	describe('list', () => {
		it('should render the view correctly', async () => {
			req.params.referenceId = mockRef;
			const appeal = { a: 1 };
			const lpaUser = {
				lpaCode: 'E9999'
			};

			getAppealByLPACodeAndId.mockResolvedValue(appeal);
			getLPAUserFromSession.mockReturnValue(lpaUser);
			getJourneyResponseByType.mockReturnValue({});
			getJourney.mockReturnValue(mockJourney);

			await list(req, res, '');

			expect(res.render).toHaveBeenCalledWith(TASK_LIST.QUESTIONNAIRE, {
				appeal,
				summaryListData: mockSummaryListData,
				layoutTemplate: '../../../views/layouts/lpa-dashboard/main.njk'
			});
		});
	});

	describe('question', () => {
		it('should redirect if question is not found', async () => {
			getJourneyResponseByType.mockReturnValue({});
			getJourney.mockReturnValue(mockJourney);
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(null);

			await question(req, res, 'sampleJourneyId');

			expect(res.redirect).toHaveBeenCalledWith(mockJourney.baseUrl);
		});

		it('should use custom action if renderAction is defined', async () => {
			getJourneyResponseByType.mockReturnValue({});
			getJourney.mockReturnValue(mockJourney);
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);
			sampleQuestionObj.renderAction = jest.fn(async () => {});

			await question(req, res, 'sampleJourneyId');

			expect(sampleQuestionObj.renderAction).toHaveBeenCalledWith(req, res);
		});

		it('should render the question template', async () => {
			req.params.referenceId = mockRef;
			const mockAnswer = 'sampleAnswer';
			const mockBackLink = 'back';
			const mockQuestionRendering = 'test';

			getJourneyResponseByType.mockReturnValue({});
			getJourney.mockReturnValue(mockJourney);

			sampleQuestionObj.renderAction = null;
			sampleQuestionObj.prepQuestionForRendering = jest.fn();
			sampleQuestionObj.prepQuestionForRendering.mockReturnValueOnce(mockQuestionRendering);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);
			mockJourney.response.answers.sampleFieldName = mockAnswer;
			mockJourney.getNextQuestionUrl = jest.fn();
			mockJourney.getNextQuestionUrl.mockReturnValue(mockBackLink);

			await question(req, res, 'sampleJourneyId');

			expect(res.render).toHaveBeenCalledWith(
				'dynamic-components/sampleType/index',
				expect.objectContaining({
					appealId: mockRef,
					question: mockQuestionRendering,
					answer: mockAnswer,
					backLink: mockBackLink,
					navigation: ['', mockBackLink]
				})
			);
		});
	});
});