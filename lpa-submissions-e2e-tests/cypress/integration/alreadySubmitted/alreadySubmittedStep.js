import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getPage } from '../../support/alreadySubmitted/getPage';
import{ findoutAboutCallCharges, pinsEnquiriesEmailLink} from '../../support/PageObjects/common-page-objects';

const page = {
  heading: 'Questionnaire already submitted',
  title: 'Questionnaire already submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'already-submitted',
}

When('LPA Planning Officer is trying to access {string} of already submitted questionnaire', (page) => {
  cy.goToPage(getPage(page));
});

Then('LPA Planning Officer is presented with already submitted page', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.get('[data-cy="call-charges"]').invoke('attr', 'href').then((href) => {
    expect(href).to.contain("https://www.gov.uk/call-charges");
  });
});

Then('Already Submitted page should have PINS Enquiries Email link', () => {
  pinsEnquiriesEmailLink()
    .should('have.attr','href','mailto:enquiries@planninginspectorate.gov.uk');
});

Then('Already Submitted page should have link to Call charges', () => {
  findoutAboutCallCharges()
    .should('have.attr','href','https://www.gov.uk/call-charges')
    .should('have.attr','target','_blank')
    .should('have.attr','rel','noreferrer noopener');
});

