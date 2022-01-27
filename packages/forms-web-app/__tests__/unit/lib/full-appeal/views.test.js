const { VIEW } = require('../../../../src/lib/full-appeal/views');

describe('/lib/full-appeal/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        TASK_LIST: 'full-appeal/submit-appeal/task-list',
        CHECK_ANSWERS: 'full-appeal/submit-appeal/check-answers',
        CONTACT_DETAILS: 'full-appeal/submit-appeal/contact-details',
        APPLICATION_FORM: 'full-appeal/submit-appeal/application-form',
        APPLICATION_NUMBER: 'full-appeal/submit-appeal/application-number',
        DESIGN_ACCESS_STATEMENT: 'full-appeal/submit-appeal/design-access-statement',
        DESIGN_ACCESS_STATEMENT_SUBMITTED:
          'full-appeal/submit-appeal/design-access-statement-submitted',
        DECISION_LETTER: 'full-appeal/submit-appeal/decision-letter',
        APPEAL_SITE_ADDRESS: 'full-appeal/submit-appeal/appeal-site-address',
        OWN_ALL_THE_LAND: 'full-appeal/submit-appeal/own-all-the-land',
        APPLICANT_NAME: 'full-appeal/submit-appeal/applicant-name',
        APPEAL_STATEMENT: 'full-appeal/submit-appeal/appeal-statement',
        PLANS_DRAWINGS: 'full-appeal/plans-drawings',
        ORIGINAL_APPLICANT: 'full-appeal/submit-appeal/original-applicant',
        OWN_SOME_OF_THE_LAND: 'full-appeal/submit-appeal/own-some-of-the-land',
        KNOW_THE_OWNERS: 'full-appeal/submit-appeal/know-the-owners',
        AGRICULTURAL_HOLDING: 'full-appeal/submit-appeal/agricultural-holding',
        TELLING_THE_LANDOWNERS: 'full-appeal/submit-appeal/telling-the-landowners',
        IDENTIFYING_THE_OWNERS: 'full-appeal/submit-appeal/identifying-the-owners',
        ARE_YOU_A_TENANT: 'full-appeal/submit-appeal/are-you-a-tenant',
        VISIBLE_FROM_ROAD: 'full-appeal/submit-appeal/visible-from-road',
        OTHER_TENANTS: 'full-appeal/submit-appeal/other-tenants',
        TELLING_THE_TENANTS: 'full-appeal/submit-appeal/telling-the-tenants',
        DECLARATION: 'full-appeal/submit-appeal/declaration',
        APPEAL_SUBMITTED: 'full-appeal/submit-appeal/appeal-submitted',
        DECLARATION_INFORMATION: 'full-appeal/submit-appeal/declaration-information',
      },
    });
  });
});
