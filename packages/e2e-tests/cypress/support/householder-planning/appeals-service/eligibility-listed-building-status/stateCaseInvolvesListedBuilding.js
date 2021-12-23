import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const stateCaseInvolvesListedBuilding = () => {
  //cy.visit('/eligibility/listed-building');
  goToAppealsPage(pageURLAppeal.goToListedBuildingPage);

  cy.get('#is-your-appeal-about-a-listed-building').click();

  clickSaveAndContinue();
};
