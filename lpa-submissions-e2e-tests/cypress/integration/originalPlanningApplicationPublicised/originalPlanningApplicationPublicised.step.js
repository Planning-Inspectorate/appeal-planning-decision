import { Before } from 'cypress-cucumber-preprocessor/steps';

const page = {
  id: 'originalPlanningApplicationPublicised',
  heading: 'Did you publicise the original planning application?',
  section: 'Optional supporting documents',
  title:
    'Original planning application publicity - Appeal questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'application-publicity',
  emptyError: 'Select yes if you publicised the original plan',
};

Before(() => {
  cy.wrap(page).as('page');
});
