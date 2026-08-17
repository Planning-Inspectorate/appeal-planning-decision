const controller = require('./index');
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

describe('controllers/selected-appeal/supporting-documents', () => {
	const mockGetDepartmentFromCode =
		/** @type {jest.MockedFunction<typeof getDepartmentFromCode>} */ (getDepartmentFromCode);
	const mockFormatTitleSuffix = formatTitleSuffix;
	const mockGetParentPathLink = getParentPathLink;
	const mockFormatDocumentLink = formatDocumentLink;
	const mockFormatHeadlineData = formatHeadlineData;
	const appealNumber = 'ABC123';
	const testDocument = {
		id: 'document-1',
		filename: 'supporting-document.pdf',
		documentType: APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING
	};
	const formattedDocumentLink = '/documents/document-1';
	const headlineData = [{ key: { text: 'LPA' }, value: { text: 'Test LPA' } }];
	const caseData = {
		LPACode: 'Q9999'
	};
	const documentData = [testDocument];

	const mockReq = () => ({
		originalUrl: '/appeals/ABC123/supporting-documents',
		params: { appealNumber },
		appealsApiClient: {
			confirmUserHasAccessToAppealCase: jest.fn(),
			getAppealCaseByCaseRef: jest.fn(),
			getDocumentsByCaseRef: jest.fn()
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

		req.appealsApiClient.getAppealCaseByCaseRef.mockResolvedValue(caseData);
		req.appealsApiClient.getDocumentsByCaseRef.mockResolvedValue(documentData);
		mockGetParentPathLink.mockReturnValue('/appeals/ABC123');
		mockGetDepartmentFromCode.mockResolvedValue({ name: 'Test LPA' });
		mockFormatHeadlineData.mockReturnValue(headlineData);
		mockFormatTitleSuffix.mockReturnValue('test title suffix');
		mockFormatDocumentLink.mockReturnValue(formattedDocumentLink);
	});

	it('renders appellant documents with expected view context', async () => {
		const handler = controller.get(
			{
				userType: APPEAL_USER_ROLES.APPELLANT,
				documentTypes: [APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING],
				displayName: 'Supporting documents'
			},
			'layouts/test/test.njk'
		);

		await handler(req, res, next);

		expect(req.appealsApiClient.getDocumentsByCaseRef).toHaveBeenCalledWith(appealNumber, [
			APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING
		]);
		expect(getDepartmentFromCode).toHaveBeenCalledWith('Q9999');
		expect(formatHeadlineData).toHaveBeenCalledWith({
			caseData,
			lpaName: 'Test LPA',
			role: APPEAL_USER_ROLES.APPELLANT
		});
		expect(formatDocumentLink).toHaveBeenCalledWith(testDocument);
		expect(formatTitleSuffix).toHaveBeenCalledWith(APPEAL_USER_ROLES.APPELLANT);
		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_DOCUMENTS, {
			layoutTemplate: 'layouts/test/test.njk',
			backToAppealOverviewLink: '/appeals/ABC123',
			titleSuffix: 'test title suffix',
			heading: 'Supporting documents',
			appeal: {
				appealNumber,
				headlineData,
				documents: [formattedDocumentLink]
			},
			zipDownloadUrl: '/appeals/ABC123/download/back-office/documents?filter=generalSupporting',
			zipDownloadText: 'Download all of your supporting documents (ZIP)'
		});
	});

	it('renders lpa supporting documents for lpa user', async () => {
		req.originalUrl = '/manage-appeals/ABC123/lpa-supporting-documents';
		mockGetParentPathLink.mockReturnValue('/manage-appeals/ABC123');

		const handler = controller.get(
			{
				userType: LPA_USER_ROLE,
				documentTypes: [APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING],
				displayName: 'Supporting documents'
			},
			'layouts/lpa-dashboard/main.njk'
		);

		await handler(req, res, next);

		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_DOCUMENTS, {
			layoutTemplate: 'layouts/lpa-dashboard/main.njk',
			backToAppealOverviewLink: '/manage-appeals/ABC123',
			titleSuffix: 'test title suffix',
			heading: 'Supporting documents',
			appeal: {
				appealNumber,
				headlineData,
				documents: [formattedDocumentLink]
			},
			zipDownloadUrl:
				'/manage-appeals/ABC123/download/back-office/documents?filter=generalSupporting',
			zipDownloadText: 'Download all of your supporting documents (ZIP)'
		});
	});

	it('renders not found when no documents exist', async () => {
		req.appealsApiClient.getDocumentsByCaseRef.mockResolvedValue([]);

		const handler = controller.get({
			userType: APPEAL_USER_ROLES.APPELLANT,
			documentTypes: [APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING],
			displayName: 'Supporting Documents'
		});

		await handler(req, res, next);

		expect(logger.error).toHaveBeenCalledWith('No documents found: Appellant|generalSupporting');
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
		expect(getDepartmentFromCode).not.toHaveBeenCalled();
	});

	it('throws when user type is missing', async () => {
		const handler = controller.get(
			/** @type {any} */ ({
				userType: null,
				documentTypes: [APPEAL_DOCUMENT_TYPE.GENERAL_SUPPORTING],
				displayName: 'Supporting Documents'
			})
		);

		await expect(handler(req, res, next)).rejects.toThrow('Unknown role: null');
		expect(req.appealsApiClient.getDocumentsByCaseRef).not.toHaveBeenCalled();
	});

	it('throws when document type is unknown', async () => {
		const handler = controller.get(
			/** @type {any} */ ({
				userType: APPEAL_USER_ROLES.APPELLANT,
				documentTypes: ['unknownDocumentType'],
				displayName: 'Supporting Documents'
			})
		);

		await expect(handler(req, res, next)).rejects.toThrow(
			'Unknown document type: unknownDocumentType'
		);
		expect(formatDocumentLink).not.toHaveBeenCalled();
	});
});
