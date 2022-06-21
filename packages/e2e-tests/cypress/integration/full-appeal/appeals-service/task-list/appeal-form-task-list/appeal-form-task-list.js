import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  applicationStatusDetailedText,
  applicationStatusText,
  linkProvideYourContactDetails,
  linkTellAboutTheAppealSite,
  linkUploadDocsFromPlanningApplication,
  linkUploadDocsForYourAppeal,
  linkCheckYourAnswers,
  statusProvideYourContactDetails,
  statusTellAboutTheAppealSite,
  statusUploadDocsFromPlanningApplication,
  statusUploadDocsForYourAppeal,
  statusCheckYourAnswers,
  linkDecideYourAppeal,
  linkAppealDecisionSection,
  statusAppealDecisionSection,
} from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import {
  appealDocumentsSectionLink,
  contactDetailsLink,
  planningApplicationDocumentsLink,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import { getSaveAndContinueButton } from '../../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { originalApplicantYes } from '../../../../../support/full-appeal/appeals-service/page-objects/original-applicant-or-not-po';
import { getBackLink, getFileUploadButton } from '../../../../../support/common-page-objects/common-po';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { selectHearing } from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import { checkboxConfirmSensitiveInfo } from '../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';

const pageHeading = 'Appeal a planning decision';
const url = 'full-appeal/submit-appeal/task-list';
const decideYourAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const originalApplicantUrl = 'full-appeal/submit-appeal/original-applicant';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const ownAllLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const howDecideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const whyHearingUrl = 'full-appeal/submit-appeal/why-hearing';
const applicationCertificatesUrl = 'full-appeal/submit-appeal/application-certificates-included';
const planningApplicationFormUrl = 'full-appeal/submit-appeal/application-form';
const plansAndDrawingsUrl = 'full-appeal/submit-appeal/plans-drawings';
const appealStatementUrl = 'full-appeal/submit-appeal/appeal-statement';
const pageTitle = 'Appeal a planning decision - Appeal a planning decision - GOV.UK';
const addressLine1 = '1 Bradmore way';
const postcode = 'RG61BA';
const filename = 'upload-file-valid.jpeg';

Given('Appellant has been successful on their eligibility', () => {
  cy.url().should('contain', url);
});
When("they are on the 'Appeal a Planning Decision' page", () => {
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});
Then(
  'they are presented with the list of tasks that they are required to complete in order to submit their appeal',
  () => {
    linkProvideYourContactDetails().should('exist');
    statusProvideYourContactDetails().should('exist');
    linkTellAboutTheAppealSite().should('exist');
    statusTellAboutTheAppealSite().should('exist');
    linkDecideYourAppeal().should('exist');
    linkUploadDocsFromPlanningApplication().should('exist');
    statusUploadDocsFromPlanningApplication().should('exist');
    linkUploadDocsForYourAppeal().should('exist');
    // the below step needs tp be executed when the status is displayed
    //statusUploadDocsForYourAppeal().should('exist');
    linkCheckYourAnswers().should('exist');
    statusCheckYourAnswers().should('exist');
  },
);
Then('the status of the sections should be {string}', (progress) => {
  statusProvideYourContactDetails().should('contain.text', progress);
  statusTellAboutTheAppealSite().should('contain.text', progress);
  statusAppealDecisionSection().should('contain.text', progress);
  statusUploadDocsFromPlanningApplication().should('contain.text', progress);
  statusUploadDocsForYourAppeal().should('contain.text', progress);
});
Then("the status of 'Check your answers and submit your appeal' should be {string}", (progress) => {
  statusCheckYourAnswers().should('contain.text', progress);
});
When(
  "they click on 'Provide your contact details' section and are on 'Original Applicant' page",
  () => {
    contactDetailsLink().click();
    cy.url().should('contain', originalApplicantUrl);
  },
);
When(
  "they select 'Yes, the planning application was made in my name' and click Continue button",
  () => {
    originalApplicantYes().click();
    getSaveAndContinueButton().click();
  },
);
When("they use 'Back' link to navigate back to the Task list page from 'Contact Details'", () => {
  cy.url().should('contain', 'full-appeal/submit-appeal/contact-details');
  getBackLink().click();
  cy.url().should('contain', originalApplicantUrl);
  getBackLink().click();
});
Then("status of the 'Provide your contact details' section should be {string}", (progress) => {
  cy.url().should('contain', url);
  statusProvideYourContactDetails().should('contain.text', progress);
});
Then(
  'when a section has been completed they are able to see what has been completed or incompleted',
  () => {
    applicationStatusText().should('exist');
    applicationStatusDetailedText().should('exist');
  },
);
Given('that user is on the Appeal a Planning Decision task list', () => {
  cy.url().should('contain', 'full-appeal/submit-appeal/task-list');
});
When("the user click on 'Tell us how you would prefer us to decide your appeal'", () => {
  linkDecideYourAppeal().click();
});
Then("the user is taken to the 'How would you prefer us to decide your appeal? page", () => {
  cy.url().should('include', decideYourAppealUrl);
});
When(
  "they click on 'Tell us about the appeal site' section and are on the 'Site Address' page",
  () => {
    linkTellAboutTheAppealSite().click();
    cy.url().should('contain', siteAddressUrl);
  },
);
When('they enter Site address and click Continue button', () => {
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
});
When(
  "they use 'Back' link to navigate back to the Task list page from 'Own all the land' page",
  () => {
    cy.url().should('contain', ownAllLandUrl);
    getBackLink().click();
    cy.url().should('contain', siteAddressUrl);
    getBackLink().click();
  },
);
Then("status of the 'Tell us about the appeal site' section should be {string}", (progress) => {
  cy.url().should('contain', url);
  statusTellAboutTheAppealSite().should('contain.text', progress);
});
When(
  "they click on 'Tell us how you would prefer us to decide your appeal' section and are on the 'Decide your appeal' page",
  () => {
    linkDecideYourAppeal().click();
    cy.url().should('contain', howDecideAppealUrl);
  },
);
When("they select 'Hearing' and click Continue button", () => {
  selectHearing().click();
  getSaveAndContinueButton().click();
});
When(
  "they use 'Back' link to navigate back to the Task list page from 'Prefer a hearing' page",
  () => {
    cy.url().should('contain', whyHearingUrl);
    getBackLink().click();
    cy.url().should('contain', howDecideAppealUrl);
    getBackLink().click();
  },
);
Then(
  "status of the 'Tell us how you would prefer us to decide your appeal' section should be {string}",
  (progress) => {
    cy.url().should('contain', url);
    statusAppealDecisionSection().should('contain.text', progress);
  },
);
When(
  "they click on 'Upload documents from your planning application' section and are on the 'Planning application form' page",
  () => {
    planningApplicationDocumentsLink().click();
    cy.url().should('contain', planningApplicationFormUrl);
  },
);
When('they upload a valid file and click Continue button', () => {
  getFileUploadButton().attachFile(filename);
  getSaveAndContinueButton().click();
});
When(
  "they use 'Back' link to navigate back to the Task list page from 'Does the application form include site ownership and agricultural holdings certificate' page",
  () => {
    cy.url().should('contain', applicationCertificatesUrl);
    getBackLink().click();
    cy.url().should('contain', planningApplicationFormUrl);
    getBackLink().click();
  },
);
Then("status of the 'Upload documents from your planning application' section should be {string}", (progress) => {
  cy.url().should('contain', url);
  statusUploadDocsFromPlanningApplication().should('contain.text',progress );
});
When("they click on 'Upload documents for your appeal' section and are on the 'Your appeal statement' page", () => {
  appealDocumentsSectionLink().click();
  cy.url().should('contain', appealStatementUrl);
});
When("they use 'Back' link to navigate back to the Task list page from 'New plans or drawings' page", () => {
  cy.url().should('contain', plansAndDrawingsUrl);
  getBackLink().click();
  cy.url().should('contain', appealStatementUrl);
  getBackLink().click();
});
Then("status of the 'Upload documents for your appeal' section should be {string}", (progress) => {
  cy.url().should('contain', url);
  statusUploadDocsForYourAppeal().should('contain.text',progress );
});
When("they upload a valid file with no sensitive information and click Continue button", () => {
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
})
