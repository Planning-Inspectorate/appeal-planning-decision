const { renderView, redirect } = require('../../../src/util/render');
const { mockRes } = require('../mocks');

describe('util/render', () => {
  let res;
  beforeEach(() => {
    res = mockRes();
    jest.resetAllMocks();
  });

  describe('render view', () => {
    it('should render the view if backlink is defined', () => {
      const view = 'mock-view';

      renderView(res, view, {
        prefix: 'appeal-questionnaire',
        backLink: `/mock-id/mock-back-link`,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });

      expect(res.render).toHaveBeenCalledWith(view, {
        backLink: `/appeal-questionnaire/mock-id/mock-back-link`,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
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
        backLink: `/appeal-questionnaire/mock-id/mock-back-link`,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });
    });
  });

  describe('redirect view', () => {
    it('should redirect the view if backlink is defined', () => {});

    it('should redirect the view if backlink is not defined', () => {});
  });
});
