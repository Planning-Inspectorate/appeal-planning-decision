import { Before } from 'cypress-cucumber-preprocessor/steps';

const page = {
  id: 'nearConservationArea',
  heading: 'Is the appeal site in or near a conservation area?',
  section: 'About the Appeal Site',
  title:
    'Is the appeal site in or near a conservation area? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'conservation-area',
  emptyError: 'Select yes it the appeal site is in or near a conservation area',
};

Before(() => {
  cy.wrap(page).as('page');
});
