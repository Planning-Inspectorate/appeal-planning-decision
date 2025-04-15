const representationsController = require('./index');
const { VIEW } = require('../../../lib/views');

const { mockRes } = require('../../../../__tests__/unit/mocks');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { formatHeadlineData } = require('@pins/common');
const {
	filterRepresentationsForDisplay,
	formatRepresentationHeading,
	formatRepresentations
} = require('../../../lib/representation-functions');
const { getParentPathLink } = require('../../../lib/get-user-back-links');
const {
	APPEAL_USER_ROLES,
	LPA_USER_ROLE,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');
const { generatePDF } = require('#lib/pdf-api-wrapper');
const { addCSStoHtml } = require('#lib/add-css-to-html');
const { documentTypes } = require('@pins/common');
const { documentTypes } = require('@pins/common');

jest.mock('../../../services/department.service');
jest.mock('../../../lib/selected-appeal-page-setup');
jest.mock('../../../lib/representation-functions');
jest.mock('../../../services/user.service');
jest.mock('../../../lib/get-user-back-links');
jest.mock('#lib/add-css-to-html');
jest.mock('#lib/pdf-api-wrapper');

jest.mock('@pins/common');

describe('controllers/selected-appeal/representations', () => {
	const appealNumber = 'ABC123';
	const testCaseData = {
		LPACode: 'Q9999',
		appealNumber,
		someOtherData: 'test',
		Representations: [],
		Documents: [
			{
				id: 'testDocId',
				documentType: documentTypes.interestedPartyComment.name,
				redacted: false
			}
		]
	};

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
		layoutTemplate: 'layouts/test/test.njk',
		backToAppealOverviewLink: '/appeals/ABC123',
		titleSuffix: 'test title suffix',
		heading: 'test representation heading',
		showLabel: false,
		appeal: {
			appealNumber: 'ABC123',
			headlineData: { title: 'Appeal Headline Data' },
			representations: ['test reps']
		},
		pdfDownloadUrl: 'a/fake/url?pdf=true',
		zipDownloadUrl: 'a/fake/download/back-office/documents/third-party-comments'
	};
	const testHtml = '<head></head><h1>Test Html</h1>';
	const testCSS = 'css data';
	const testHtmlWithCSS = '<head><style>' + testCSS + '</style></head><h1>Test Html</h1>';

	beforeEach(() => {
		req.params.appealNumber = appealNumber;
		req.appealsApiClient = {
			getAppealCaseWithRepresentationsByType: jest.fn()
		};

		req.appealsApiClient.getAppealCaseWithRepresentationsByType.mockImplementation(() =>
			Promise.resolve(testCaseData)
		);
		getDepartmentFromCode.mockImplementation(() => Promise.resolve({ name: 'Test LPA' }));
		formatHeadlineData.mockImplementation(() => ({ title: 'Appeal Headline Data' }));
		formatTitleSuffix.mockImplementation(() => 'test title suffix');
		filterRepresentationsForDisplay.mockImplementation(() => []);
		formatRepresentationHeading.mockImplementation(() => 'test representation heading');
		formatRepresentations.mockImplementation(() => ['test reps']);
		res.render.mockImplementation(async (view, locals, callback) => {
			/* eslint-disable-next-line no-undef */
			callback((err = null), (html = testHtml));
		});
	});

	it('renders the representation page with the correct data', async () => {
		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.STATEMENT,
			submittingParty: LPA_USER_ROLE
		};

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		getParentPathLink.mockReturnValue('/appeals/ABC123');

		expect(req.appealsApiClient.getAppealCaseWithRepresentationsByType).toHaveBeenCalledWith(
			'ABC123',
			testParams.representationType
		);
		expect(formatRepresentations).toHaveBeenCalledWith(testCaseData, []);
		expect(formatTitleSuffix).toHaveBeenCalledWith(testParams.userType);
		expect(formatRepresentationHeading).toHaveBeenCalledWith(testParams);
		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_REPRESENTATIONS,
			{ ...expectedViewContext, backToAppealOverviewLink: undefined },
			expect.any(Function)
		);
	});

	it('renders the representation page with the correct data for interested party comments', async () => {
		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		getParentPathLink.mockReturnValue('/appeals/ABC123');

		expect(req.appealsApiClient.getAppealCaseWithRepresentationsByType).toHaveBeenCalledWith(
			'ABC123',
			testParams.representationType
		);
		expect(filterRepresentationsForDisplay).toHaveBeenCalledWith(testCaseData, testParams);
		expect(formatRepresentations).toHaveBeenCalledWith(testCaseData, []);
		expect(formatTitleSuffix).toHaveBeenCalledWith(testParams.userType);
		expect(formatRepresentationHeading).toHaveBeenCalledWith(testParams);
		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			expectedViewContext,
			expect.any(Function)
		);
	});

	it('renders page if URL does not have PDF query', async () => {
		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		addCSStoHtml.mockReturnValue(testHtmlWithCSS);
		const testBuffer = Buffer.from(testHtmlWithCSS);
		generatePDF.mockReturnValue(testBuffer);

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');

		expect(generatePDF).not.toHaveBeenCalled();
		expect(addCSStoHtml).not.toHaveBeenCalled();

		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			expectedViewContext,
			expect.any(Function)
		);
		expect(res.send).toHaveBeenCalledWith(testHtml);
	});
	it('renders page without zip download url if there is no caseData interested party document but another document', async () => {
		req.appealsApiClient.getAppealCaseWithRepresentationsByType.mockImplementation(() =>
			Promise.resolve({
				...testCaseData,
				...{
					Documents: [
						{
							id: 'testDocId',
							documentType: documentTypes.originalApplication.name,
							redacted: false
						}
					]
				}
			})
		);

		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		addCSStoHtml.mockReturnValue(testHtmlWithCSS);
		const testBuffer = Buffer.from(testHtmlWithCSS);
		generatePDF.mockReturnValue(testBuffer);

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');

		expect(generatePDF).not.toHaveBeenCalled();
		expect(addCSStoHtml).not.toHaveBeenCalled();

		expect(req.app.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			{ ...expectedViewContext, zipDownloadUrl: undefined },
			expect.any(Function)
		);
		expect(res.send).toHaveBeenCalledWith(testHtml);
	});

	it('renders page without zip download url if there is no caseData doocument present', async () => {
		req.appealsApiClient.getAppealCaseWithRepresentationsByType.mockImplementation(() =>
			Promise.resolve({
				...testCaseData,
				...{
					Documents: []
				}
			})
		);

		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		addCSStoHtml.mockReturnValue(testHtmlWithCSS);
		const testBuffer = Buffer.from(testHtmlWithCSS);
		generatePDF.mockReturnValue(testBuffer);

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');

		expect(generatePDF).not.toHaveBeenCalled();
		expect(addCSStoHtml).not.toHaveBeenCalled();

		expect(req.app.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			{ ...expectedViewContext, zipDownloadUrl: undefined },
			expect.any(Function)
		);
		expect(res.send).toHaveBeenCalledWith(testHtml);
	});

	it('renders page without zip download url if there there is a interested party document but is redacted', async () => {
		req.appealsApiClient.getAppealCaseWithRepresentationsByType.mockImplementation(() =>
			Promise.resolve({
				...testCaseData,
				...{
					Documents: [
						{
							id: 'testDocId',
							documentType: documentTypes.interestedPartyComment.name,
							redacted: true
						}
					]
				}
			})
		);

		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		addCSStoHtml.mockReturnValue(testHtmlWithCSS);
		const testBuffer = Buffer.from(testHtmlWithCSS);
		generatePDF.mockReturnValue(testBuffer);

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);

		await representationFunction(req, res);

		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');

		expect(generatePDF).not.toHaveBeenCalled();
		expect(addCSStoHtml).not.toHaveBeenCalled();

		expect(req.app.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			{ ...expectedViewContext, zipDownloadUrl: undefined },
			expect.any(Function)
		);
		expect(res.send).toHaveBeenCalledWith(testHtml);
	});

	it('generates and downloads PDF and does not render HTML if URL has ?pdf=true query', async () => {
		req.query.pdf = 'true';

		getParentPathLink.mockReturnValue('/appeals/ABC123');

		const pdfExpectedViewContext = {
			...expectedViewContext,
			pdfDownloadUrl: undefined,
			zipDownloadUrl: undefined
		};

		addCSStoHtml.mockReturnValue(testHtmlWithCSS);
		const testBuffer = Buffer.from(testHtmlWithCSS);
		generatePDF.mockReturnValue(testBuffer);

		const controller = representationsController;

		const testParams = {
			userType: APPEAL_USER_ROLES.APPELLANT,
			representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
			submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
		};

		const testLayoutTemplate = 'layouts/test/test.njk';

		const representationFunction = controller.get(testParams, testLayoutTemplate);
		await representationFunction(req, res);

		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');

		expect(addCSStoHtml).toHaveBeenCalledWith(testHtml);
		expect(generatePDF).toHaveBeenCalledWith(testHtmlWithCSS);

		expect(res.render).toHaveBeenCalledWith(
			VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS,
			pdfExpectedViewContext,
			expect.any(Function)
		);

		expect(res.set).toHaveBeenNthCalledWith(
			1,
			'Content-disposition',
			'attachment; filename="Appeal Interested Party Comments ABC123.pdf"'
		);
		expect(res.set).toHaveBeenNthCalledWith(2, 'Content-type', 'application/pdf');
		expect(res.send).toHaveBeenCalledWith(testBuffer);
	});
});
