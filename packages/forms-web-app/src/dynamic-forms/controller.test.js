const { list, question, save, remove, submit } = require('./controller');
const { getUserFromSession } = require('../services/user.service');
const { Journey } = require('./journey');
const { SECTION_STATUS } = require('./section');
const { getJourney } = require('./journey-factory');
const { format } = require('date-fns');
const { businessRulesDeadline } = require('../lib/calculate-deadline');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const res = mockRes();
const mockBaseUrl = '/manage-appeals/questionnaire';
const mockRef = '123456';
const mockTemplateUrl = 'template.njk';
const mockListingPath = 'mockListingPath.njk';
const mockJourneyTitle = 'Mock Manage Appeals';
const mockAnswer = 'Not started';

const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const AddMoreQuestion = require('./dynamic-components/add-more/question');
const questionUtils = require('./dynamic-components/utils/question-utils');

class TestJourney extends Journey {
	constructor(response, isComplete) {
		super({
			baseUrl: `${mockBaseUrl}/${mockRef}`,
			response: response,
			journeyTemplate: mockTemplateUrl,
			listingPageViewPath: mockListingPath,
			journeyTitle: mockJourneyTitle
		});

		this.sections = [
			{
				name: 'Section 1',
				segment: 'segment-1',
				getStatus: () => {
					return SECTION_STATUS.COMPLETE;
				},
				isComplete: () => {
					return isComplete;
				},
				questions: [
					{
						title: 'Title 1a',
						question: 'Why?',
						taskList: true,
						fieldName: 'title-1a',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 1a',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-1/title-1a',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					},
					{
						title: 'Title 1b',
						question: 'Who?',
						taskList: false,
						fieldName: 'title-1b',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 1b',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-1/title-1b',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					}
				]
			},
			{
				name: 'Section 2',
				segment: 'segment-2',
				getStatus: () => {
					return SECTION_STATUS.IN_PROGRESS;
				},
				isComplete: () => {
					return isComplete;
				},
				questions: [
					{
						title: 'Title 2a',
						question: 'How?',
						taskList: true,
						fieldName: 'title-2a',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 2a',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-2/title-2a',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					},
					{
						title: 'Title 2b',
						question: 'What?',
						taskList: true,
						fieldName: 'title-2b',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 2b',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-2/title-2b',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					}
				]
			},
			{
				name: 'Section 3',
				segment: 'segment-3',
				getStatus: () => {
					return SECTION_STATUS.NOT_STARTED;
				},
				isComplete: () => {
					return isComplete;
				},
				questions: [
					{
						title: 'Title 3a',
						question: 'When?',
						taskList: false,
						fieldName: 'title-3a',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 3a',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-3/title-3a',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					},
					{
						title: 'Title 3b',
						question: 'Really?',
						taskList: true,
						fieldName: 'title-3b',
						formatAnswerForSummary: jest.fn(() => [
							{
								key: 'Title 3b',
								value: mockAnswer,
								action: {
									href: '/manage-appeals/questionnaire/123456/segment-3/title-3b',
									text: 'Answer',
									visuallyHiddenText: 'Answer'
								}
							}
						])
					}
				]
			}
		];
	}
}

const mockResponse = {
	referenceId: mockRef,
	answers: {
		'title-1a': 'yes',
		'title-2a': null,
		'title-2b': undefined,
		applicationDecisionDate: new Date().toISOString()
	}
};

let mockJourney;
let mockSummaryListData;

const sampleQuestionObj = {
	fieldName: 'sampleFieldName',
	renderAction: jest.fn(),
	prepQuestionForRendering: jest.fn(),
	formatAnswerForSummary: jest.fn(() => [mockAnswer]),
	viewFolder: 'sampleType'
};

const mockSection = {
	name: '123',
	segment: 'test'
};

jest.mock('../services/user.service');
jest.mock('./journey-factory');

