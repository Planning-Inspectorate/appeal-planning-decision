const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const { PLANNING_OBLIGATION_STATUS_OPTION } = require('@pins/business-rules/src/constants');
const {
	getPlanningObligationDeadline,
	postPlanningObligationDeadline
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');

const {
	VIEW: {
		FULL_APPEAL: { PLANNING_OBLIGATION_DEADLINE, NEW_DOCUMENTS }
	}
} = require('../../../../../src/lib/views');

const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/planning-obligation-deadline', () => {
	let req;
	let res;

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getPlanningObligationDeadline', () => {
		it('calls correct template', async () => {
			await getPlanningObligationDeadline(req, res);
			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DEADLINE, {
				planningObligationDeadline: undefined
			});
		});
	});

	describe('postPlanningObligationDeadline', () => {
		it('postPlanningObligationDeadline method calls the correct template if clicked continue', async () => {
			req = {
				...req,
				body: {
					'planning-obligation-deadline': 'ok'
				}
			};
			createOrUpdateAppeal.mockImplementation(() => Promise.resolve(appeal));
			await postPlanningObligationDeadline(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);
		});

		it('postPlanningObligationDeadline method calls the correct template if it contains errors', async () => {
			req = {
				...req,
				body: {
					errors: { error: 'error' },
					errorSummary: ['error']
				}
			};

			await postPlanningObligationDeadline(req, res);

			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DEADLINE, {
				appeal,
				errors: { error: 'error' },
				errorSummary: ['error']
			});
		});

		it('postPlanningObligationDeadline method calls the correct template if the service throws errors', async () => {
			req = {
				...req,
				body: {
					'planning-obligation-deadline': 'ok'
				}
			};

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(new Error()));
			await postPlanningObligationDeadline(req, res);

			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DEADLINE, {
				planningObligationDeadline: {
					plansPlanningObligation: true,
					planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED
				},
				errors: {},
				errorSummary: [{ text: 'Error', href: '#' }]
			});
		});
	});
});
