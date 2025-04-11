const indexController = require('./index');

const { mockRes } = require('../../../../__tests__/unit/mocks');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_CASE_STAGE } = require('pins-data-model');

const { VIEW } = require('#lib/views');
const { determineUser } = require('#lib/determine-user');
const { formatHeadlineData, formatQuestionnaireRows } = require('@pins/common');
const {
	formatQuestionnaireHeading,
	formatTitleSuffix
} = require('#lib/selected-appeal-page-setup');
const { constraintsRows } = require('./constraints-details-rows');
const { appealProcessRows } = require('./appeal-process-details-rows');
const { consultationRows } = require('./consultation-details-rows');
const { environmentalRows } = require('./environmental-details-rows');
const { notifiedRows } = require('./notified-details-rows');
const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { siteAccessRows } = require('./site-access-details-rows');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { addCSStoHtml } = require('#lib/add-css-to-html');
const { generatePDF } = require('#lib/pdf-api-wrapper');

jest.mock('@pins/common');
jest.mock('#lib/determine-user');
jest.mock('#lib/selected-appeal-page-setup');
jest.mock('./constraints-details-rows');
jest.mock('./appeal-process-details-rows');
jest.mock('./consultation-details-rows');
jest.mock('./environmental-details-rows');
jest.mock('./notified-details-rows');
jest.mock('./planning-officer-details-rows');
jest.mock('./site-access-details-rows');
jest.mock('../../../services/user.service');
jest.mock('../../../services/department.service');
jest.mock('#lib/add-css-to-html');
jest.mock('#lib/pdf-api-wrapper');

const date = new Date();
const caseData = { LPACode: 'Q9999', caseValidDate: date };
const testHtml = '<head></head><h1>Test Html</h1>';
const testCSS = 'css data';
const testHtmlWithCSS = '<head><style>' + testCSS + '</style></head><h1>Test Html</h1>';

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
	titleSuffix: 'formatted title suffix',
	mainHeading: 'formatted questionnaire heading',
	backToAppealOverviewLink: 'a/fake',
	appeal: {
		appealNumber: 123456,
		headlineData: 'some headline data',
		constraintsDetails: 'some formatted row data',
		environmentalDetails: 'some formatted row data',
		notifiedDetails: 'some formatted row data',
		consultationDetails: 'some formatted row data',
		planningOfficerDetails: 'some formatted row data',
		siteAccessDetails: 'some formatted row data',
		appealProcessDetails: 'some formatted row data'
	},
	pdfDownloadUrl: 'a/fake/url?pdf=true',
	zipDownloadUrl: `a/fake/download/back-office/documents/${APPEAL_CASE_STAGE.LPA_QUESTIONNAIRE}`
};

describe('controllers/selected-appeal/questionnaire-details/index', () => {
	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		getUserFromSession.mockReturnValue({ email: 'test@example.com' });
		getDepartmentFromCode.mockReturnValue({ name: 'Test LPA' });
		formatHeadlineData.mockReturnValue('some headline data');
		formatQuestionnaireHeading.mockReturnValue('formatted questionnaire heading');
		formatTitleSuffix.mockReturnValue('formatted title suffix');
		formatQuestionnaireRows.mockReturnValue('some formatted row data');
		req.appealsApiClient.getUserByEmailV2.mockReturnValue({ id: '123' });
		req.appealsApiClient.getUsersAppealCase.mockReturnValue(caseData);
		req.app.render.mockImplementation(async (view, locals, callback) => {
			/* eslint-disable-next-line no-undef */
			callback((err = null), (html = testHtml));
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
			expect(formatHeadlineData).toHaveBeenCalledWith(caseData, 'Test LPA', LPA_USER_ROLE);
			expect(constraintsRows).toHaveBeenCalledWith(caseData);
			expect(environmentalRows).toHaveBeenCalledWith(caseData);
			expect(notifiedRows).toHaveBeenCalledWith(caseData);
			expect(consultationRows).toHaveBeenCalledWith(caseData);
			expect(planningOfficerReportRows).toHaveBeenCalledWith(caseData);
			expect(siteAccessRows).toHaveBeenCalledWith(caseData);
			expect(appealProcessRows).toHaveBeenCalledWith(caseData);

			expect(generatePDF).not.toHaveBeenCalled();
			expect(addCSStoHtml).not.toHaveBeenCalled();

			expect(req.app.render).toHaveBeenCalledWith(
				VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE,
				expectedViewContext,
				expect.any(Function)
			);
			expect(res.send).toHaveBeenCalledWith(testHtml);
		});
		it('generates and downloads PDF and does not render HTML if URL has ?pdf=true query', async () => {
			req.query.pdf = 'true';

			const pdfExpectedViewContext = {
				...expectedViewContext,
				pdfDownloadUrl: undefined,
				zipDownloadUrl: undefined
			};

			addCSStoHtml.mockReturnValue(testHtmlWithCSS);
			const testBuffer = Buffer.from(testHtmlWithCSS);
			generatePDF.mockReturnValue(testBuffer);

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
			expect(formatHeadlineData).toHaveBeenCalledWith(caseData, 'Test LPA', LPA_USER_ROLE);
			expect(constraintsRows).toHaveBeenCalledWith(caseData);
			expect(environmentalRows).toHaveBeenCalledWith(caseData);
			expect(notifiedRows).toHaveBeenCalledWith(caseData);
			expect(consultationRows).toHaveBeenCalledWith(caseData);
			expect(planningOfficerReportRows).toHaveBeenCalledWith(caseData);
			expect(siteAccessRows).toHaveBeenCalledWith(caseData);
			expect(appealProcessRows).toHaveBeenCalledWith(caseData);

			expect(addCSStoHtml).toHaveBeenCalledWith(testHtml);
			expect(generatePDF).toHaveBeenCalledWith(testHtmlWithCSS);

			expect(req.app.render).toHaveBeenCalledWith(
				VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE,
				pdfExpectedViewContext,
				expect.any(Function)
			);

			expect(res.set).toHaveBeenNthCalledWith(
				1,
				'Content-disposition',
				'attachment; filename="Appeal Questionnaire 123456.pdf"'
			);
			expect(res.set).toHaveBeenNthCalledWith(2, 'Content-type', 'application/pdf');
			expect(res.send).toHaveBeenCalledWith(testBuffer);
		});
	});
});
