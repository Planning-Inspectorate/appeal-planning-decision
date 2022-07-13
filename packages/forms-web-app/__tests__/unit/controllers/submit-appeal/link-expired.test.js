const linkExpiredController = require('../../../../src/controllers/submit-appeal/link-expired');

const { VIEW } = require('../../../../src/lib/submit-appeal/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/submit-appeal/link-expired', () => {
	let req = mockReq();
	let res = mockRes();
	it('getLinkExpired method calls the correct template', async () => {
		await linkExpiredController.getLinkExpired(req, res);

		expect(res.render).toBeCalledWith(VIEW.SUBMIT_APPEAL.LINK_EXPIRED, {
			sendNewLinkUrl: '/full-appeal/submit-appeal/sent-another-link'
		});
	});
});
