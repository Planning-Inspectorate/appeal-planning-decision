const { list, question, save } = require('./controller');
const { getAppealByLPACodeAndId } = require('../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../services/lpa-user.service');
const { Journey } = require('./journey');
const { SECTION_STATUS } = require('./section');
const { getJourney } = require('./journey-factory');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const res = mockRes();
const mockBaseUrl = '/manage-appeals/questionnaire';
const mockRef = '123456';
const mockTemplateUrl = 'template.njk';
const mockListingPath = 'mockListingPath.njk';
const mockJourneyTitle = 'Mock Manage Appeals';
const mockAnswer = 'Not started';

class TestJourney extends Journey {
	constructor(response) {
		super(
			`${mockBaseUrl}/${mockRef}`,
			response,
			mockTemplateUrl,
			mockListingPath,
			mockJourneyTitle
		);

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
						fieldName: 'title-1a',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
					},
					{
						title: 'Title 1b',
						question: 'Who?',
						taskList: false,
						fieldName: 'title-1b',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
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
						fieldName: 'title-2a',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
					},
					{
						title: 'Title 2b',
						question: 'What?',
						taskList: true,
						fieldName: 'title-2b',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
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
						fieldName: 'title-3a',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
					},
					{
						title: 'Title 3b',
						question: 'Really?',
						taskList: true,
						fieldName: 'title-3b',
						formatAnswerForSummary: jest.fn(() => mockAnswer)
					}
				]
			}
		];
	}
}

const mockResponse = {
	referenceId: mockRef,
	answers: {}
};

let mockJourney;
let mockSummaryListData;

const sampleQuestionObj = {
	fieldName: 'sampleFieldName',
	renderAction: jest.fn(),
	prepQuestionForRendering: jest.fn(),
	formatAnswerForSummary: jest.fn(),
	viewFolder: 'sampleType'
};

const mockSection = {
	name: '123',
	segment: 'test'
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
			getJourney.mockReturnValue(mockJourney);

			await list(req, res);

			expect(res.render).toHaveBeenCalledWith(mockJourney.listingPageViewPath, {
				appeal,
				summaryListData: mockSummaryListData,
				layoutTemplate: mockTemplateUrl,
				pageCaption: `Appeal ${appeal.caseReference}`,
				journeyTitle: mockJourneyTitle
			});
		});
	});

	describe('question', () => {
		it('should redirect if question is not found', async () => {
			getJourney.mockReturnValue(mockJourney);
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(null);

			await question(req, res);

			expect(res.redirect).toHaveBeenCalledWith(mockJourney.baseUrl);
		});

		it('should use custom action if renderAction is defined', async () => {
			getJourney.mockReturnValue(mockJourney);
			mockJourney.getSection = jest.fn();
			mockJourney.getSection.mockReturnValueOnce({});
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);
			sampleQuestionObj.renderAction = jest.fn(async () => {});

			await question(req, res);

			expect(sampleQuestionObj.renderAction).toHaveBeenCalledWith(res, undefined);
		});

		it('should render the question template', async () => {
			req.params.referenceId = mockRef;
			const mockAnswer = 'sampleAnswer';
			const mockBackLink = 'back';
			const mockQuestionRendering = 'test';

			getJourney.mockReturnValue(mockJourney);

			sampleQuestionObj.prepQuestionForRendering.mockReturnValueOnce(mockQuestionRendering);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObj);
			mockJourney.response.answers.sampleFieldName = mockAnswer;
			mockJourney.getNextQuestionUrl = jest.fn();
			mockJourney.getNextQuestionUrl.mockReturnValue(mockBackLink);
			mockJourney.getSection = jest.fn();
			mockJourney.getSection.mockReturnValue(mockSection);

			await question(req, res);

			expect(sampleQuestionObj.renderAction).toHaveBeenCalledWith(res, mockQuestionRendering);
		});
	});

	describe('save', () => {
		it('should use question saveAction', async () => {
			const journeyId = 'has-questionnaire';
			const sampleQuestionObjWithSaveAction = { ...sampleQuestionObj, saveAction: jest.fn() };

			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName
			};

			res.locals.journeyResponse = {
				answers: {}
			};

			req.body = {
				sampleFieldName: true,
				sampleFieldName_sub: 'send this',
				notSampleFieldName: 'do not send this'
			};

			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObjWithSaveAction);

			await save(req, res, journeyId);

			expect(sampleQuestionObjWithSaveAction.saveAction).toHaveBeenCalledWith(
				req,
				res,
				mockJourney,
				mockJourney.sections[0],
				res.locals.journeyResponse
			);
		});

		it('should handle error', async () => {
			const journeyId = 'has-questionnaire';
			const expectedViewModel = { a: 1 };
			const sampleQuestionObjWithActions = {
				...sampleQuestionObj,
				saveAction: jest.fn(),
				prepQuestionForRendering: jest.fn(() => expectedViewModel),
				renderAction: jest.fn()
			};

			const saveActionSpy = jest.spyOn(sampleQuestionObjWithActions, 'saveAction');
			saveActionSpy.mockImplementation(() => {
				throw new Error('Expected error message');
			});

			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName
			};

			res.locals.journeyResponse = {
				answers: {}
			};

			req.body = {
				sampleFieldName: true,
				sampleFieldName_sub: 'send this',
				notSampleFieldName: 'do not send this'
			};

			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObjWithActions);

			await save(req, res, journeyId);

			expect(sampleQuestionObjWithActions.saveAction).toHaveBeenCalledWith(
				req,
				res,
				mockJourney,
				mockJourney.sections[0],
				res.locals.journeyResponse
			);

			expect(sampleQuestionObjWithActions.renderAction).toHaveBeenCalledWith(
				res,
				expectedViewModel
			);
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
