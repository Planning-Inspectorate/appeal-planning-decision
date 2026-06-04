const costsController = require('./index');
const { VIEW } = require('../../../lib/views');
const { mockRes } = require('../../../../__tests__/unit/mocks');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { formatTitleSuffix } = require('#lib/selected-appeal-page-setup');
const { getParentPathLink } = require('#lib/get-user-back-links');
const { formatDocumentLink } = require('#lib/representation-functions');
const logger = require('#lib/logger');
const { formatHeadlineData } = require('@pins/common');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

jest.mock('../../../services/department.service');
jest.mock('#lib/selected-appeal-page-setup');
jest.mock('#lib/get-user-back-links');
jest.mock('#lib/representation-functions');
jest.mock('#lib/logger');
jest.mock('@pins/common');

describe('controllers/selected-appeal/costs', () => {
	const mockGetDepartmentFromCode =
		/** @type {jest.MockedFunction<typeof getDepartmentFromCode>} */ (getDepartmentFromCode);
	const mockFormatTitleSuffix = formatTitleSuffix;
	const mockGetParentPathLink = getParentPathLink;
	const mockFormatDocumentLink = formatDocumentLink;
	const mockFormatHeadlineData = formatHeadlineData;
	const appealNumber = 'ABC123';
	const testDocument = {
		id: 'document-1',
		filename: 'costs.pdf',
		documentType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION
	};
	const formattedDocumentLink = '/documents/document-1';
	const headlineData = [{ key: { text: 'LPA' }, value: { text: 'Test LPA' } }];
	const caseData = {
		LPACode: 'Q9999',
		Documents: [testDocument]
	};

	const mockReq = () => ({
		originalUrl: '/appeals/ABC123/appellant-costs-applications',
		params: { appealNumber },
		appealsApiClient: {
			getAppealCaseWithCostsByType: jest.fn()
		}
	});

	/** @type {any} */
	let req;
	/** @type {any} */
	let res;
	/** @type {import('express').NextFunction} */
	let next;

	beforeEach(() => {
		jest.resetAllMocks();
		req = mockReq();
		res = mockRes();
		next = jest.fn();
		res.status.mockReturnThis();

		req.appealsApiClient.getAppealCaseWithCostsByType.mockResolvedValue(caseData);
		mockGetParentPathLink.mockReturnValue('/appeals/ABC123');
		mockGetDepartmentFromCode.mockResolvedValue({ name: 'Test LPA' });
		mockFormatHeadlineData.mockReturnValue(headlineData);
		mockFormatTitleSuffix.mockReturnValue('test title suffix');
		mockFormatDocumentLink.mockReturnValue(formattedDocumentLink);
	});

	it('renders appellant costs applications with expected view context', async () => {
		const handler = costsController.get(
			{
				userType: APPEAL_USER_ROLES.APPELLANT,
				costsType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			},
			'layouts/test/test.njk'
		);

		await handler(req, res, next);

		expect(req.appealsApiClient.getAppealCaseWithCostsByType).toHaveBeenCalledWith(appealNumber, [
			APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION
		]);
		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');
		expect(formatHeadlineData).toHaveBeenCalledWith({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});
		expect(formatDocumentLink).toHaveBeenCalledWith(testDocument);
		expect(formatTitleSuffix).toHaveBeenCalledWith(APPEAL_USER_ROLES.APPELLANT);
		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_COSTS, {
			layoutTemplate: 'layouts/test/test.njk',
			backToAppealOverviewLink: '/appeals/ABC123',
			titleSuffix: 'test title suffix',
			heading: 'Your costs applications',
			appeal: {
				appealNumber,
				headlineData,
				documents: [formattedDocumentLink]
			},
			zipDownloadUrl:
				'/appeals/ABC123/download/back-office/documents?filter=appellantCostsApplication',
			zipDownloadText: 'Download all of your costs applications (ZIP)'
		});
	});

	it('renders lpa costs comments copy for lpa user', async () => {
		req.originalUrl = '/manage-appeals/ABC123/lpa-costs-comments';
		mockGetParentPathLink.mockReturnValue('/manage-appeals/ABC123');

		const handler = costsController.get(
			{
				userType: LPA_USER_ROLE,
				costsType: APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE,
				submittingParty: LPA_USER_ROLE
			},
			'layouts/lpa-dashboard/main.njk'
		);

		await handler(req, res, next);

		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_COSTS, {
			layoutTemplate: 'layouts/lpa-dashboard/main.njk',
			backToAppealOverviewLink: '/manage-appeals/ABC123',
			titleSuffix: 'test title suffix',
			heading: 'Your costs comments',
			appeal: {
				appealNumber,
				headlineData,
				documents: [formattedDocumentLink]
			},
			zipDownloadUrl:
				'/manage-appeals/ABC123/download/back-office/documents?filter=lpaCostsCorrespondence',
			zipDownloadText: 'Download all of your costs comments (ZIP)'
		});
	});

	it('renders not found when no costs documents exist', async () => {
		req.appealsApiClient.getAppealCaseWithCostsByType.mockResolvedValue({
			...caseData,
			Documents: []
		});

		const handler = costsController.get({
			userType: APPEAL_USER_ROLES.APPELLANT,
			costsType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
			submittingParty: APPEAL_USER_ROLES.APPELLANT
		});

		await handler(req, res, next);

		expect(logger.error).toHaveBeenCalledWith(
			'No costs documents found: Appellant|appellantCostsApplication'
		);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
		expect(getDepartmentFromCode).not.toHaveBeenCalled();
	});

	it('throws when user type is missing', async () => {
		const handler = costsController.get(
			/** @type {any} */ ({
				userType: null,
				costsType: APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			})
		);

		await expect(handler(req, res, next)).rejects.toThrow('Unknown role: null');
		expect(req.appealsApiClient.getAppealCaseWithCostsByType).not.toHaveBeenCalled();
	});

	it('throws when costs type is unknown', async () => {
		const handler = costsController.get(
			/** @type {any} */ ({
				userType: APPEAL_USER_ROLES.APPELLANT,
				costsType: 'unknownCostsType',
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			})
		);

		await expect(handler(req, res, next)).rejects.toThrow('Unknown costs type: unknownCostsType');
		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');
		expect(formatDocumentLink).not.toHaveBeenCalled();
	});
});
