const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getApplicationNumber,
	postApplicationNumber
} = require('../../../../../src/controllers/full-appeal/submit-appeal/application-number');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { APPLICATION_NUMBER, PROPOSED_DEVELOPMENT_CHANGED }
	}
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'applicationNumber';
const applicationNumber = 'ABCDE12345';

describe('controllers/full-appeal/submit-appeal/application-number', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		appeal.planningApplicationDocumentsSection.applicationNumber = applicationNumber;

		jest.resetAllMocks();
	});

	describe('getApplicationNumber', () => {
		it('should call the correct template', () => {
			getApplicationNumber(req, res);
			expect(res.render).toHaveBeenCalledWith(APPLICATION_NUMBER, {
				applicationNumber
			});
		});
	});

	describe('postApplicationNumber', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postApplicationNumber(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(APPLICATION_NUMBER, {
				applicationNumber,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should log an error if the api call fails, and remain on the same page', async () => {
			const error = new Error('API is down');

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			const mockRequest = {
				...req,
				body: {}
			};
			await postApplicationNumber(mockRequest, res);

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(APPLICATION_NUMBER, {
				applicationNumber,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/full-appeal/design-access-statement-submitted` if valid', async () => {
			const fakeApplicationNumber = 'some valid application number';
			const fakeTaskStatus = 'COMPLETED';

			const mockRequest = {
				...req,
				body: {
					'application-number': fakeApplicationNumber
				}
			};

			await postApplicationNumber(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				[sectionName]: {
					...appeal[sectionName],
					[taskName]: fakeApplicationNumber
				},
				sectionStates: {
					...appeal.sectionStates,
					[sectionName]: {
						...appeal.sectionStates[sectionName],
						[taskName]: fakeTaskStatus
					}
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${PROPOSED_DEVELOPMENT_CHANGED}`);
		});
	});
});
