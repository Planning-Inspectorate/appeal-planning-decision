const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getPlanningObligationPlanned,
	postPlanningObligationPlanned
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-planned');
const v8 = require('v8');

const {
	VIEW: {
		FULL_APPEAL: { PLANNING_OBLIGATION_PLANNED, PLANNING_OBLIGATION_STATUS, NEW_DOCUMENTS }
	}
} = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const errors = {
	'plan-to-submit-planning-obligation': {
		value: undefined,
		msg: 'Select yes if you plan to submit a planning obligation',
		param: 'plan-to-submit-planning-obligation',
		location: 'body'
	}
};
const errorSummary = [
	{
		text: 'Select yes if you plan to submit a planning obligation',
		href: '#plan-to-submit-planning-obligation'
	}
];

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/planning-obligation-planned', () => {
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

	describe('getPlanningObligationPlanned', () => {
		it('Test getPlanningObligationPlanned method calls the correct template if new plans and drawings', async () => {
			req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = true;
			req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = null;
			await getPlanningObligationPlanned(req, res);

			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_PLANNED, {
				plansPlanningObligation: null
			});
		});
		it('Test getPlanningObligationPlanned method calls the correct template if no new plans and drawings', async () => {
			req.session.appeal.appealDocumentsSection.plansDrawings.hasPlansDrawings = false;
			req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = null;
			await getPlanningObligationPlanned(req, res);

			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_PLANNED, {
				plansPlanningObligation: null
			});
		});
	});

	describe('postPlanningObligationPlanned', () => {
		it('should re-render template with errors if submission validation fails - new plans and drawings', async () => {
			req = {
				...req,
				session: {
					appeal: {
						appealDocumentsSection: {
							plansDrawings: { hasPlansDrawings: true }
						}
					}
				},
				body: {
					errors,
					errorSummary
				}
			};
			await postPlanningObligationPlanned(req, res);
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_PLANNED, {
				errors,
				errorSummary
			});
		});
		it('should re-render template with errors if submission validation fails - no new plans and drawings', async () => {
			req = {
				...req,
				session: {
					appeal: {
						appealDocumentsSection: {
							plansDrawings: { hasPlansDrawings: false }
						}
					}
				},
				body: {
					errors,
					errorSummary,
					'plan-to-submit-planning-obligation': null
				}
			};
			await postPlanningObligationPlanned(req, res);
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_PLANNED, {
				errors,
				errorSummary
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			const error = new Error('Internal Server Error');

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postPlanningObligationPlanned(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledTimes(1);
			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_PLANNED, {
				plansPlanningObligation: false,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to correct page if plan-to-submit-planning-obligation is yes', async () => {
			req = {
				...req,
				body: {
					'plan-to-submit-planning-obligation': 'yes'
				}
			};
			await postPlanningObligationPlanned(req, res);
			expect(res.render).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(`/${PLANNING_OBLIGATION_STATUS}`);
		});

		it('should remove any uploaded planning obligation files and redirect to correct page if plan-to-submit-planning-obligation is no', async () => {
			req = {
				...req,
				body: {
					'plan-to-submit-planning-obligation': 'no'
				}
			};

			let thisAppeal = req.session.appeal;

			createOrUpdateAppeal.mockReturnValue(thisAppeal);

			await postPlanningObligationPlanned(req, res);

			expect(res.render).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);

			expect(req.session.appeal).toEqual(thisAppeal);

			expect(thisAppeal.appealDocumentsSection.planningObligations.plansPlanningObligation).toEqual(
				false
			);
			expect(thisAppeal.appealDocumentsSection.planningObligations.uploadedFiles).toEqual([]);
			expect(thisAppeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles).toEqual([]);
			expect(
				thisAppeal.appealDocumentsSection.planningObligationDeadline.planningObligationStatus
			).toEqual(null);
		});
	});
});
