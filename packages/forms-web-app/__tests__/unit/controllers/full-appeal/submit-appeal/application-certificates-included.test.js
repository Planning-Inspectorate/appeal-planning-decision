const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');

const {
  getApplicationCertificatesIncluded,
  postApplicationCertificatesIncluded,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/application-certificates-included');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');

const errors = {
  'did-you-submit-separate-certificate': {
    value: undefined,
    msg: 'Select yes if you submitted a separate ownership certificate and agricultural land declaration',
    param: 'did-you-submit-separate-certificate',
    location: 'body',
  },
};
const errorSummary = [
  {
    text: 'Select yes if you submitted a separate ownership certificate and agricultural land declaration',
    href: '#did-you-submit-separate-certificate',
  },
];
const backLink = `/${VIEW.FULL_APPEAL.APPLICATION_FORM}`;

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/application-certificates-included', () => {
  let req;
  let res;

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getApplicationCertificatesIncluded', () => {
    it('calls correct template', async () => {
      req.session.appeal.planningApplicationDocumentsSection.ownershipCertificate.submittedSeparateCertificate =
        null;
      await getApplicationCertificatesIncluded(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
        backLink,
        submittedSeparateCertificate: null,
      });
    });
  });

  describe('postApplicationCertificatesIncluded', () => {
    it('should re-render the template with errors if submission validtion fails', async () => {
      req = {
        ...req,
        session: {
          appeal: {
            planningApplicationDocumentsSection: {
              ownershipCertificate: {
                submittedSeparateCertificate: true,
              },
            },
          },
        },
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

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postApplicationCertificatesIncluded(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.APPLICATION_CERTIFICATES_INCLUDED, {
        submittedSeparateCertificate: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('it should redirect to the correct page if did-you-submit-separate-certificate is yes', async () => {
      req = {
        ...req,
        body: {
          'did-you-submit-separate-certificate': 'yes',
        },
      };
      await postApplicationCertificatesIncluded(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.CERTIFICATES}`);
    });

    it('it should redirect to the correct page if did-you-submit-separate-certificate is no', async () => {
      req = {
        ...req,
        body: {
          'did-you-submit-separate-certificate': 'no',
        },
      };
      await postApplicationCertificatesIncluded(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.APPLICATION_NUMBER}`);
    });
  });
});
