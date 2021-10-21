import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getPage } from '../../support/alreadySubmitted/getPage';
import{ findoutAboutCallCharges, enquiriesEmailLink} from '../../support/PageObjects/common-page-objects';

const page = {
  heading: 'Questionnaire already submitted',
  title: 'Questionnaire already submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'already-submitted',
}

When('the LPA Planning Officer is trying to access {string} of already submitted questionnaire', (page) => {
  cy.goToPage(getPage(page));
});

Then('the LPA Planning Officer is presented with already submitted page', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
});

Then('the Already Submitted page should have Enquiries Email link', () => {
  enquiriesEmailLink()
    .should('have.attr','href','mailto:enquiries@planninginspectorate.gov.uk');
});

Then('the Already Submitted page should have link to Call charges', () => {
  findoutAboutCallCharges()
    .should('have.attr','href','https://www.gov.uk/call-charges')
    .should('have.attr','target','_blank')
    .should('have.attr','rel','noreferrer noopener external');
});

