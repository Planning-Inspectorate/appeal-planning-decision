const { VIEW } = require('../../../../src/lib/full-appeal/views');

describe('/lib/full-appeal/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        TASK_LIST: 'full-appeal/submit-appeal/task-list',
        CHECK_YOUR_ANSWERS: 'full-appeal/submit-appeal/check-your-answers',
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
        PLANS_DRAWINGS: 'full-appeal/submit-appeal/plans-drawings',
        PROPOSED_DEVELOPMENT_CHANGED: 'full-appeal/submit-appeal/proposed-development-changed',
        ORIGINAL_APPLICANT: 'full-appeal/submit-appeal/original-applicant',
        OWN_SOME_OF_THE_LAND: 'full-appeal/submit-appeal/own-some-of-the-land',
        KNOW_THE_OWNERS: 'full-appeal/submit-appeal/know-the-owners',
        AGRICULTURAL_HOLDING: 'full-appeal/submit-appeal/agricultural-holding',
        TELLING_THE_LANDOWNERS: 'full-appeal/submit-appeal/telling-the-landowners',
        IDENTIFYING_THE_OWNERS: 'full-appeal/submit-appeal/identifying-the-owners',
        ARE_YOU_A_TENANT: 'full-appeal/submit-appeal/are-you-a-tenant',
        CAN_USE_SERVICE_FULL_APPEAL: 'full-appeal/can-use-service',
        VISIBLE_FROM_ROAD: 'full-appeal/submit-appeal/visible-from-road',
        OTHER_TENANTS: 'full-appeal/submit-appeal/other-tenants',
        TELLING_THE_TENANTS: 'full-appeal/submit-appeal/telling-the-tenants',
        DECLARATION: 'full-appeal/submit-appeal/declaration',
        APPEAL_SUBMITTED: 'full-appeal/submit-appeal/appeal-submitted',
        DECLARATION_INFORMATION: 'full-appeal/submit-appeal/declaration-information',
        HEALTH_SAFETY_ISSUES: 'full-appeal/submit-appeal/health-safety-issues',
        ADVERTISING_YOUR_APPEAL: 'full-appeal/submit-appeal/advertising-your-appeal',
        NEW_PLANS_DRAWINGS: 'full-appeal/submit-appeal/new-plans-drawings',
        SUPPORTING_DOCUMENTS: 'full-appeal/submit-appeal/supporting-documents',
        NEW_SUPPORTING_DOCUMENTS: 'full-appeal/submit-appeal/new-supporting-documents',
        HOW_DECIDE_APPEAL: 'full-appeal/submit-appeal/how-decide-appeal',
        WHY_HEARING: 'full-appeal/submit-appeal/why-hearing',
        WHY_INQUIRY: 'full-appeal/submit-appeal/why-inquiry',
        DRAFT_STATEMENT_COMMON_GROUND: 'full-appeal/submit-appeal/draft-statement-common-ground',
        EXPECT_ENQUIRY_LAST: 'full-appeal/submit-appeal/expect-inquiry-last',
        PLANS_DRAWINGS_DOCUMENTS: 'full-appeal/submit-appeal/plans-drawings-documents',
        ORIGINAL_DECISION_NOTICE: 'full-appeal/submit-appeal/original-decision-notice',
      },
    });
  });
});
