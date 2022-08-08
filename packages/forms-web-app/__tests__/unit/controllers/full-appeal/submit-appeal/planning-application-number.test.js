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
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const applicationNumber = 'ABCDE12345';
const backLink = '/before-you-start/can-use-service';

describe('controllers/full-appeal/submit-appeal/planning-application-number', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		appeal.planningApplicationNumber = applicationNumber;

		jest.resetAllMocks();
	});

	describe('getPlanningApplicationNumber', () => {
		it('should call the correct template', () => {
			getPlanningApplicationNumber(req, res);
			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				backLink
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
			await postPlanningApplicationNumber(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				backLink,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should log an error if the api call fails, and remain on the same page', async () => {
			const error = new Error('API is down');

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			const mockRequest = {
				...req,
				body: { 'application-number': '123456' }
			};
			await postPlanningApplicationNumber(mockRequest, res);

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(PLANNING_APPLICATION_NUMBER, {
				planningApplicationNumber: applicationNumber,
				backLink,
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

			await postPlanningApplicationNumber(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				planningApplicationNumber: fakeApplicationNumber
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${EMAIL_ADDRESS}`);
		});
	});
});
