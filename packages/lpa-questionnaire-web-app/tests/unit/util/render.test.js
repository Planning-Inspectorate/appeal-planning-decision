const { renderView, redirect } = require('../../../src/util/render');
const { mockRes, mockReq } = require('../mocks');

describe('util/render', () => {
  let res;
  let req;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.resetAllMocks();
  });

  describe('render view', () => {
    it('should render the view if backlink is defined', () => {
      const view = 'mock-view';

      renderView(res, view, {
        prefix: 'appeal-questionnaire',
        backLink: '/mock-id/mock-back-link',
      });

      expect(res.render).toHaveBeenCalledWith(view, {
        backLink: `/appeal-questionnaire/mock-id/mock-back-link`,
      });
    });

    it('should render the view if backlink is not undefined', () => {
      const view = 'mock-view';

      renderView(res, view, {
        prefix: 'appeal-questionnaire',
        backLink: undefined,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });

      expect(res.render).toHaveBeenCalledWith(view, {
        backLink: undefined,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });
    });
  });

  describe('redirect view', () => {
    it('should redirect the view if backlink is defined', () => {
      redirect(res, 'appeal-questionnaire', 'mock-id/task-list', req.session.backLink);
      expect(res.redirect).toHaveBeenCalledWith('/appeal-questionnaire/mock-id/task-list');
    });

    it('should redirect the view if backlink is not defined', () => {
      redirect(res, 'appeal-questionnaire', 'mock-id/task-list', undefined);
      expect(res.redirect).toHaveBeenCalledWith('/appeal-questionnaire/mock-id/task-list');
    });
  });
});
