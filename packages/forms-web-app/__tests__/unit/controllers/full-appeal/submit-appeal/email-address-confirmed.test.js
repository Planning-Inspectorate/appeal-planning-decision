const {
	getEmailConfirmed
} = require('../../../../../src/controllers/full-appeal/submit-appeal/email-address-confirmed');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const { mockReq, mockRes } = require('../../../mocks');
const { APPEAL_ID, TYPE_OF_PLANNING_APPLICATION } = require('@pins/business-rules/src/constants');
const config = require('../../../../../src/config');

jest.mock('../../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/full-appeal/submit-appeal/email-address-confirmed', () => {
	let req;
	let res;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'));

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEmailConfirmed', () => {
		it('calls correct template: token valid, s78 V1 routes', async () => {
			req.session.appeal.typeOfPlanningApplication = TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL;
			isLpaInFeatureFlag.mockResolvedValueOnce(false);

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/full-appeal/submit-appeal/list-of-documents',
				bannerHtmlOverride
			});
		});

		it('calls correct template: token valid, s78 V2 routes', async () => {
			req.session.appeal.typeOfPlanningApplication = TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL;
			isLpaInFeatureFlag.mockResolvedValueOnce(true);

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/full-planning/appeal-form/before-you-start',
				bannerHtmlOverride
			});
		});

		it('calls correct template: s20', async () => {
			req.session.appeal.appealType = APPEAL_ID.PLANNING_LISTED_BUILDING;
			req.session.appeal.typeOfPlanningApplication = TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING;
			isLpaInFeatureFlag.mockResolvedValueOnce(true);

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/listed-building/appeal-form/before-you-start',
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S20'))
			});
		});
	});
});
