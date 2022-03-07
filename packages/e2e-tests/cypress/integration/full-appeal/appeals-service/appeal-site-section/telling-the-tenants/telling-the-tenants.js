import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';
import {verifyPageTitle} from "../../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../../support/common/verify-page-heading";
import {
  aboutAppealSiteSectionLink,
  pageCaptionText
} from "../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po";
import {
  errorMessageTellingTheTenants,
  selectNo,
  selectYes, tellingTheOtherTenantsText,
  tellingTheTenantsCopyOfTheForm, tellingTheTenantsFormInAnnexe, tellingTheTenantsText,
  tellingTheTenantsToldAboutAppeal,
  tellingTheTenantsWithinLast21Days
} from "../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po";
import {
  provideAddressLine1
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1";
import {providePostcode} from "../../../../../support/common/appeal-submission-appeal-site-address/providePostcode";
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton
} from "../../../../../support/common-page-objects/common-po";
import {verifyErrorMessage} from "../../../../../support/common/verify-error-message";

const url='/full-appeal/submit-appeal/telling-the-tenants';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const agriculturalLandHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding';
const tenantOfAgriculturalLandUrl = 'full-appeal/submit-appeal/are-you-a-tenant';
const otherTenantsAgriculturalLandUrl ='/full-appeal/submit-appeal/other-tenants';
const visibleFromRoadUrl = 'full-appeal/submit-appeal/visible-from-road';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const pageHeadingTellingTheTenants = 'Telling the tenants';
const pageHeadingTellingTheOtherTenants = 'Telling the other tenants';
const pageTitleTellingTheTenants = 'Telling the tenants - Appeal a planning decision - GOV.UK';
const tellingTheTenantsCaption = 'Tell us about the appeal site';
const pageTitleTellingTheOtherTenants = 'Telling the other tenants - Appeal a planning decision - GOV.UK';

Given('an appellant or agent is on the Are you a tenant of the agricultural holding page',()=>{
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  // cy.url().should('contain', ownSomeOfLandUrl);
  // getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalLandHoldingUrl);
});

When('the appellant select {string} and click continue',(option)=>{
  cy.url().should('contain', agriculturalLandHoldingUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',tenantOfAgriculturalLandUrl);
  if(option==='Yes'){
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain',otherTenantsAgriculturalLandUrl);
    selectYes().click();
  }else{
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain',url);
  cy.checkPageA11y();
})

Given('an appellant or agent is on the {string} page',(tenant)=>{
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  // cy.url().should('contain', ownSomeOfLandUrl);
  // getSaveAndContinueButton().click();
  cy.url().should('contain', agriculturalLandHoldingUrl);
  selectYes().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain',tenantOfAgriculturalLandUrl);
  if(tenant==='Telling the other tenants'){
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain',otherTenantsAgriculturalLandUrl);
    selectYes().click();
  }else{
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain',url);
  cy.checkPageA11y();
});

When('the user select the confirmation boxes for the {string} and click continue',(checkboxOptions)=>{
  let tenantsCheckboxValues = checkboxOptions.split(',');
  tenantsCheckboxValues.forEach(ele=>{
    if((ele.trim()==="I've told all the tenants about my appeal")||(ele.trim()==="I've told all the other tenants about my appeal")){
      tellingTheTenantsToldAboutAppeal().should('not.be.checked');
      tellingTheTenantsToldAboutAppeal().check();
      tellingTheTenantsToldAboutAppeal().should('be.checked');
    }else if(ele.trim()==="I've done this within the last 21 days"){
      tellingTheTenantsWithinLast21Days().should('not.be.checked');
      tellingTheTenantsWithinLast21Days().check();
      tellingTheTenantsWithinLast21Days().should('be.checked');
    }else if(ele.trim()==="I used a copy of the form in Annexe 2a"){
      tellingTheTenantsCopyOfTheForm().should('not.be.checked');
      tellingTheTenantsCopyOfTheForm().check();
      tellingTheTenantsCopyOfTheForm().should('be.checked');
    }
  })
  getSaveAndContinueButton().click();
});

When('the user selects none of the options and clicks continue',()=>{
  tellingTheTenantsToldAboutAppeal().should('not.be.checked');
  tellingTheTenantsWithinLast21Days().should('not.be.checked');
  tellingTheTenantsCopyOfTheForm().should('not.be.checked');
  getSaveAndContinueButton().click();
});

Then('the user is navigated to Is the site visible from a public road page',()=>{
  cy.url().should('contain',visibleFromRoadUrl);
});

When('user clicks on the Back link',()=>{
  getBackLink().click();
});

Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
});

Then('they are presented with the {string} page for {string}',(page, tenant)=>{
  if(tenant === 'Telling the tenants'){
    cy.url().should('contain', tenantOfAgriculturalLandUrl);
  }else{
    cy.url().should('contain', otherTenantsAgriculturalLandUrl);
  }
});

Then('Telling the {string} page is displayed with guidance text',(tenants)=>{
  if(tenants==='Telling the tenants'){
    verifyPageTitle(pageTitleTellingTheTenants);
    verifyPageHeading(pageHeadingTellingTheTenants);
    pageCaptionText(tellingTheTenantsCaption);
    tellingTheTenantsText().should('exist');
    tellingTheTenantsFormInAnnexe()
      .should('have.attr','href','https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/994918/eHow_To_-_Planning_18_ANNEX.pdf')
      .should('have.attr','target','_blank')
      .should('have.attr','rel','noreferrer noopener');
  }else if(tenants==='Telling the other tenants'){
    verifyPageTitle(pageTitleTellingTheOtherTenants);
    verifyPageHeading(pageHeadingTellingTheOtherTenants);
    pageCaptionText(tellingTheTenantsCaption);
    tellingTheOtherTenantsText().should('exist');
    tellingTheTenantsFormInAnnexe()
      .should('have.attr','href','https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/994918/eHow_To_-_Planning_18_ANNEX.pdf')
      .should('have.attr','target','_blank')
      .should('have.attr','rel','noreferrer noopener');
  }

});
When('the user does not select the any one of the confirmation checkboxes boxes then an error message {string} is displayed', (errorMessage) => {
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);

  tellingTheTenantsToldAboutAppeal().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsToldAboutAppeal().uncheck();

  tellingTheTenantsWithinLast21Days().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsWithinLast21Days().uncheck();

  tellingTheTenantsCopyOfTheForm().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsCopyOfTheForm().uncheck();

  tellingTheTenantsToldAboutAppeal().check();
  tellingTheTenantsWithinLast21Days().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsToldAboutAppeal().uncheck();
  tellingTheTenantsWithinLast21Days().uncheck();

  tellingTheTenantsWithinLast21Days().check();
  tellingTheTenantsCopyOfTheForm().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsWithinLast21Days().uncheck();
  tellingTheTenantsCopyOfTheForm().uncheck();

  tellingTheTenantsToldAboutAppeal().check();
  tellingTheTenantsCopyOfTheForm().check();
  getSaveAndContinueButton().click();
  verifyErrorMessage(errorMessage,errorMessageTellingTheTenants, getErrorMessageSummary);
  tellingTheTenantsToldAboutAppeal().uncheck();
  tellingTheTenantsCopyOfTheForm().uncheck();
});

