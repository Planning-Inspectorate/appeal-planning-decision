const { list, question, save } = require('./controller');
const { getAppealByLPACodeAndId, patchQuestionResponse } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { Journey } = require('./journey');
const { SECTION_STATUS } = require('./section');
const { getJourney, getJourneyResponseByType } = require('./journey-factory');

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
				getStatus: () => {
					return SECTION_STATUS.COMPLETE;
				},
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
				getStatus: () => {
					return SECTION_STATUS.IN_PROGRESS;
				},
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
				getStatus: () => {
					return SECTION_STATUS.NOT_STARTED;
				},
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

let mockJourney;
let mockSummaryListData;

const sampleQuestionObj = {
	fieldName: 'sampleFieldName',
	renderAction: null,
	prepQuestionForRendering: jest.fn(),
	viewFolder: 'sampleType'
};

jest.mock('../lib/appeals-api-wrapper');
jest.mock('../services/lpa-user.service');
jest.mock('./journey-factory');

describe('dynamic-form/controller', () => {
	let req;
	beforeEach(() => {
		jest.resetAllMocks();
		mockJourney = new TestJourney(mockResponse);
		mockSummaryListData = _getmockSummaryListData(mockJourney);
		req = {
			...mockReq(null)
		};
	});

	describe('list', () => {
		it('should render the view correctly', async () => {
			req.params.referenceId = mockRef;
			const appeal = { a: 1, caseReference: 2 };
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
				layoutTemplate: 'has-questionnaire/template.njk',
				pageCaption: `Appeal ${appeal.caseReference}`
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
			const mockSection = {
				name: '123'
			};

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
			mockJourney.getSection = jest.fn();
			mockJourney.getSection.mockReturnValue(mockSection);

			await question(req, res, 'sampleJourneyId');

			expect(res.render).toHaveBeenCalledWith(
				'dynamic-components/sampleType/index',
				expect.objectContaining({
					appealId: mockRef,
					question: mockQuestionRendering,
					answer: mockAnswer,
					backLink: mockBackLink,
					navigation: ['', mockBackLink],
					layoutTemplate: 'has-questionnaire/template.njk',
					pageCaption: mockSection.name
				})
			);
		});
	});

	describe('save', () => {
		it('should call API function to patch answer to question and redirect to next question if successful', async () => {
			const journeyId = 'has-questionnaire';

			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName
			};

			req.body = {
				sampleFieldName: true,
				sampleFieldName_sub: 'send this',
				notSampleFieldName: 'do not send this'
			};

			getJourneyResponseByType.mockReturnValue({
				referenceId: mockRef,
				journeyId: journeyId,
				answers: {}
			});
			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);

			await save(req, res, journeyId);

			expect(patchQuestionResponse).toHaveBeenCalledWith(journeyId, mockRef, {
				answers: { sampleFieldName: true, sampleFieldName_sub: 'send this' }
			});
			expect(res.redirect).toHaveBeenCalledWith(
				`${mockBaseUrl}/${mockRef}/${mockJourney.sections[0].segment}/${mockJourney.sections[0].questions[1].fieldName}`
			);
		});

		it('should handle error if API function fails', async () => {
			const journeyId = 'has-questionnaire';

			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName
			};

			req.body = {
				sampleFieldName: true
			};

			getJourneyResponseByType.mockReturnValue({
				referenceId: mockRef,
				journeyId: journeyId,
				answers: {}
			});
			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);

			const mockQuestionRendering = 'test';
			sampleQuestionObj.prepQuestionForRendering = jest.fn();
			sampleQuestionObj.prepQuestionForRendering.mockReturnValueOnce(mockQuestionRendering);

			mockJourney.getCurrentQuestionUrl = jest.fn();
			const mockBackLink = 'mock-back-link';
			mockJourney.getCurrentQuestionUrl.mockReturnValueOnce(mockBackLink);

			const error = new Error('Test error');
			patchQuestionResponse.mockImplementation(() => Promise.reject(error));

			await save(req, res, journeyId);
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith('dynamic-components/sampleType/index', {
				appealId: mockRef,
				question: mockQuestionRendering,
				answer: true,
				backLink: mockBackLink,
				navigation: ['', mockBackLink],
				errorSummary: [{ href: '#', text: 'Error: Test error' }]
			});
		});
	});
});

const _getmockSummaryListData = (mockJourney) => {
	return {
		completedSectionCount: 1,
		sections: [
			{
				heading: 'Section 1',
				status: SECTION_STATUS.COMPLETE,
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
				status: SECTION_STATUS.IN_PROGRESS,
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
				status: SECTION_STATUS.NOT_STARTED,
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
};
