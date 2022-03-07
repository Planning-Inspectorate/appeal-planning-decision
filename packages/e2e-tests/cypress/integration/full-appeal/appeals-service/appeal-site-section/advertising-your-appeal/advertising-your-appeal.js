import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  aboutAppealSiteSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  provideAddressLine1,
} from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import {
  getBackLink,
  getErrorMessageSummary,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  advertisingYourAppealForKnowNoneOfTheLandownersText,
  advertisingYourAppealForKnowNoneOfTheOtherLandownersText,
  advertisingYourAppealForKnowSomeOfTheLandownersText, advertisingYourAppealForKnowSomeOfTheOtherLandownersText,
  advertisingYourAppealFormInAnnex,
  advertisingYourAppealToldAboutAppeal,
  advertisingYourAppealUseCopyOfTheForm,
  advertisingYourAppealWithinLast21Days,
  checkBoxIdentifyingTheOwners,
  errorMessageAdvertisingYourAppeal,
  selectNo,
  selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { selectTheOwners } from '../../../../../support/full-appeal/appeals-service/selectTheOwners';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';

const ownSomeOfLandUrl = 'full-appeal/submit-appeal/own-some-of-the-land';
const ownAllOfLandUrl = 'full-appeal/submit-appeal/own-all-the-land';
const siteAddressUrl = 'full-appeal/submit-appeal/appeal-site-address';
const knowTheOwnersUrl = 'full-appeal/submit-appeal/know-the-owners';
const identifyingTheOwnersUrl = 'full-appeal/submit-appeal/identifying-the-owners';
const tellingTheLandownersUrl = 'full-appeal/submit-appeal/telling-the-landowners';
const agriculturalHoldingUrl = 'full-appeal/submit-appeal/agricultural-holding'
const addressLine1 = '10 Bradmore Way';
const postcode = 'RG6 1BC';
const url = 'full-appeal/submit-appeal/advertising-your-appeal';
const pageHeading = 'Advertising your appeal';
const pageTitle = 'Advertising your appeal - Appeal a planning decision - GOV.UK';
const advertisingYourAppealCaption = 'Tell us about the appeal site';
const pageHeadingTellingTheLandowners = 'Telling the landowners';
const pageHeadingTellingTheOtherLandowners = 'Telling the other landowners';
const pageHeadingAgriculturalHolding = 'Is the appeal site part of an agricultural holding?';


Given('an appellant is on the Do you know who owns the land involved in the appeal page for {string}', (landowners) => {
  aboutAppealSiteSectionLink().click();
  cy.url().should('contain', siteAddressUrl);
  provideAddressLine1(addressLine1);
  providePostcode(postcode);
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownAllOfLandUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', ownSomeOfLandUrl);
  if (landowners === 'Telling the landowners') {
    selectNo().click();
  } else {
    selectYes().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain', knowTheOwnersUrl);
});

Given('an appellant or agent is on the Advertising your appeal page for the {string} and {string}',(knowTheOwners,ownSomeOfTheLand)=> {
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
  }else{
    selectNo().click();
  }
  getSaveAndContinueButton().click();
  cy.url().should('contain',knowTheOwnersUrl);
  selectTheOwners(knowTheOwners);
  cy.url().should('contain',identifyingTheOwnersUrl);
  checkBoxIdentifyingTheOwners().check();
  getSaveAndContinueButton().click();
  cy.url().should('contain',url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});
When('the appellant select {string} and click continue', (option) => {
  selectTheOwners(option);
});

When('the appellant confirms that they have attempted to identify the other landowners', () => {
  cy.url().should('contain', identifyingTheOwnersUrl);
  checkBoxIdentifyingTheOwners().check();
  getSaveAndContinueButton().click();
});

When('user clicks on the Back link',()=>{
  getBackLink().click();
});


When('the user select the confirmation boxes for the {string} and click continue',(option)=>{
  let advertisingYourAppealCheckboxValues = option.split(',');
  advertisingYourAppealCheckboxValues.forEach(ele =>{
    if(ele.trim()==="I've advertised my appeal in the press"){
      advertisingYourAppealToldAboutAppeal().check();
      advertisingYourAppealToldAboutAppeal().should('be.checked');
    }else if(ele.trim()==="I've done this within the last 21 days"){
      advertisingYourAppealWithinLast21Days().check();
      advertisingYourAppealWithinLast21Days().should('be.checked');
    }else if(ele.trim()==="I used a copy of the form in annexe 2A or 2B"){
      advertisingYourAppealUseCopyOfTheForm().check();
      advertisingYourAppealUseCopyOfTheForm().should('be.checked');
    }
  })
  getSaveAndContinueButton().click();
});
Then('advertising your appeal page is displayed with guidance text for {string} and {string}', (landowners, knowTheOwners) => {
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  pageCaptionText(advertisingYourAppealCaption);
  cy.checkPageA11y();
  advertisingYourAppealFormInAnnex()
    .should('have.attr', 'href', 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/994918/eHow_To_-_Planning_18_ANNEX.pdf')
    .should('have.attr', 'target', '_blank')
    .should('have.attr', 'rel', 'noreferrer noopener');
  if (landowners === 'Telling the landowners' && knowTheOwners === "No, I do not know who owns any of the land") {
    advertisingYourAppealForKnowNoneOfTheLandownersText().should('exist');
  } else if(landowners === 'Telling the landowners' && knowTheOwners === "I know who owns some of the land"){
    advertisingYourAppealForKnowSomeOfTheLandownersText().should('exist');
  }
  else if (landowners === 'Telling the other landowners' && knowTheOwners === "No, I do not know who owns any of the land") {
    advertisingYourAppealForKnowNoneOfTheOtherLandownersText().should('exist');
  }else if(landowners === 'Telling the other landowners' && knowTheOwners === "I know who owns some of the land"){
    advertisingYourAppealForKnowSomeOfTheOtherLandownersText().should('exist');
  }
});

Then('the user is navigated to {string} page',(page) =>{

if(page==='Telling the landowners'){
  cy.url().should('contain',tellingTheLandownersUrl);
  verifyPageHeading(pageHeadingTellingTheLandowners);
}else if(page === 'Telling the other landowners'){
  cy.url().should('contain',tellingTheLandownersUrl);
  verifyPageHeading(pageHeadingTellingTheOtherLandowners);
}else{
  cy.url().should('contain', agriculturalHoldingUrl);
  verifyPageHeading(pageHeadingAgriculturalHolding);
}

});

When('the user selects none of the options and clicks continue',()=>{
  advertisingYourAppealToldAboutAppeal().should('not.be.checked');
  advertisingYourAppealWithinLast21Days().should('not.be.checked');
  advertisingYourAppealUseCopyOfTheForm().should('not.be.checked');
  getSaveAndContinueButton().click();
});

Then('an error message {string} is displayed', (errorMessage) => {
  verifyErrorMessage(errorMessage,errorMessageAdvertisingYourAppeal, getErrorMessageSummary);
});

Then('they are presented with the Identify the landowners page',()=>{
  cy.url().should('contain',identifyingTheOwnersUrl);
  checkBoxIdentifyingTheOwners().should('be.checked');
})

