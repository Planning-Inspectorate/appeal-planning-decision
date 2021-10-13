import { Before } from 'cypress-cucumber-preprocessor/steps';

const page = {
  id: 'listedBuilding',
  heading: "Would the development affect the setting of a listed building?",
  section: 'About the appeal site',
  title:
    "Would the development affect the setting of a listed building? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK",
  url: 'listed-building',
  emptyError: 'Select yes if the development affects the setting of a listed building',
  textEmptyError: "Enter the details for the listed building",
  textChildOf: 'Yes',
  textMock:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. listedBuilding.',
};

Before(() => {
  cy.wrap(page).as('page');
});
