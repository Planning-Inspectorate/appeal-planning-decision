const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postEnforcementIssueDate,
	getEnforcementIssueDate
} = require('../../../../src/controllers/before-you-start/enforcement-issue-date');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_ISSUE_DATE }
	}
} = require('../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const navigationPages = {
	effectivePage: '/before-you-start/enforcement-effective-date',
	shutterPage: '/before-you-start/use-existing-service-application-type'
};
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/before-you-start/enforcement-issue-date', () => {
	let req;
	let res;

	const appeal = {
		...fullAppeal,
		appealType: '1000'
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getEnforcementIssueDate', () => {
		it('should call the correct template', () => {
			getEnforcementIssueDate(req, res);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_ISSUE_DATE, {
				enforcementIssueDate: null,
				hint: { enforcementIssueDate: expect.any(String) }
			});
		});
	});

	describe('postEnforcementIssueDate', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-issue-date': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};

			isLpaInFeatureFlag.mockReturnValue(true);

			await postEnforcementIssueDate(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_ISSUE_DATE, {
				enforcementIssueDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				hint: {
					enforcementIssueDate: expect.any(String)
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				focusErrorSummary: true
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-issue-date-day': 12,
					'enforcement-issue-date-month': 12,
					'enforcement-issue-date-year': 2024
				}
			};

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postEnforcementIssueDate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Invalid time value' })
			);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_ISSUE_DATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/enforcement-effective-date` if the issue date is valid', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-issue-date-day': 12,
					'enforcement-issue-date-month': 12,
					'enforcement-issue-date-year': 2024,
					'enforcement-issue-date': '2024-12-12'
				}
			};
			isLpaInFeatureFlag.mockReturnValue(false);

			await postEnforcementIssueDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementIssueDate: expect.any(String)
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.effectivePage);
		});
	});
});
