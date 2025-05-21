const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postPlanningApplicationNumber,
	getPlanningApplicationNumber
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-application-number');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS }
	}
} = require('../../../../../src/lib/views');
const config = require('../../../../../src/config');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const applicationNumber = 'ABCDE12345';

describe('controllers/full-appeal/submit-appeal/planning-application-number', () => {
	let req;
	let res;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'));

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		appeal.planningApplicationNumber = applicationNumber;

		jest.resetAllMocks();
	});

	describe('getPlanningApplicationNumber', () => {
		it('should call the correct template', () => {
			const controllerFunction = getPlanningApplicationNumber();
			controllerFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				bannerHtmlOverride
			});
		});

		it('should allow custom views to be passed in', () => {
			const controllerFunction = getPlanningApplicationNumber({
				PLANNING_APPLICATION_NUMBER: 'test1/url',
				EMAIL_ADDRESS: 'test2/url'
			});
			controllerFunction(req, res);
			expect(res.render).toHaveBeenCalledWith('test1/url', {
				planningApplicationNumber: applicationNumber,
				bannerHtmlOverride
			});
		});
	});

	describe('postPlanningApplicationNumber', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			const controllerFunction = postPlanningApplicationNumber();
			await controllerFunction(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				bannerHtmlOverride
			});
		});

		it('should log an error if the api call fails, and remain on the same page', async () => {
			const error = new Error('API is down');

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			const mockRequest = {
				...req,
				body: { 'application-number': '123456' }
			};
			const controllerFunction = postPlanningApplicationNumber();
			await controllerFunction(mockRequest, res);

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/full-appeal/email-address` if valid', async () => {
			const fakeApplicationNumber = 'some valid application number';

			const mockRequest = {
				...req,
				body: {
					'application-number': fakeApplicationNumber
				}
			};

			const controllerFunction = postPlanningApplicationNumber();
			await controllerFunction(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				planningApplicationNumber: fakeApplicationNumber
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${EMAIL_ADDRESS}`);
		});

		it('should allow custom views to be passed in - testing valid redirect', async () => {
			const fakeApplicationNumber = 'some valid application number';

			const mockRequest = {
				...req,
				body: {
					'application-number': fakeApplicationNumber
				}
			};

			const controllerFunction = postPlanningApplicationNumber({
				PLANNING_APPLICATION_NUMBER: 'test1/url',
				EMAIL_ADDRESS: 'test2/url'
			});
			await controllerFunction(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				planningApplicationNumber: fakeApplicationNumber
			});

			expect(res.redirect).toHaveBeenCalledWith('/test2/url');
		});

		it('should allow custom views to be passed in - testing failure re-render', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			const controllerFunction = postPlanningApplicationNumber({
				PLANNING_APPLICATION_NUMBER: 'test1/url',
				EMAIL_ADDRESS: 'test2/url'
			});
			await controllerFunction(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith('test1/url', {
				planningApplicationNumber: applicationNumber,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				bannerHtmlOverride
			});
		});
	});
});
