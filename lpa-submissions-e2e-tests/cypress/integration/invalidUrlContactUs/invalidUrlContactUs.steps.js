import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  getContactUsLink,
  getEmailLink,
  getFindAboutCallChargesLink,
} from '../../support/PageObjects/invalidUrlPage-PageObjects';

const invalidUrl = '/invalid-url';
const invalidPageTitle = 'Page not found - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const invalidPageHeading = 'Page not found';
const contactUsPageUrl = '/contact-us';
const contactUsPageTitle = 'Contact us - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const contactUsPageHeading = 'Contact us';

Given('user has navigated to an invalid page',()=>{
  cy.goToPage(invalidUrl, {failOnStatusCode:false});
  cy.verifyPage(invalidUrl);
  cy.verifyPageTitle(invalidPageTitle);
  cy.verifyPageHeading(invalidPageHeading);
});

Given('user has navigated to contact us page',()=>{
  cy.verifyPageTitle(contactUsPageTitle);
  cy.verifyPageHeading(contactUsPageHeading);
});

When('user selects to contact the Planning Inspectorate',()=>{
  getContactUsLink().click();
});

When('user selects to find out about call charges',()=>{
  getFindAboutCallChargesLink().click();
});

When('user selects to email planning inspectorate',()=>{
  getEmailLink().click();
});

Then('the contact us page will be displayed',()=>{
  cy.verifyPage(contactUsPageUrl);
  cy.verifyPageTitle(contactUsPageTitle);
  cy.verifyPageHeading(contactUsPageHeading);
});

Then('user is navigated to call charges page',()=>{
  cy.verifyPageTitle('Call charges and phone numbers - GOV.UK');
  cy.verifyPageHeading('Call charges and phone numbers');
});

Then('user is able to send an email',()=>{
 getEmailLink()
    .should('have.attr', 'href')
    .and('include', 'mailto:enquiries@planninginspectorate.gov.uk');
});
