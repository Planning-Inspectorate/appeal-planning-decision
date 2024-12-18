const representationsController = require('./index');
const { VIEW } = require('../../../lib/views');

const { mockReq, mockRes } = require('../../../../__tests__/unit/mocks');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { formatHeadlineData } = require('@pins/common');
const {
	filterRepresentationsBySubmittingParty,
	formatRepresentationHeading,
	formatRepresentations
} = require('../../../lib/representation-functions');
const {
	APPEAL_USER_ROLES,
	LPA_USER_ROLE,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

jest.mock('../../../services/department.service');
jest.mock('../../../lib/selected-appeal-page-setup');
jest.mock('../../../lib/representation-functions');

jest.mock('@pins/common');

describe('controllers/selected-appeal/representations', () => {
	let req;
	let res;
	const appealNumber = 'ABC123';
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		req.params.appealNumber = appealNumber;
		req.appealsApiClient = {
			getAppealCaseWithRepresentationsByType: jest.fn()
		};

		req.appealsApiClient.getAppealCaseWithRepresentationsByType.mockImplementation(() =>
			Promise.resolve({
				LPACode: 'ABC',
				appealNumber,
				someOtherData: 'test'
			})
		);
		getDepartmentFromCode.mockImplementation(() => Promise.resolve({ name: 'Test LPA' }));
		formatHeadlineData.mockImplementation(() => ({ title: 'Appeal Headline Data' }));
		formatTitleSuffix.mockImplementation(() => 'test title suffix');
		filterRepresentationsBySubmittingParty.mockImplementation(() => []);
		formatRepresentationHeading.mockImplementation(() => 'test representation heading');
		formatRepresentations.mockImplementation(() => ['test reps']);
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

		expect(req.appealsApiClient.getAppealCaseWithRepresentationsByType).toHaveBeenCalledWith(
			'ABC123',
			REPRESENTATION_TYPES.STATEMENT
		);

		expect(res.render).toHaveBeenCalledWith(VIEW.SELECTED_APPEAL.APPEAL_REPRESENTATIONS, {
			layoutTemplate: testLayoutTemplate,
			titleSuffix: 'test title suffix',
			heading: 'test representation heading',
			appeal: {
				appealNumber: 'ABC123',
				headlineData: { title: 'Appeal Headline Data' },
				representations: ['test reps']
			}
		});
	});
});
