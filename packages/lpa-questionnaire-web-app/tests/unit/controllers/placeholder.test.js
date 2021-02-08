const placeholderController = require('../../../src/controllers/placeholder');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/placeholder', () => {
  it('Renders the correct view', () => {
    const req = {
      ...mockReq(),
      params: {
        id: '123-abc',
      },
    };
    const res = mockRes();

    placeholderController.getPlaceholder(req, res);

    expect(res.render).toHaveBeenCalledWith(VIEW.PLACEHOLDER, { appeal: null });
  });
});
