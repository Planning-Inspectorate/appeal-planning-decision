const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getDeclaration,
	postDeclaration
} = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration');
const {
	submitAppealForBackOfficeProcessing
} = require('../../../../../src/lib/appeals-api-wrapper');
const { storePdfAppeal } = require('../../../../../src/services/pdf.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
	VIEW: {
		FULL_APPEAL: { DECLARATION, APPEAL_SUBMITTED }
	}
} = require('../../../../../src/lib/views');

jest.mock('../../../../../src/services/pdf.service');
jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/declaration', () => {
	let req;
	let res;

	const appealPdf = {
		id: 'id',
		name: 'appeal.pdf',
		location: 'here',
		size: '123'
	};
	const fileName = `planning-appeal-for-planning-application-${appeal.planningApplicationNumber.replace(
		/\//g,
		'-'
	)}`;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getDeclaration', () => {
		it('should call the correct template', () => {
			getDeclaration(req, res);

			expect(res.render).toHaveBeenCalledWith(DECLARATION);
		});
	});

	describe('postDeclaration', () => {
		it('should re-render the template with errors if there is any appeals api call error', async () => {
			const mockRequest = {
				...req,
				body: {},
				headers: {
					cookie: "connect.sid='test'"
				}
			};

			mockRequest.session.appeal.decisionDate = new Date().toISOString();

			storePdfAppeal.mockResolvedValue(appealPdf);

			const error = new Error('Cheers');
			submitAppealForBackOfficeProcessing.mockImplementation(() => Promise.reject(error));

			await postDeclaration(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(storePdfAppeal).toHaveBeenCalledWith({
				appeal,
				fileName,
				cookieString: mockRequest.headers.cookie
			});

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

			expect(res.render).toHaveBeenCalledWith(DECLARATION, {
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should re-render the template with errors if there is any pdf api call error', async () => {
			const mockRequest = {
				...req,
				body: {},
				headers: {
					cookie: "connect.sid='test'"
				}
			};

			mockRequest.session.appeal.decisionDate = new Date().toISOString();

			const error = new Error('Cheers');
			storePdfAppeal.mockImplementation(() => Promise.reject(error));

			await postDeclaration(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(submitAppealForBackOfficeProcessing).not.toHaveBeenCalled();

			expect(storePdfAppeal).toHaveBeenCalledWith({
				appeal,
				fileName,
				cookieString: mockRequest.headers.cookie
			});

			expect(res.render).toHaveBeenCalledWith(DECLARATION, {
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect if valid', async () => {
			storePdfAppeal.mockResolvedValue(appealPdf);

			const decisionDate = new Date();
			const mockRequest = {
				...req,
				body: {}
			};

			req.session.appeal.decisionDate = decisionDate;

			await postDeclaration(mockRequest, res);

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

			expect(res.redirect).toHaveBeenCalledWith(`/${APPEAL_SUBMITTED}`);
		});
	});
});
