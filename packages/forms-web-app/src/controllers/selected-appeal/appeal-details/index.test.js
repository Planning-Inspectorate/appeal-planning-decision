const indexController = require('./index');

const { mockRes } = require('../../../../__tests__/unit/mocks');
const { determineUser } = require('../../../lib/determine-user');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { detailsRows } = require('./appeal-details-rows');
const { documentsRows } = require('./appeal-documents-rows');
const { formatRows, formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../../lib/views');
const { generatePDF } = require('../../../lib/pdf-api-wrapper');
const fs = require('fs');
const path = require('path');

jest.mock('../../../lib/determine-user');
jest.mock('../../../services/user.service');
jest.mock('../../../services/department.service');
jest.mock('./appeal-details-rows');
jest.mock('./appeal-documents-rows');
jest.mock('@pins/common');
jest.mock('../../../lib/pdf-api-wrapper');

const css = fs.readFileSync(
	path.resolve(__dirname, '../../../public/stylesheets/main.css'),
	'utf8'
);
const date = new Date();
const caseData = { LPACode: 'Q9999', caseValidDate: date };

const mockReq = () => {
	return {
		originalUrl: 'a/fake/url',
		params: { appealNumber: 123456 },
		query: { pdf: '' },
		appealsApiClient: {
			getUserByEmailV2: jest.fn(),
			getUsersAppealCase: jest.fn()
		},
		app: { render: jest.fn() }
	};
};

let res = mockRes();
let req = mockReq();

const expectedViewContext = {
	layoutTemplate: 'layouts/no-banner-link/main.njk',
	titleSuffix: 'Manage your appeals',
	appealDetailsSuffix: "Appellant's",
	appeal: {
		appealNumber: 123456,
		headlineData: 'formatted headline data',
		appealDetails: 'some formatted row data',
		appealDocuments: 'some formatted row data'
	},
	cssOverride: undefined,
	pdfDownloadUrl: 'a/fake/url?pdf=true'
};

describe('controllers/selected-appeal/appeal-details/index', () => {
	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		getDepartmentFromCode.mockReturnValue({ name: 'Test LPA' });
		documentsRows.mockReturnValue('returned document rows');
		detailsRows.mockReturnValue('returned details rows');
		formatRows.mockReturnValue('some formatted row data');
		formatHeadlineData.mockReturnValue('formatted headline data');
		req.appealsApiClient.getUserByEmailV2.mockReturnValue({ id: '123' });
		req.appealsApiClient.getUsersAppealCase.mockReturnValue(caseData);
		req.app.render.mockImplementation(async (view, locals, callback) => {
			/* eslint-disable-next-line no-undef */
			callback((err = null), (html = '<h1>Test Html</h1>'));
		});
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('LPA User', () => {
		beforeEach(() => {
			determineUser.mockReturnValue(LPA_USER_ROLE);
		});

		it('renders page if URL does not have PDF query', async () => {
			req.appealsApiClient.getUserByEmailV2.mockReturnValue({ id: '123' });
			req.appealsApiClient.getUsersAppealCase.mockReturnValue(caseData);

			const indexGetController = indexController.get();
			await indexGetController(req, res);

			expect(determineUser).toHaveBeenCalledWith('a/fake/url');
			expect(getUserFromSession).toHaveBeenCalledWith(req);
			expect(req.appealsApiClient.getUserByEmailV2).toHaveBeenCalledWith('test@example.com');
			expect(req.appealsApiClient.getUsersAppealCase).toHaveBeenCalledWith({
				caseReference: 123456,
				role: LPA_USER_ROLE,
				userId: '123'
			});
			expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');
			expect(detailsRows).toHaveBeenCalledWith(caseData, LPA_USER_ROLE);
			expect(documentsRows).toHaveBeenCalledWith(caseData, LPA_USER_ROLE);
			expect(formatRows).toHaveBeenCalledWith('returned details rows', caseData);
			expect(formatHeadlineData).toHaveBeenCalledWith(caseData, 'Test LPA', LPA_USER_ROLE);
			expect(req.app.render).toHaveBeenCalledWith(
				VIEW.SELECTED_APPEAL.APPEAL_DETAILS,
				expectedViewContext,
				expect.any(Function)
			);

			expect(res.send).toHaveBeenCalledWith('<h1>Test Html</h1>');
		});

		it('Generates and downloads PDF and does not render HTML if URL has ?pdf=true query', async () => {
			req.query.pdf = 'true';

			const testBuffer = Buffer.from('<h1>Test Html</h1>');
			generatePDF.mockReturnValue(testBuffer);

			const pdfExpectedViewContext = {
				...expectedViewContext,
				cssOverride: css,
				pdfDownloadUrl: undefined
			};

			const indexGetController = indexController.get();
			await indexGetController(req, res);

			expect(determineUser).toHaveBeenCalledWith('a/fake/url');
			expect(getUserFromSession).toHaveBeenCalledWith(req);
			expect(req.appealsApiClient.getUserByEmailV2).toHaveBeenCalledWith('test@example.com');
			expect(req.appealsApiClient.getUsersAppealCase).toHaveBeenCalledWith({
				caseReference: 123456,
				role: LPA_USER_ROLE,
				userId: '123'
			});
			expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');
			expect(detailsRows).toHaveBeenCalledWith(caseData, LPA_USER_ROLE);
			expect(documentsRows).toHaveBeenCalledWith(caseData, LPA_USER_ROLE);
			expect(formatRows).toHaveBeenCalledWith('returned details rows', caseData);
			expect(formatHeadlineData).toHaveBeenCalledWith(caseData, 'Test LPA', LPA_USER_ROLE);
			expect(req.app.render).toHaveBeenCalledWith(
				VIEW.SELECTED_APPEAL.APPEAL_DETAILS,
				pdfExpectedViewContext,
				expect.any(Function)
			);

			expect(res.set).toHaveBeenNthCalledWith(
				1,
				'Content-disposition',
				'attachment; filename="Appeal 123456.pdf"'
			);
			expect(res.set).toHaveBeenNthCalledWith(2, 'Content-type', 'application/pdf');
			expect(res.send).toHaveBeenCalledWith(testBuffer);
			expect(generatePDF).toHaveBeenCalledWith('<h1>Test Html</h1>');
		});
	});
});
