const {
	getAppealStatement,
	postAppealStatement
} = require('../../../../src/controllers/eligibility/appeal-statement');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

const req = mockReq();
const res = mockRes();

describe('controllers/eligibility/appeal-statement', () => {
	describe('getNoDecision', () => {
		it('should call the correct template', () => {
			getAppealStatement(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.APPEAL_STATEMENT, {
				bannerHtmlOverride: config.betaBannerText
			});
		});
	});

	describe('postAppealStatement', () => {
		it('should redirect ', () => {
			postAppealStatement(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
		});
	});
});
