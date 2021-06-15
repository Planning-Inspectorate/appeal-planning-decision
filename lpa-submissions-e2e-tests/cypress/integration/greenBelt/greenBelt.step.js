import { Before } from 'cypress-cucumber-preprocessor/steps';

const page = {
  id: 'greenBelt',
  heading: 'Is the appeal site in a green belt?',
  section: 'About the Appeal Site',
  title:
    'Is the appeal site in a greenbelt? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'green-belt',
  emptyError: 'Select yes if the appeal site is in a green belt',
};

Before(() => {
  cy.wrap(page).as('page');
});
