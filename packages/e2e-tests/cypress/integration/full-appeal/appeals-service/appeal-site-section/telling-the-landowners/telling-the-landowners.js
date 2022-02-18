import {Given, When, Then} from 'cypress-cucumber-preprocessor/steps';
import {
  goToFullAppealSubmitAppealTaskList
} from "../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList";
import {
  aboutAppealSiteSectionLink, pageCaptionText
} from "../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po";
import {
  provideAddressLine1
} from "../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1";
import {providePostcode} from "../../../../../support/common/appeal-submission-appeal-site-address/providePostcode";
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton
} from "../../../../../support/common-page-objects/common-po";
import {
  checkBoxIdentifyingTheOwners, errorMessageTellingTheLandowners,
  selectNo,
  selectYes, tellingTheLandownersFormInAnnex, tellingTheLandownersText,
  tellingTheLandOwnersToldAboutAppeal,
  tellingTheLandOwnersUseCopyOfTheForm,
  tellingTheLandOwnersWithinLast21Days, tellingTheOtherLandownersText
} from "../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po";
import {selectRadioButton} from "../../../../../support/full-appeal/appeals-service/selectRadioButton";
import {verifyPageTitle} from "../../../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../../../support/common/verify-page-heading";
import {selectTheOwners} from "../../../../../support/full-appeal/appeals-service/selectTheOwners";
import {
  getFindAboutCallChargesLink
} from "../../../../../support/householder-planning/lpa-questionnaire/PageObjects/invalidUrlPage-PageObjects";
import {verifyErrorMessage} from "../../../../../support/common/verify-error-message";

const url ='/full-appeal/submit-appeal/telling-the-landowners';
const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const pageHeadingTellingTheLandowners = 'Telling the landowners';
const pageHeadingTellingTheOtherLandowners = 'Telling the other landowners';
const pageHeadingAgriculturalLand='Is the appeal site part of an agricultural holding?';
const pageTitleTellingTheLandowners = 'Telling the landowners - Appeal a planning decision - GOV.UK';
const tellingTheLandownersCaption = 'Tell us about the appeal site';
const pageTitleTellingTheOtherLandowners = 'Telling the other landowners - Appeal a planning decision - GOV.UK';
const pageTitleAgriculturalLand='Is the appeal site part of an agricultural holding? - Appeal a planning decision - GOV.UK';

