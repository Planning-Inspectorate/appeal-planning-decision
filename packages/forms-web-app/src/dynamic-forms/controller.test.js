const {
	list,
	question,
	save,
	remove,
	submit,
	lpaSubmitted,
	appellantStartAppeal,
	appellantBYSListOfDocuments
} = require('./controller');
const { getUserFromSession } = require('../services/user.service');
const { Journey } = require('./journey');
const { SECTION_STATUS } = require('./section');
const { storePdfQuestionnaireSubmission } = require('../services/pdf.service');
const { getDepartmentFromId } = require('../services/department.service');
const { deleteAppeal } = require('#lib/appeals-api-wrapper');
const { getSaveFunction } = require('../journeys/get-journey-save');

const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { mockReq, mockRes } = require('../../__tests__/unit/mocks');

const res = mockRes();
const mockBaseUrl = '/manage-appeals/questionnaire';
const mockRef = '123456';
const mockTemplateUrl = 'template.njk';
const mockListingPath = 'mockListingPath.njk';
const mockJourneyTitle = 'Mock Manage Appeals';
const mockAnswer = 'Not started';

const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const questionUtils = require('./dynamic-components/utils/question-utils');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const config = require('../../src/config');

const makeSections = () => [
	{
		name: 'Section 1',
		segment: 'segment-1',
		getStatus: () => {
			return SECTION_STATUS.COMPLETE;
		},
		isComplete: () => {
			return true;
		},
		questions: [
			{
				title: 'Title 1a',
				question: 'Why?',
				taskList: true,
				fieldName: 'title-1a',
				shouldDisplay: () => true,
				formatAnswerForSummary: jest.fn()
			},
			{
				title: 'Title 1b',
				question: 'Who?',
				taskList: false,
				fieldName: 'title-1b',
				shouldDisplay: () => true,
				formatAnswerForSummary: () => [
					{
						key: 'Title 1b',
						value: mockAnswer,
						action: {
							href: '/manage-appeals/questionnaire/123456/segment-1/title-1b',
							text: 'Answer',
							visuallyHiddenText: 'Answer'
						}
					}
				]
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
			return true;
		},
		questions: [
			{
				title: 'Title 2a',
				question: 'How?',
				taskList: true,
				fieldName: 'title-2a',
				shouldDisplay: () => true,
				formatAnswerForSummary: () => [
					{
						key: 'Title 2a',
						value: mockAnswer,
						action: {
							href: '/manage-appeals/questionnaire/123456/segment-2/title-2a',
							text: 'Answer',
							visuallyHiddenText: 'Answer'
						}
					}
				]
			},
			{
				title: 'Title 2b',
				question: 'What?',
				taskList: true,
				fieldName: 'title-2b',
				shouldDisplay: () => true,
				formatAnswerForSummary: () => [
					{
						key: 'Title 2b',
						value: mockAnswer,
						action: {
							href: '/manage-appeals/questionnaire/123456/segment-2/title-2b',
							text: 'Answer',
							visuallyHiddenText: 'Answer'
						}
					}
				]
			}
		]
	},
	{
		name: 'Section 3',
		segment: 'segment-3',
		getStatus: () => {
			return SECTION_STATUS.NOT_STARTED;
		},
		isComplete: jest.fn(),
		questions: [
			{
				title: 'Title 3a',
				question: 'When?',
				taskList: false,
				fieldName: 'title-3a',
				shouldDisplay: () => true,
				formatAnswerForSummary: () => [
					{
						key: 'Title 3a',
						value: mockAnswer,
						action: {
							href: '/manage-appeals/questionnaire/123456/segment-3/title-3a',
							text: 'Answer',
							visuallyHiddenText: 'Answer'
						}
					}
				]
			},
			{
				title: 'Title 3b',
				question: 'Really?',
				taskList: true,
				fieldName: 'title-3b',
				shouldDisplay: () => true,
				formatAnswerForSummary: () => [
					{
						key: 'Title 3b',
						value: mockAnswer,
						action: {
							href: '/manage-appeals/questionnaire/123456/segment-3/title-3b',
							text: 'Answer',
							visuallyHiddenText: 'Answer'
						}
					}
				]
			}
		]
	}
];

const journeyParams = {
	makeSections,
	journeyId: 'TEST',
	makeBaseUrl: () => `${mockBaseUrl}/${mockRef}`,
	journeyTemplate: mockTemplateUrl,
	listingPageViewPath: mockListingPath,
	journeyTitle: mockJourneyTitle
};

const mockResponse = {
	referenceId: mockRef,
	answers: {
		'title-1a': 'yes',
		'title-2a': null,
		'title-2b': undefined
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

jest.mock('../services/pdf.service');
jest.mock('../services/department.service');
jest.mock('#lib/appeals-api-wrapper');
jest.mock('../services/user.service');
jest.mock('../journeys/get-journey-save');

describe('dynamic-form/controller', () => {
	let req;
	beforeEach(() => {
		jest.resetAllMocks();
		res.locals.journeyResponse = {};
		mockJourney = new Journey({ response: mockResponse, ...journeyParams });
		const lpaUser = {
			lpaCode: 'E9999'
		};
		res.locals.journey = mockJourney;
		mockJourney.sections[0].questions[0].formatAnswerForSummary.mockReturnValue([
			{
				key: 'Title 1a',
				value: mockAnswer,
				action: {
					href: '/manage-appeals/questionnaire/123456/segment-1/title-1a',
					text: 'Answer',
					visuallyHiddenText: 'Answer'
				}
			}
		]);
		mockJourney.sections[2].isComplete.mockReturnValue(false);

		getUserFromSession.mockReturnValue(lpaUser);
		mockSummaryListData = _getmockSummaryListData(mockJourney);
		req = {
			appealsApiClient: {
				getUsersAppealCase: jest.fn(),
				submitLPAQuestionnaire: jest.fn(),
				patchLPAQuestionnaire: jest.fn(),
				createAppellantSubmission: jest.fn(),
				patchAppealById: jest.fn()
			},
			...mockReq(null)
		};
	});

	describe('list', () => {
		it('should render the view correctly', async () => {
			res.locals.journeyResponse.referenceId = mockRef;
			const appeal = { a: 1, caseReference: 2 };

			req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(appeal));

			const pageCaption = `Appeal ${appeal.caseReference}`;
			await list(req, res, pageCaption, { appeal });

			expect(res.render).toHaveBeenCalledWith(mockJourney.listingPageViewPath, {
				appeal,
				summaryListData: mockSummaryListData,
				layoutTemplate: mockTemplateUrl,
				journeyComplete: false,
				pageCaption: pageCaption,
				journeyTitle: mockJourneyTitle,
				bannerHtmlOverride: ''
			});
		});

		it('should format answer summary including conditional answer', async () => {
			res.locals.journeyResponse.referenceId = mockRef;
			const appeal = { a: 1, caseReference: 2 };

			req.appealsApiClient.getUsersAppealCase.mockImplementation(() => Promise.resolve(appeal));
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
			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(null);

			await question(req, res);

			expect(res.redirect).toHaveBeenCalledWith(mockJourney.taskListUrl);
		});

		it('should use custom action if renderAction is defined', async () => {
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
		let mockSaveFn = jest.fn();
		beforeEach(() => {
			getSaveFunction.mockReturnValue(mockSaveFn);
		});
		afterEach(() => {
			getSaveFunction.mockReset();
		});

		it('should use question saveAction', async () => {
			const journeyId = 'has-questionnaire';
			const sampleQuestionObjWithSaveAction = { ...sampleQuestionObj, saveAction: jest.fn() };

			req.params = {
				referenceId: mockRef,
				section: mockJourney.sections[0].segment,
				question: mockJourney.sections[0].questions[0].fieldName
			};

			res.locals.journeyResponse = {
				journeyId,
				answers: {}
			};

			req.body = {
				sampleFieldName: true,
				sampleFieldName_sub: 'send this',
				notSampleFieldName: 'do not send this'
			};

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObjWithSaveAction);

			await save(req, res);

			expect(sampleQuestionObjWithSaveAction.saveAction).toHaveBeenCalledWith(
				req,
				res,
				mockSaveFn,
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
				journeyId,
				answers: {}
			};

			req.body = {
				sampleFieldName: true,
				sampleFieldName_sub: 'send this',
				notSampleFieldName: 'do not send this'
			};

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleQuestionObjWithActions);

			await save(req, res);

			expect(sampleQuestionObjWithActions.saveAction).toHaveBeenCalledWith(
				req,
				res,
				mockSaveFn,
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
			subQuestionProps: {
				type: 'case',
				title: TITLE,
				fieldName: FIELDNAME,
				question: QUESTION_STRING,
				viewFolder: 'view'
			}
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

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleListAddMoreObj);
			mockJourney.getCurrentQuestionUrl = jest.fn();
			mockJourney.getCurrentQuestionUrl.mockReturnValueOnce('test');

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

			mockJourney.getQuestionBySectionAndName = jest.fn();
			mockJourney.getQuestionBySectionAndName.mockReturnValueOnce(sampleListAddMoreObj);

			await remove(req, res);

			expect(sampleListAddMoreObj.removeAction).toHaveBeenCalled();
			expect(sampleListAddMoreObj.renderAction).toHaveBeenCalledWith(res, expectedViewModel);
		});
	});

	describe('submit', () => {
		it('should submit for has if all sections are complete', async () => {
			storePdfQuestionnaireSubmission.mockReturnValue({ submissionId: '1234', id: '5678' });
			mockJourney.sections[2].isComplete.mockReturnValue(true);

			req.headers.cookie = "sid='abc123'";

			req.params = {
				referenceId: mockRef
			};

			res.locals.journeyResponse = {
				referenceId: '987654',
				journeyId: 'has-questionnaire',
				answers: {}
			};

			await submit(req, res);
			expect(storePdfQuestionnaireSubmission).toHaveBeenCalledWith({
				submissionJourney: res.locals.journey,
				cookieString: req.headers.cookie,
				appealTypeUrl: 'householder'
			});
			expect(req.appealsApiClient.patchLPAQuestionnaire).toHaveBeenCalledWith('987654', {
				submissionPdfId: '5678'
			});
			expect(res.redirect).toHaveBeenCalledWith(
				expect.stringMatching(/^\/manage-appeals\/.+\/questionnaire-submitted\/$/)
			);
		});

		it('should submit for s78 if all sections are complete', async () => {
			storePdfQuestionnaireSubmission.mockReturnValue({ submissionId: '1235', id: '5671' });
			mockJourney.sections[2].isComplete.mockReturnValue(true);

			req.headers.cookie = "sid='abc123'";

			req.params = {
				referenceId: mockRef
			};

			res.locals.journeyResponse = {
				referenceId: '987659',
				journeyId: 's78-questionnaire',
				answers: {}
			};

			await submit(req, res);
			expect(storePdfQuestionnaireSubmission).toHaveBeenCalledWith({
				submissionJourney: res.locals.journey,
				cookieString: req.headers.cookie,
				appealTypeUrl: 'full-planning'
			});
			expect(req.appealsApiClient.patchLPAQuestionnaire).toHaveBeenCalledWith('987659', {
				submissionPdfId: '5671'
			});
			expect(res.redirect).toHaveBeenCalledWith(
				expect.stringMatching(/^\/manage-appeals\/.+\/questionnaire-submitted\/$/)
			);
		});
	});

	describe('lpaSubmitted', () => {
		it('should 404 if journey is not complete', async () => {
			const nestedMock = { render: jest.fn() };
			res.status.mockReturnValue(nestedMock);
			await lpaSubmitted(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(nestedMock.render).toHaveBeenCalledWith('./error/not-found.njk');
		});

		it('should pass through correct pdf link', async () => {
			res.locals.journey.isComplete = jest.fn();
			res.locals.journey.isComplete.mockReturnValue(true);
			req.originalUrl = 'https://test/manage-appeals/householder/100/questionnaire-submitted';
			await lpaSubmitted(req, res);
			expect(res.render).toHaveBeenCalledWith('./dynamic-components/submission-screen/lpa', {
				zipDownloadUrl:
					'https://test/manage-appeals/householder/100/download/submission/documents/lpa-questionnaire'
			});

			req.originalUrl = 'https://test/manage-appeals/householder/100/questionnaire-submitted/';
			await lpaSubmitted(req, res);
			expect(res.render).toHaveBeenCalledWith('./dynamic-components/submission-screen/lpa', {
				zipDownloadUrl:
					'https://test/manage-appeals/householder/100/download/submission/documents/lpa-questionnaire'
			});

			req.originalUrl =
				'https://test/manage-appeals/householder/100/questionnaire-submitted?test=1';
			await lpaSubmitted(req, res);
			expect(res.render).toHaveBeenCalledWith('./dynamic-components/submission-screen/lpa', {
				zipDownloadUrl:
					'https://test/manage-appeals/householder/100/download/submission/documents/lpa-questionnaire'
			});

			req.originalUrl =
				'https://test/manage-appeals/householder/100/questionnaire-submitted#in-page-link';
			await lpaSubmitted(req, res);
			expect(res.render).toHaveBeenCalledWith('./dynamic-components/submission-screen/lpa', {
				zipDownloadUrl:
					'https://test/manage-appeals/householder/100/download/submission/documents/lpa-questionnaire'
			});
		});
	});

	describe('appellantStartAppeal', () => {
		const appeal = {
			id: '123',
			appealType: CASE_TYPES.HAS.id.toString(),
			lpaCode: 'some-lpa-code',
			appealSqlId: 'some-appeal-sql-id',
			decisionDate: '2023-01-01',
			planningApplicationNumber: 'some-application-number',
			eligibility: {
				applicationDecision: 'some-decision'
			}
		};
		const lpa = { lpaCode: 'some-lpa-code', id: 'some-id' };

		it('should generate appellant submission and redirect', async () => {
			getDepartmentFromId.mockResolvedValue(lpa);
			req.appealsApiClient.createAppellantSubmission.mockResolvedValue({
				id: 'some-submission-id'
			});
			req.session.appeal = appeal;

			await appellantStartAppeal(req, res);

			expect(getDepartmentFromId).toHaveBeenCalledWith(appeal.lpaCode);
			expect(req.appealsApiClient.createAppellantSubmission).toHaveBeenCalledWith({
				appealId: appeal.appealSqlId,
				LPACode: lpa.lpaCode,
				appealTypeCode: CASE_TYPES.HAS.processCode,
				applicationDecisionDate: appeal.decisionDate,
				applicationReference: appeal.planningApplicationNumber,
				applicationDecision: appeal.eligibility.applicationDecision
			});
			expect(deleteAppeal).toHaveBeenCalledWith(appeal.id);
			expect(req.session.appeal).toBeNull();
			expect(req.appealsApiClient.patchAppealById).toHaveBeenCalledWith(appeal.appealSqlId, {
				legacyAppealSubmissionId: null,
				legacyAppealSubmissionDecisionDate: null,
				legacyAppealSubmissionState: null
			});
			expect(res.redirect).toHaveBeenCalledWith(
				'/appeals/householder/appeal-form/your-appeal?id=some-submission-id'
			);
		});
	});

	describe('appellantBYSListOfDocuments', () => {
		it('renders correct page for Householder', () => {
			req.session.appeal = { appealType: APPEAL_ID.HOUSEHOLDER };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('appeal-householder-decision/list-of-documents', {
				usingV2Form: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''))
			});
		});
		it('renders correct page for S78 - full appeal', () => {
			req.session.appeal = { appealType: APPEAL_ID.PLANNING_SECTION_78 };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('full-appeal/submit-appeal/list-of-documents', {
				usingV2Form: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''))
			});
		});
		it('renders correct page for S20 - listed building', () => {
			req.session.appeal = { appealType: APPEAL_ID.PLANNING_LISTED_BUILDING };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('full-appeal/submit-appeal/list-of-documents', {
				usingV2Form: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''))
			});
		});
		it('renders correct page for CAS Planning', () => {
			req.session.appeal = { appealType: APPEAL_ID.MINOR_COMMERCIAL };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('full-appeal/submit-appeal/list-of-documents', {
				usingV2Form: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''))
			});
		});
		it('renders correct page for Adverts', () => {
			req.session.appeal = { appealType: APPEAL_ID.ADVERTISEMENT };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('full-appeal/submit-appeal/list-of-documents', {
				usingV2Form: true,
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''))
			});
		});
		it('renders error page if appeal type not found', () => {
			req.session.appeal = { appealType: '123456' };
			appellantBYSListOfDocuments(req, res);
			expect(res.render).toHaveBeenCalledWith('./error/not-found.njk');
		});
	});

	describe('startJourneyFromBeginning', () => {
		it('always redirects to the first question', async () => {
			req.session = {
				navigationHistory: ['/previous-page']
			};

			const mockFirstQuestionUrl = '/some/path/to/first-question';
			mockJourney.getFirstQuestionUrl = jest.fn(() => mockFirstQuestionUrl);

			res.locals.journey = mockJourney;

			const { startJourneyFromBeginning } = require('./controller');
			await startJourneyFromBeginning(req, res);

			expect(mockJourney.getFirstQuestionUrl).toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(mockFirstQuestionUrl);
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
