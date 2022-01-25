const { use } = require('../../router-mock');
const taskListRouter = require('../../../../../src/routes/full-appeal/submit-appeal/task-list');
const checkAnswersRouter = require('../../../../../src/routes/full-appeal/submit-appeal/check-answers');
const contactDetailsRouter = require('../../../../../src/routes/full-appeal/submit-appeal/contact-details');
const applicationFormRouter = require('../../../../../src/routes/full-appeal/submit-appeal/application-form');
const applicationNumberRouter = require('../../../../../src/routes/full-appeal/submit-appeal/application-number');
const designAccessStatementRouter = require('../../../../../src/routes/full-appeal/submit-appeal/design-access-statement');
const designAccessStatementSubmittedRouter = require('../../../../../src/routes/full-appeal/submit-appeal/design-access-statement-submitted');
const applicationSiteAddressRouter = require('../../../../../src/routes/full-appeal/submit-appeal/appeal-site-address');
const applicantNameRouter = require('../../../../../src/routes/full-appeal/submit-appeal/applicant-name');
const decisionLetterRouter = require('../../../../../src/routes/full-appeal/submit-appeal/decision-letter');
const appealStatementRouter = require('../../../../../src/routes/full-appeal/submit-appeal/appeal-statement');
const originalApplicantRouter = require('../../../../../src/routes/full-appeal/submit-appeal/original-applicant');
const ownSomeOfTheLandRouter = require('../../../../../src/routes/full-appeal/submit-appeal/own-some-of-the-land');
const ownAllTheLandRouter = require('../../../../../src/routes/full-appeal/submit-appeal/own-all-the-land');
const knowTheOwnersRouter = require('../../../../../src/routes/full-appeal/submit-appeal/know-the-owners');
const agriculturalHoldingRouter = require('../../../../../src/routes/full-appeal/submit-appeal/agricultural-holding');

describe('routes/full-appeal/submit-appeal/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal');
  });

  it('should define the expected routes', () => {
    expect(use.mock.calls.length).toBe(16);
    expect(use).toHaveBeenCalledWith(taskListRouter);
    expect(use).toHaveBeenCalledWith(checkAnswersRouter);
    expect(use).toHaveBeenCalledWith(contactDetailsRouter);
    expect(use).toHaveBeenCalledWith(applicationFormRouter);
    expect(use).toHaveBeenCalledWith(applicationNumberRouter);
    expect(use).toHaveBeenCalledWith(designAccessStatementRouter);
    expect(use).toHaveBeenCalledWith(designAccessStatementSubmittedRouter);
    expect(use).toHaveBeenCalledWith(applicationSiteAddressRouter);
    expect(use).toHaveBeenCalledWith(applicantNameRouter);
    expect(use).toHaveBeenCalledWith(decisionLetterRouter);
    expect(use).toHaveBeenCalledWith(appealStatementRouter);
    expect(use).toHaveBeenCalledWith(originalApplicantRouter);
    expect(use).toHaveBeenCalledWith(ownSomeOfTheLandRouter);
    expect(use).toHaveBeenCalledWith(ownAllTheLandRouter);
    expect(use).toHaveBeenCalledWith(knowTheOwnersRouter);
    expect(use).toHaveBeenCalledWith(agriculturalHoldingRouter);
  });
});
