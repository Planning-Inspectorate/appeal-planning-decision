const beforeYouStartController = require('../../../../src/controllers/before-you-start');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/before-you-start/before-you-start-first-page', () => {
  const req = mockReq();
  const res = mockRes();

  it('Test getBeforeYouStartFirstPage method calls the correct template', async () => {
    await beforeYouStartController.getBeforeYouStartFirstPage(req, res);

    expect(res.render).toBeCalledWith(VIEW.BEFORE_YOU_START.FIRST_PAGE, {
      nextPage: '/before-you-start/local-planning-department',
    });
  });
});
