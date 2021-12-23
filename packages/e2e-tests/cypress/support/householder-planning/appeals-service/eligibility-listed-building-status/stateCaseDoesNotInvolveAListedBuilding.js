import { clickSaveAndContinue } from '../appeal-navigation/clickSaveAndContinue';
import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const stateCaseDoesNotInvolveAListedBuilding = () => {
  //cy.visit('/eligibility/listed-building');
  goToAppealsPage(pageURLAppeal.goToListedBuildingPage);

  cy.get('#is-your-appeal-about-a-listed-building-2').click();

  clickSaveAndContinue();
};
