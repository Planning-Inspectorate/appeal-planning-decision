import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getContactUsLink,
  getEmailLink,
  getFindAboutCallChargesLink,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/invalidUrlPage-PageObjects';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const invalidUrl = `${Cypress.env('LPA_BASE_URL')}/invalid-url`;
const invalidPageTitle = 'Page not found - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const invalidPageHeading = 'Page not found';
const contactUsPageUrl = `${Cypress.env('LPA_BASE_URL')}/contact-us`;
const contactUsPageTitle = 'Contact us - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const contactUsPageHeading = 'Contact us';

Given('user has navigated to an invalid page',()=>{
  cy.visit(invalidUrl,{failOnStatusCode:false});

  verifyPage(invalidUrl);
  verifyPageTitle(invalidPageTitle);
  verifyPageHeading(invalidPageHeading);
});

Given('user has navigated to contact us page',()=>{
  cy.visit(contactUsPageUrl, {failOnStatusCode:false});
  getContactUsLink().click();
  verifyPageTitle(contactUsPageTitle);
  verifyPageHeading(contactUsPageHeading);
});

When('user selects to contact the Planning Inspectorate',()=>{
  getContactUsLink().click();
});

Then('user selects to find out about call charges',()=>{
  getFindAboutCallChargesLink()
    .should('have.attr','href','https://www.gov.uk/call-charges')
    .should('have.attr','target','_blank')
    .should('have.attr','rel','noreferrer noopener');
});

Then('user selects to email planning inspectorate',()=>{
  getEmailLink().should('have.attr','href','mailto:enquiries@planninginspectorate.gov.uk');
});

Then('the contact us page will be displayed',()=>{
  verifyPage(contactUsPageUrl);
  verifyPageTitle(contactUsPageTitle);
  verifyPageHeading(contactUsPageHeading);
});

// Then('user is navigated to call charges page',()=>{
//   verifyPageTitle('Call charges and phone numbers - GOV.UK');
//   verifyPageHeading('Call charges and phone numbers');
// });

Then('user is able to send an email',()=>{
 getEmailLink()
    .should('have.attr', 'href')
    .and('include', 'mailto:enquiries@planninginspectorate.gov.uk');
});
