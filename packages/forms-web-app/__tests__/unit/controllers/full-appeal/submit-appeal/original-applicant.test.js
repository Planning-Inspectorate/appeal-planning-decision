const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getOriginalApplicant,
	FORM_FIELD,
	postOriginalApplicant
} = require('../../../../../src/controllers/full-appeal/submit-appeal/original-applicant');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { ORIGINAL_APPLICANT, CONTACT_DETAILS, APPLICANT_NAME }
	}
} = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'contactDetailsSection';
const taskName = 'isOriginalApplicant';

describe('controllers/full-appeal/submit-appeal/original-applicant', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getOriginalApplicant', () => {
		it('should call the correct template', () => {
			getOriginalApplicant(req, res);

			expect(res.render).toHaveBeenCalledWith(ORIGINAL_APPLICANT, {
				FORM_FIELD,
				appeal: req.session.appeal
			});
		});
	});

	describe('postOriginalApplicant', () => {
		it('should redirect with original-appellant set to true', async () => {
			const fakeTaskStatus = 'COMPLETED';

			const mockRequest = {
				...mockReq(appeal),
				body: {
					'original-application-your-name': 'yes',
					errors: {},
					errorSummary: {}
				}
			};

			await postOriginalApplicant(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				[sectionName]: {
					...appeal[sectionName],
					[taskName]: true
				},
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(res.render).not.toHaveBeenCalled();

			expect(res.redirect).toHaveBeenCalledWith(`/${CONTACT_DETAILS}`);
		});

		it('should redirect with original-appellant set to false', async () => {
			const mockRequest = {
				...mockReq(appeal),
				body: {
					'original-application-your-name': 'no',
					errors: {},
					errorSummary: {}
				}
			};

			await postOriginalApplicant(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith(`/${APPLICANT_NAME}`);
		});

		it('should re-render the template with errors if there is any validator error', async () => {
			const mockRequest = {
				...mockReq(appeal),
				body: {
					'original-application-your-name': true,
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postOriginalApplicant(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(ORIGINAL_APPLICANT, {
				FORM_FIELD,
				appeal,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const fakeTaskStatus = 'COMPLETED';

			const mockRequest = {
				...mockReq(appeal),
				body: {
					'original-application-your-name': 'no'
				}
			};

			const error = new Error('Internal Server Error');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postOriginalApplicant(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				[sectionName]: {
					...appeal[sectionName],
					[taskName]: false
				},
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(res.render).toHaveBeenCalledWith(ORIGINAL_APPLICANT, {
				FORM_FIELD,
				appeal: mockRequest.session.appeal,
				errorSummary: [{ text: error.toString(), href: '#' }],
				errors: {}
			});
		});
	});
});
