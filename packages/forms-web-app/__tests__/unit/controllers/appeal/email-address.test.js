const { get } = require('../../../../src/controllers/appeal/email-address');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/appeal/email-address', () => {
	const req = mockReq();
	const res = mockRes();

	it('Test get method calls the correct template', async () => {
		await get(req, res);

		expect(res.render).toBeCalledWith(VIEW.APPEAL.EMAIL_ADDRESS);
	});
});
