const checkAppealTypeExists = require('../../../src/middleware/check-appeal-type-exists');
const { featureFlag } = require('../../../src/config');

jest.mock('../../../src/config', () => ({
  featureFlag: {
    newAppealJourney: true,
  },
  logger: {
    level: 'info',
  },
}));

describe('middleware/check-appeal-type-exists', () => {
  let req;

  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    req = {
      session: {
        appeal: {},
      },
      originalUrl: '/',
    };
  });

  it('should call next() for the `/before-you-start/local-planning-department` page', () => {
    req.originalUrl = '/before-you-start/local-planning-department';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should call next() for the `/before-you-start/type-of-planning-application` page', () => {
    req.originalUrl = '/before-you-start/type-of-planning-application';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should call next() for the `/before-you-start/use-a-different-service` page', () => {
    req.originalUrl = '/before-you-start/use-a-different-service';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should call next() for the `/appellant-submission/submission-information/6e1195ad-176d-4ca3-a944-525218780a7e` page', () => {
    req.originalUrl =
      '/appellant-submission/submission-information/6e1195ad-176d-4ca3-a944-525218780a7e';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should call next() for the `/full-appeal/submit-appeal/declaration-information/6e1195ad-176d-4ca3-a944-525218780a7e` page', () => {
    req.originalUrl =
      '/full-appeal/submit-appeal/declaration-information/6e1195ad-176d-4ca3-a944-525218780a7e';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should call next() if appealType is set', () => {
    req.session.appeal.appealType = '1005';
    checkAppealTypeExists(req, res, next);
    expect(next).toBeCalled();
    expect(res.redirect).not.toBeCalled();
  });

  it('should redirect to the `/before-you-start/local-planning-department` page if the page is not in allowList and the appealType is not set', () => {
    delete req.session.appeal.appealType;
    req.originalUrl = '/full-appeal/submit-appeal/task-list';
    checkAppealTypeExists(req, res, next);
    expect(res.redirect).toBeCalledWith('/before-you-start/local-planning-department');
  });

  it('should redirect to the `/before-you-start/local-planning-department` page if req.session is not set', () => {
    delete req.session;
    req.originalUrl = '/full-appeal/submit-appeal/task-list';
    checkAppealTypeExists(req, res, next);
    expect(res.redirect).toBeCalledWith('/before-you-start/local-planning-department');
  });

  it('should redirect to the `/before-you-start/local-planning-department` page if req.session.appeal is not set', () => {
    delete req.session.appeal;
    req.originalUrl = '/full-appeal/submit-appeal/task-list';
    checkAppealTypeExists(req, res, next);
    expect(res.redirect).toBeCalledWith('/before-you-start/local-planning-department');
  });

  it('should redirect to the `/before-you-start/local-planning-department` page if req.session.appeal is null', () => {
    req.session.appeal = null;
    req.originalUrl = '/full-appeal/submit-appeal/task-list';
    checkAppealTypeExists(req, res, next);
    expect(res.redirect).toBeCalledWith('/before-you-start/local-planning-department');
  });
});
