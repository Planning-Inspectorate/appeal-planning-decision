const {
	getLinkExpired
} = require('../../../../src/controllers/appeal-householder-decision/link-expired');

const { mockReq, mockRes } = require('../../mocks');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { LINK_EXPIRED, SENT_ANOTHER_LINK }
	}
} = require('../../../../src/lib/views');

describe('controllers/submit-appeal/link-expired', () => {
	let req = mockReq();
	let res = mockRes();
	it('getLinkExpired method calls the correct template', async () => {
		req.session.appeal.appealType = '1005';
		getLinkExpired(req, res);

		expect(res.render).toBeCalledWith(`${LINK_EXPIRED}`, {
			sendNewLinkUrl: `/${SENT_ANOTHER_LINK}`
		});
	});
});
