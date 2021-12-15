import { When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { getPage } from '../../../../support/householder-planning/lpa-questionnaire/alreadySubmitted/getPage';
import{ findoutAboutCallCharges, enquiriesEmailLink} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/common-page-objects';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

const page = {
  heading: 'Questionnaire already submitted',
  title: 'Questionnaire already submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'already-submitted',
}
Before(() => {
  cy.wrap(page).as('page');
});

When('the LPA Planning Officer is trying to access {string} of already submitted questionnaire', (page) => {
  goToLPAPage(getPage(page));
});

Then('the LPA Planning Officer is presented with already submitted page', () => {
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
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