describe('dynamic-form/controller', () => {
	let req;
	beforeEach(() => {
		jest.resetAllMocks();
		res.locals.journeyResponse = {};
		mockJourney = new TestJourney(mockResponse);
		const lpaUser = {
			lpaCode: 'E9999'
		};
		getUserFromSession.mockReturnValue(lpaUser);
		mockSummaryListData = _getmockSummaryListData(mockJourney);
		req = {
			appealsApiClient: {
				getUsersAppealCase: jest.fn(),
				submitLPAQuestionnaire: jest.fn()
			},
			...mockReq(null)
		};
	});

	describe('list', () => {
		it('should render the view correctly', async () => {
			res.locals.journeyResponse.referenceId = mockRef;
			const appeal = { a: 1, caseReference: 2 };

			req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(appeal));
			getJourney.mockReturnValue(mockJourney);

			const appealType = '1001';
			const deadline = businessRulesDeadline(
				mockJourney.response.answers.applicationDecisionDate,
				appealType,
				null,
				true
			);

			const pageCaption = `Appeal ${appeal.caseReference}`;
			await list(req, res, pageCaption, { appeal });

			const expectedUrl = `/appeals/householder/submit/declaration?id=${mockRef}`;

			expect(res.render).toHaveBeenCalledWith(mockJourney.listingPageViewPath, {
				appeal,
				summaryListData: mockSummaryListData,
				layoutTemplate: mockTemplateUrl,
				journeyComplete: false,
				pageCaption: pageCaption,
				journeyTitle: mockJourneyTitle,
				declarationUrl: expectedUrl,
				formattedDeadline: format(deadline, 'dd MMM yyyy')
			});
		});

		it('should format answer summary including conditional answer', async () => {
			res.locals.journeyResponse.referenceId = mockRef;
			const appeal = { a: 1, caseReference: 2 };

			req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(appeal));
			getJourney.mockReturnValue(mockJourney);
			jest.spyOn(questionUtils, 'getConditionalAnswer').mockReturnValueOnce('test');

			await list(req, res);

			const expectedAnswer = {
				value: 'yes',
				conditional: 'test'
			};
			expect(mockJourney.sections[0].questions[0].formatAnswerForSummary).toHaveBeenCalledWith(
				mockJourney.sections[0].segment,
				mockJourney,
				expectedAnswer
			);
		});
	});

	describe('question', () => {
		it('should redirect if question is not found', async () => {
			getJourney.mockReturnValue(mockJourney);
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(null);

			await question(req, res);

			expect(res.redirect).toHaveBeenCalledWith(mockJourney.taskListUrl);
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

	describe('remove', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const FIELDNAME = 'favouriteColour';

		const sampleListAddMoreObj = new ListAddMoreQuestion({
			title: TITLE,
			fieldName: FIELDNAME,
			question: QUESTION_STRING,
			subQuestion: new AddMoreQuestion({
				title: TITLE,
				fieldName: FIELDNAME,
				question: QUESTION_STRING,
				viewFolder: 'view'
			})
		});

		sampleListAddMoreObj.removeAction = jest.fn();
		sampleListAddMoreObj.saveAction = jest.fn();
		sampleListAddMoreObj.renderAction = jest.fn();

		it('should error if not list-add-more question', async () => {
			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName,
				answerId: 'answer-id'
			};

			res.locals.journeyResponse = {
				answers: {}
			};

			const expectedViewModel = { a: 1 };

			const sampleQuestionObjWithActions = {
				...sampleQuestionObj,
				removeAction: jest.fn(),
				prepQuestionForRendering: jest.fn(() => expectedViewModel),
				renderAction: jest.fn()
			};

			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObjWithActions);

			await remove(req, res);

			expect(sampleQuestionObjWithActions.removeAction).not.toHaveBeenCalled();
			expect(sampleQuestionObjWithActions.renderAction).toHaveBeenCalledWith(
				res,
				expectedViewModel
			);
		});

		it('should use removeAction if a list-add-more question type', async () => {
			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName,
				answerId: 'answer-id'
			};

			res.locals.journeyResponse = {
				answers: {}
			};

			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleListAddMoreObj);

			await remove(req, res);

			expect(sampleListAddMoreObj.removeAction).toHaveBeenCalledWith(
				req,
				res.locals.journeyResponse,
				req.params.answerId
			);

			expect(res.redirect).toHaveBeenCalled();
		});

		it('should handle error from removeAction', async () => {
			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName,
				answerId: 'answer-id'
			};

			res.locals.journeyResponse = {
				answers: {}
			};

			const expectedViewModel = { a: 1 };
			sampleListAddMoreObj.prepQuestionForRendering = jest.fn(() => expectedViewModel);
			sampleListAddMoreObj.removeAction = jest
				.fn()
				.mockImplementation(() => Promise.reject(new Error('Network error')));

			getJourney.mockReturnValue(mockJourney);

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleListAddMoreObj);

			await remove(req, res);

			expect(sampleListAddMoreObj.removeAction).toHaveBeenCalled();
			expect(sampleListAddMoreObj.renderAction).toHaveBeenCalledWith(res, expectedViewModel);
		});
	});
	describe('submit', () => {
		it('should submit if all sections are complete', async () => {
			req.params = {
				referenceId: mockRef
			};

			res.locals.journeyResponse = {
				answers: {}
			};
			const mockCompletedJourney = new TestJourney(mockResponse, true);

			getJourney.mockReturnValue(mockCompletedJourney);

			await submit(req, res);
			expect(res.redirect).toHaveBeenCalledWith(
				expect.stringMatching(/^\/manage-appeals\/.+\/questionnaire-submitted\/$/)
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
										visuallyHiddenText: 'Answer'
									}
								]
							},
							key: { text: mockJourney.sections[0].questions[0].title },
							value: { html: 'Not started' }
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
										visuallyHiddenText: 'Answer'
									}
								]
							},
							key: { text: mockJourney.sections[1].questions[0].title },
							value: { html: 'Not started' }
						},
						{
							actions: {
								items: [
									{
										href: `${mockBaseUrl}/${mockRef}/${mockJourney.sections[1].segment}/${mockJourney.sections[1].questions[1].fieldName}`,
										text: 'Answer',
										visuallyHiddenText: 'Answer'
									}
								]
							},
							key: { text: mockJourney.sections[1].questions[1].title },
							value: { html: 'Not started' }
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
										visuallyHiddenText: 'Answer'
									}
								]
							},
							key: { text: mockJourney.sections[2].questions[1].title },
							value: { html: 'Not started' }
						}
					]
				}
			}
		]
	};
};
