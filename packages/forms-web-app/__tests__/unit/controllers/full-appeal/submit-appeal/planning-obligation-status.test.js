const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
	getPlanningObligationStatus,
	postPlanningObligationStatus
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-status');

const {
	VIEW: {
		FULL_APPEAL: { PLANNING_OBLIGATION_STATUS }
	}
} = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/planning-obligation-status', () => {
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

	describe('getPlanningObligationStatus', () => {
		it('calls getPlanningObligationStatus with the  correct template', async () => {
			req.session.appeal.appealDocumentsSection.planningObligations = {
				planningObligationStatus: 'not_started'
			};
			await getPlanningObligationStatus(req, res);
			expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_STATUS, {
				planningObligationStatus: 'not_started'
			});
		});
	});

	describe('postPlanningObligationStatus', () => {
		it('clears any finalised planning obligation uploaded files if selected status is draft', async () => {
			req = {
				...req,
				body: {
					'planning-obligation-status': 'draft'
				}
			};

			let thisAppeal = req.session.appeal;

			createOrUpdateAppeal.mockReturnValue(thisAppeal);

			await postPlanningObligationStatus(req, res);

			expect(thisAppeal.appealDocumentsSection.planningObligations.uploadedFiles).toEqual([]);
			expect(thisAppeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles).not.toEqual(
				[]
			);
		});
		it('clears any draft planning obligation uploaded files if selected status is finalised', async () => {
			req = {
				...req,
				body: {
					'planning-obligation-status': 'finalised'
				}
			};

			let thisAppeal = req.session.appeal;

			createOrUpdateAppeal.mockReturnValue(thisAppeal);

			await postPlanningObligationStatus(req, res);

			expect(thisAppeal.appealDocumentsSection.planningObligations.uploadedFiles).not.toEqual([]);
			expect(thisAppeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles).toEqual([]);
		});
		it('clears draft/finalised planning obligation uploaded files if selected status is not started', async () => {
			req = {
				...req,
				body: {
					'planning-obligation-status': 'not_started'
				}
			};

			let thisAppeal = req.session.appeal;

			createOrUpdateAppeal.mockReturnValue(thisAppeal);

			await postPlanningObligationStatus(req, res);

			expect(thisAppeal.appealDocumentsSection.planningObligations.uploadedFiles).toEqual([]);
			expect(thisAppeal.appealDocumentsSection.draftPlanningObligations.uploadedFiles).toEqual([]);
		});
	});
});
