const linkExpiredController = require('../../../../src/controllers/appeal-householder-decision/link-expired');

const { mockReq, mockRes } = require('../../mocks');

describe('controllers/submit-appeal/link-expired', () => {
	let req = mockReq();
	let res = mockRes();
	it('getLinkExpired method calls the correct template', async () => {
		req.session.appeal.appealType = '1005';
		linkExpiredController.getLinkExpired(req, res);

		expect(res.render).toBeCalledWith('appeal-householder-decision/link-expired');
	});
});
