import { Before } from 'cypress-cucumber-preprocessor/steps';
import { completeAppeal } from '../../../../support/householder-planning/lpa-questionnaire/completeAppeal';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';



const page = {
  id: 'accessNeighboursLand',
  heading: "Would the Inspector need access to a neighbour's land?",
  section: 'About the appeal site',
  title:
    "Would the Inspector need access to a neighbour's land? - Appeal questionnaire - Appeal a householder planning decision - GOV.UK",
  url: 'neighbours-land',
  emptyError: 'Select yes if the Inspector needs access to a neighbour’s land',
  textEmptyError: "Enter the reasons the Inspector would need to enter a neighbour's land",
  textChildOf: 'Yes',
  textMock:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. accessNeighboursLand.',
};

Before(() => {
  cy.wrap(page).as('page');
});

Given('an appeal has been created for Access neighbours land',()=>{
  completeAppeal();
    goToLPAPage(page.url);
})
