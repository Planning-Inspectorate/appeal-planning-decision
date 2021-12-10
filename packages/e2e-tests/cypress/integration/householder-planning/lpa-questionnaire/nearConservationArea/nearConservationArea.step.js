import { Before } from 'cypress-cucumber-preprocessor/steps';

const page = {
  id: 'nearConservationArea',
  heading: 'Is the appeal site in or near a conservation area?',
  section: 'About the appeal site',
  title:
    'Is the appeal site in or near a conservation area? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'conservation-area',
  emptyError: 'Select yes if the appeal site is in or near a conservation area',
};

Before(() => {
  cy.wrap(page).as('page');
});
