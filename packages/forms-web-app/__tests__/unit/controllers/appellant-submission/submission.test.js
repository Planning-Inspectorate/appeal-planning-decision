const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getSubmission,
	postSubmission
} = require('../../../../src/controllers/appellant-submission/submission');
const { submitAppealForBackOfficeProcessing } = require('../../../../src/lib/appeals-api-wrapper');
const { storePdfAppeal } = require('../../../../src/services/pdf.service');
const { mockReq, mockRes } = require('../../mocks');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { SUBMISSION, CONFIRMATION },
		ELIGIBILITY: { DECISION_DATE_PASSED }
	}
} = require('../../../../src/lib/views');
jest.mock('../../../../src/services/pdf.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/appellant-submission/submission', () => {
	let req;
	let res;

	const appealPdf = {
		id: 'id',
		name: 'appeal.pdf',
		location: 'here',
		size: '123'
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		appeal.yourAppealSection.otherDocuments.uploadedFiles = [];

		jest.resetAllMocks();
	});

	describe('getSubmission', () => {
		it('should call the correct template', () => {
			getSubmission(req, res);

			expect(res.render).toHaveBeenCalledWith(SUBMISSION);
		});
	});

	describe('postSubmission', () => {
		it('should re-render the template with errors if submission validation fails', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postSubmission(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(SUBMISSION, {
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any appeals api call error', async () => {
			const mockRequest = {
				...req,
				body: {
					'appellant-confirmation': 'i-agree'
				},
				cookies: {
					['connect.sid']: 'test'
				}
			};

			mockRequest.session.appeal.decisionDate = new Date().toISOString();

			storePdfAppeal.mockResolvedValue(appealPdf);

			const error = new Error('Cheers');
			submitAppealForBackOfficeProcessing.mockImplementation(() => Promise.reject(error));

			await postSubmission(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(storePdfAppeal).toHaveBeenCalledWith({ appeal, sid: 'test' });

			expect(submitAppealForBackOfficeProcessing).toHaveBeenCalledWith({
				...appeal,
				appealSubmission: {
					appealPDFStatement: {
						uploadedFile: {
							...appealPdf,
							fileName: appealPdf.name,
							originalFileName: appealPdf.name
						}
					}
				}
			});

			expect(res.render).toHaveBeenCalledWith(SUBMISSION, {
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should re-render the template with errors if there is any pdf api call error', async () => {
			const mockRequest = {
				...req,
				body: {
					'appellant-confirmation': 'i-agree'
				},
				cookies: {
					['connect.sid']: 'test'
				}
			};

			mockRequest.session.appeal.decisionDate = new Date().toISOString();

			const error = new Error('Cheers');
			storePdfAppeal.mockImplementation(() => Promise.reject(error));

			await postSubmission(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(submitAppealForBackOfficeProcessing).not.toHaveBeenCalled();

			expect(storePdfAppeal).toHaveBeenCalledWith({ appeal, sid: 'test' });

			expect(res.render).toHaveBeenCalledWith(SUBMISSION, {
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect back to /submission if validation passes but `i-agree` not given', async () => {
			const mockRequest = {
				...req,
				body: {
					'appellant-confirmation': 'anything here - not valid'
				}
			};
			await postSubmission(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${SUBMISSION}`);
		});

		it('should redirect back to /eligibility/decision-date-passed if validation passes but deadline date has passed', async () => {
			const mockRequest = {
				...req,
				body: {
					'appellant-confirmation': 'i-agree'
				},
				session: {
					appeal: {
						decisionDate: '2010-08-06T12:00:00.000Z'
					}
				}
			};
			await postSubmission(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_DATE_PASSED}`);
		});

		it('should redirect if valid', async () => {
			storePdfAppeal.mockResolvedValue(appealPdf);

			const decisionDate = new Date();
			const mockRequest = {
				...req,
				body: {
					'appellant-confirmation': 'i-agree'
				}
			};

			req.session.appeal.decisionDate = decisionDate;

			await postSubmission(mockRequest, res);

			expect(submitAppealForBackOfficeProcessing).toHaveBeenCalledWith({
				...appeal,
				decisionDate,
				appealSubmission: {
					appealPDFStatement: {
						uploadedFile: {
							...appealPdf,
							fileName: appealPdf.name,
							originalFileName: appealPdf.name
						}
					}
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${CONFIRMATION}`);
		});
	});
});
