const appeal = require('@pins/business-rules/test/data/full-appeal');

const {
  getApplicationCertificatesIncluded,
  postApplicationCertificatesIncluded,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/application-certificates-included');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

const errors = {
  'do-you-have-certificates': {
    value: undefined,
    msg: 'Select your site ownership and agricultural holdings certificate',
    param: 'do-you-have-certificates',
    location: 'body',
  },
};
const errorSummary = [
  {
    text: 'Select your site ownership and agricultural holdings certificate',
    href: '#do-you-have-certificates',
  },
];
const backLink = `/${VIEW.FULL_APPEAL.APPLICATION_FORM}`;

describe('controllers/full-appeal/submit-appeal/application-certificates-included', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getApplicationCertificatesIncluded', () => {
    it('calls correct template', async () => {
      await getApplicationCertificatesIncluded(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
        backLink,
      });
    });
  });

  describe('postApplicationCertificatesIncluded', () => {
    it('should re-render the template with errors if submission validtion fails', async () => {
      req = {
        ...req,
        body: {
          errors,
          errorSummary,
        },
      };
      await postApplicationCertificatesIncluded(req, res);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
        errors,
        errorSummary,
        backLink,
      });
    });

    it('it should redirect to the correct page if do-you-have-certificates is yes', async () => {
      req = {
        ...req,
        body: {
          'do-you-have-certificates': 'yes',
        },
      };
      await postApplicationCertificatesIncluded(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.APPLICATION_NUMBER}`);
    });

    it('it should redirect to the correct page if do-you-have-certificates is no', async () => {
      req = {
        ...req,
        body: {
          'do-you-have-certificates': 'no',
        },
      };
      await postApplicationCertificatesIncluded(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.CERTIFICATES}`);
    });
  });
});
