const fs = require('fs');
const path = require('path');
const declarationInformationController = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration-information');
const { mockReq, mockRes } = require('../../../mocks');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/services/department.service');
const mockLogger = jest.fn();

jest.mock('../../../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    info: mockLogger,
    warn: mockLogger,
  }),
}));
describe('controllers/full-appeal/submit-appeal/declaration-information', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(null);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDeclarationInformation', () => {
    it('should return 400 if appeal id not provided', async () => {
      req.params.appealId = null;

      await declarationInformationController.getDeclarationInformation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith('error/400', {
        message: 'The appealId should be provided in the request param.',
      });
    });
    it('should return 404 if appeal not found', async () => {
      req.params.appealId = 'some-id';

      await declarationInformationController.getDeclarationInformation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.render).toHaveBeenCalledWith('error/not-found');
    });

    it('should define default value if appeal submission date is not defined', async () => {
      const fakeLpdName = 'fake lpd name here';

      req = {
        ...req,
        params: { appealId: 'some-id' },
        session: {
          appeal: {
            some: 'data',
            lpaCode: '123-abc',
          },
          appealLPD: {
            name: fakeLpdName,
          },
        },
      };

      await declarationInformationController.getDeclarationInformation(req, res);

      expect(req.session.appeal.submissionDate).not.toBeNull();
    });

    it('should call the correct template with the expected data on the happy path', async () => {
      const fakeLpdName = 'fake lpd name here';
      const submissionDate = new Date();
      req = {
        ...req,
        params: { appealId: 'some-id' },
        session: {
          appeal: {
            some: 'data',
            lpaCode: '123-abc',
            submissionDate,
          },
          appealLPD: {
            name: fakeLpdName,
          },
        },
      };

      await declarationInformationController.getDeclarationInformation(req, res);

      const css = fs.readFileSync(
        path.resolve(__dirname, '../../../../../src/public/stylesheets/main.css'),
        'utf8'
      );

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.DECLARATION_INFORMATION, {
        appeal: req.session.appeal,
        css,
        displayCookieBanner: false,
      });
    });
  });
});
