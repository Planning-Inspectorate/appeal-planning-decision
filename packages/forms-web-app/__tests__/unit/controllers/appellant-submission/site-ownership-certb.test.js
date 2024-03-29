const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getSiteOwnershipCertB,
	postSiteOwnershipCertB
} = require('../../../../src/controllers/appellant-submission/site-ownership-certb');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { SITE_OWNERSHIP_CERTB }
	}
} = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

describe('controllers/appellant-submission/site-ownership-certb', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getSiteOwnershipCertB', () => {
		it('should call the correct template', () => {
			getSiteOwnershipCertB(req, res);

			expect(res.render).toHaveBeenCalledWith(SITE_OWNERSHIP_CERTB, {
				appeal: req.session.appeal
			});
		});
	});

	describe('postSiteOwnershipCertB', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'have-other-owners-been-told': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postSiteOwnershipCertB(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(SITE_OWNERSHIP_CERTB, {
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

			await postSiteOwnershipCertB(mockRequest, res);

			expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(SITE_OWNERSHIP_CERTB, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to the next valid url if valid', async () => {
			const fakeNextUrl = `/next/valid/url`;
			const fakeTaskStatus = 'FAKE_STATUS';

			getTaskStatus.mockImplementation(() => fakeTaskStatus);

			getNextTask.mockReturnValue({
				href: fakeNextUrl
			});

			const mockRequest = {
				...req,
				body: {
					'have-other-owners-been-told': 'no'
				}
			};

			await postSiteOwnershipCertB(mockRequest, res);

			expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(logger.error).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
		});
	});
});
