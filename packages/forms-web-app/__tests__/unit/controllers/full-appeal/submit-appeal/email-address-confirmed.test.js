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
const { FLAG } = require('@pins/common/src/feature-flags');

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
			isLpaInFeatureFlag.mockImplementation(() => {
				return false;
			});

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/full-appeal/submit-appeal/list-of-documents',
				bannerHtmlOverride
			});
		});

		it('calls correct template: token valid, s78 V2 routes', async () => {
			req.session.appeal.typeOfPlanningApplication = TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL;
			req.session.appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2;
			});
			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/full-planning/appeal-form/before-you-start',
				bannerHtmlOverride
			});
		});

		it('calls correct template: s20', async () => {
			req.session.appeal.appealType = APPEAL_ID.PLANNING_LISTED_BUILDING;
			req.session.appeal.typeOfPlanningApplication = TYPE_OF_PLANNING_APPLICATION.LISTED_BUILDING;
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.S78_APPEAL_FORM_V2;
			});

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/listed-building/appeal-form/before-you-start',
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S20'))
			});
		});

		it('calls correct template: cas planning', async () => {
			req.session.appeal.appealType = APPEAL_ID.MINOR_COMMERCIAL;
			req.session.appeal.typeOfPlanningApplication =
				TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT;
			isLpaInFeatureFlag.mockImplementation((_, flag) => {
				return flag === FLAG.CAS_PLANNING_APPEAL_FORM_V2;
			});

			await getEmailConfirmed(req, res);
			expect(res.render).toHaveBeenCalledWith(EMAIL_CONFIRMED, {
				listOfDocumentsUrl: '/appeals/cas-planning/appeal-form/before-you-start',
				bannerHtmlOverride:
					config.betaBannerText +
					config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('CAS_PLANNING'))
			});
		});
	});
});