Given('appellant has completed full appeal eligibility journey',()=>{
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given('an appellant or agent is on the Do you know who owns the land involved in the appeal page for {string}',(landowners)=>{
    aboutAppealSiteSectionLink().click();
    cy.url().should('contain', siteAddressUrl);
    provideAddressLine1(addressLine1);
    providePostcode(postcode);
    getSaveAndContinueButton().click();
    cy.url().should('contain', ownAllOfLandUrl);
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain', ownSomeOfLandUrl);
    if(landowners==='Telling the landowners'){
      selectNo().click();
    }else{
      selectYes().click();
    }
    getSaveAndContinueButton().click();
    cy.url().should('contain',knowTheOwnersUrl);
});

Given('an appellant or agent is on the Telling the landowners page for the {string} and {string}',(knowTheOwners,ownSomeOfTheLand)=>{
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownSomeOfLandUrl);
  if(ownSomeOfTheLand==='Yes'){
    selectYes().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain',knowTheOwnersUrl);
    selectTheOwners(knowTheOwners);
    if(knowTheOwners==='I know who owns some of the land'){
      checkBoxIdentifyingTheOwners().check();
      getSaveAndContinueButton().click();
    }
      cy.url().should('contain',url);
      verifyPageTitle(pageTitleTellingTheOtherLandowners);
      verifyPageHeading(pageHeadingTellingTheOtherLandowners);
  }else{
    selectNo().click();
    getSaveAndContinueButton().click();
    cy.url().should('contain',knowTheOwnersUrl);
    selectTheOwners(knowTheOwners);
    cy.url().should('contain',url);
    verifyPageTitle(pageTitleTellingTheLandowners);
    verifyPageHeading(pageHeadingTellingTheLandowners);
  }

});

When('the appellant select {string} and click continue for {string}',(option, landowners)=>{
  selectTheOwners(option);
  if(option==='I know who owns some of the land'){
    checkBoxIdentifyingTheOwners().check();
    getSaveAndContinueButton().click();
  }
  if(landowners==='Telling the landowners'){
    cy.url().should('contain',url);
    verifyPageTitle(pageTitleTellingTheLandowners);
    verifyPageHeading(pageHeadingTellingTheLandowners);
  }else if(landowners==='Telling the other landowners'){
    cy.url().should('contain',url);
    verifyPageTitle(pageTitleTellingTheOtherLandowners);
    verifyPageHeading(pageHeadingTellingTheOtherLandowners);
  }
  cy.checkPageA11y();
});


When('the user select the confirmation boxes for the {string} and click continue',(option) => {
  let landownerCheckboxValues = option.split(',');
  console.log(landownerCheckboxValues);
  landownerCheckboxValues.forEach(ele=>{
    if(ele.trim()==="I've told all the landowners about my appeal"){
      tellingTheLandOwnersToldAboutAppeal().check();
      tellingTheLandOwnersToldAboutAppeal().should('be.checked');
    }else if(ele.trim()==="I've done this within the last 21 days"){
      tellingTheLandOwnersWithinLast21Days().check();
      tellingTheLandOwnersWithinLast21Days().should('be.checked');
    }else if(ele.trim()==="I used a copy of the form in annexe 2A or 2B"){
      tellingTheLandOwnersUseCopyOfTheForm().check();
      tellingTheLandOwnersUseCopyOfTheForm().should('be.checked');
    }
  })
  getSaveAndContinueButton().click();
});

When('the user selects none of the options and clicks continue',()=>{
  tellingTheLandOwnersToldAboutAppeal().should('not.be.checked');
  tellingTheLandOwnersWithinLast21Days().should('not.be.checked');
  tellingTheLandOwnersUseCopyOfTheForm().should('not.be.checked');
  getSaveAndContinueButton().click();
});

When('user clicks on the Back link',()=>{
  getBackLink().click();
})

Then('Telling the {string} page is displayed with guidance text',(landowners)=>{
  if(landowners==='Telling the landowners'){
    verifyPageTitle(pageTitleTellingTheLandowners);
    verifyPageHeading(pageHeadingTellingTheLandowners);
    pageCaptionText(tellingTheLandownersCaption);
    tellingTheLandownersText().should('exist');
    tellingTheLandownersFormInAnnex()
      .should('have.attr','href','https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/994918/eHow_To_-_Planning_18_ANNEX.pdf')
      .should('have.attr','target','_blank')
      .should('have.attr','rel','noreferrer noopener');
  }else if(landowners==='Telling the other landowners'){
    verifyPageTitle(pageTitleTellingTheOtherLandowners);
    verifyPageHeading(pageHeadingTellingTheOtherLandowners);
    pageCaptionText(tellingTheLandownersCaption);
    tellingTheOtherLandownersText().should('exist');
    tellingTheLandownersFormInAnnex()
      .should('have.attr','href','https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/994918/eHow_To_-_Planning_18_ANNEX.pdf')
      .should('have.attr','target','_blank')
      .should('have.attr','rel','noreferrer noopener');
  }

});

Then('an error message {string} is displayed',(errorMessage)=>{
  verifyErrorMessage(errorMessage, errorMessageTellingTheLandowners, getErrorMessageSummary);
})

Then('the user is navigated to Is the appeal site part of an agricultural holding page',()=>{
verifyPageHeading(pageHeadingAgriculturalLand);
verifyPageTitle(pageTitleAgriculturalLand);
})

Then('they are presented with the Do you know who owns the land involved in the appeal page',()=>{
  cy.url().should('contain',knowTheOwnersUrl);
});
