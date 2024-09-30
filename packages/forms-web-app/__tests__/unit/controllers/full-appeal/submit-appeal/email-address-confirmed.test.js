const {
	getEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-address-confirmed');
const { isFeatureActive } = require('../../../../../src/featureFlag');
const { getDepartmentFromId } = require('../../../../../src/services/department.service');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');

jest.mock('../../../../../src/featureFlag');
jest.mock('../../../../../src/services/department.service');

describe('controllers/full-appeal/submit-appeal/email-address-confirmed', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEmailConfirmed', () => {
		it('calls correct template: token valid, V1 routes', async () => {
			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(false);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await getEmailConfirmed(req, res);
			expect(res.render).toBeCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/full-appeal/submit-appeal/list-of-documents'
			});
		});

		it('calls correct template: token valid, V2 routes', async () => {
			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(true);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await getEmailConfirmed(req, res);
			expect(res.render).toBeCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/full-planning/appeal-form/before-you-start'
			});
		});
	});
});
