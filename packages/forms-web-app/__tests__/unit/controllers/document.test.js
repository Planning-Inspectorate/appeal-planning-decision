const { constants } = require('@pins/business-rules');

const { getExistingAppeal } = require('../../../src/lib/appeals-api-wrapper');

const mockFetchDocument = {
	headers: {
		get: (item) => {
			return {
				'x-original-file-name': 'test-pdf.pdf',
				'content-length': 1000,
				'content-type': 'application/pdf'
			}[item];
		}
	},
	body: {
		pipe: jest.fn()
	}
};

jest.mock('../../../src/lib/documents-api-wrapper', () => ({
	fetchDocument: jest
		.fn()
		.mockImplementationOnce(() => mockFetchDocument)
		.mockImplementationOnce(() => {
			throw new Error('Internal Server Error');
		})
}));

jest.mock('../../../src/lib/appeals-api-wrapper');

const { getDocument } = require('../../../src/controllers/document');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/document', () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			...mockReq(),
			params: {}
		};
		res = {
			...mockRes(),
			set: jest.fn()
		};

		req.params.appealOrQuestionnaireId = req.session.appeal.id;
		req.params.documentId = '12345';
	});

	describe('getDocument', () => {
		it('should return the document', async () => {
			await getDocument(req, res);

			expect(res.set).toHaveBeenCalledWith({
				'content-length': 1000,
				'content-disposition': `attachment;filename="test-pdf.pdf"`,
				'content-type': 'application/pdf'
			});
			expect(mockFetchDocument.body.pipe).toHaveBeenCalledWith(res);
		});

		it.each([
			{
				appealType: constants.APPEAL_ID.PLANNING_SECTION_78,
				url: `/full-appeal/submit-appeal/enter-code/`
			},
			{
				appealType: constants.APPEAL_ID.HOUSEHOLDER,
				url: `/appeal-householder-decision/enter-code/`
			}
		])('should redirect: $appealType if no appeal in session', async ({ appealType, url }) => {
			delete req.session.appeal;

			getExistingAppeal.mockResolvedValue({
				id: req.params.appealOrQuestionnaireId,
				appealType
			});

			req.baseUrl = '/document';
			req.url = `/${req.params.appealOrQuestionnaireId}/doc-id`;

			await getDocument(req, res);

			expect(req.session.loginRedirect).toBe(req.baseUrl + req.url);
			expect(res.redirect).toHaveBeenCalledWith(`${url}${req.params.appealOrQuestionnaireId}`);
		});

		it('should return an error if an error is thrown', async () => {
			await getDocument(req, res);

			expect(res.sendStatus).toHaveBeenCalledWith(500);
		});
	});
});
