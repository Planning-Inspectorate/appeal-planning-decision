const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getSiteAccessSafety,
	postSiteAccessSafety
} = require('../../../../src/controllers/appellant-submission/site-access-safety');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { SITE_ACCESS_SAFETY, TASK_LIST }
	}
} = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');

const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

describe('controllers/appellant-submission/site-access-safety', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getSiteAccessSafety', () => {
		it('should call the correct template', () => {
			getSiteAccessSafety(req, res);

			expect(res.render).toHaveBeenCalledWith(SITE_ACCESS_SAFETY, {
				appeal: req.session.appeal
			});
		});
	});

	describe('postSiteAccessSafety', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'site-access-safety': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postSiteAccessSafety(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(SITE_ACCESS_SAFETY, {
				appeal: req.session.appeal,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			const error = new Error('Cheers');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postSiteAccessSafety(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(error);
			expect(res.render).toHaveBeenCalledWith(SITE_ACCESS_SAFETY, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('issues with concern - should redirect to the task list', async () => {
			const fakeTaskStatus = 'FAKE_STATUS';
			getTaskStatus.mockImplementation(() => fakeTaskStatus);

			getNextTask.mockReturnValue({
				href: `/${TASK_LIST}`
			});
			const mockRequest = {
				...req,
				body: {
					'site-access-safety': 'yes',
					'site-access-safety-concerns': 'some concerns noted here'
				}
			};
			await postSiteAccessSafety(mockRequest, res);

			expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				[sectionName]: {
					...appeal[sectionName],
					[taskName]: {
						hasIssues: true,
						healthAndSafetyIssues: 'some concerns noted here'
					}
				},
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
		});

		[
			{
				description: 'basic expected payload',
				body: {
					'site-access-safety': 'no',
					'site-access-safety-concerns': ''
				}
			},
			{
				description:
					'acceptable submission, though safety concerns will be ignored when creating or updating the appeal',
				body: {
					'site-access-safety': 'no',
					'site-access-safety-concerns': 'some concerns noted here'
				}
			}
		].forEach(({ description, body }) => {
			it(`no issues with concerns - should redirect to the task list - ${description}`, async () => {
				const fakeTaskStatus = 'ANOTHER_FAKE_STATUS';
				getTaskStatus.mockImplementation(() => fakeTaskStatus);

				getNextTask.mockReturnValue({
					href: `/${TASK_LIST}`
				});
				const mockRequest = {
					...mockReq(appeal),
					body
				};
				await postSiteAccessSafety(mockRequest, res);

				expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...appeal,
					[sectionName]: {
						...appeal[sectionName],
						[taskName]: {
							hasIssues: false,
							healthAndSafetyIssues: ''
						}
					},
					sectionStates: {
						...appeal.sectionStates,
						[sectionName]: {
							...appeal.sectionStates[sectionName],
							[taskName]: fakeTaskStatus
						}
					}
				});

				expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
			});
		});
	});
});
