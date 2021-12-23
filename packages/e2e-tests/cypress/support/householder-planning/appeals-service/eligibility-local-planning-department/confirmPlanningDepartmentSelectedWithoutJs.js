import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../integration/common/householder-planning/appeals-service/pageURLAppeal';

export const confirmPlanningDepartmentSelectedWithoutJs = (planningDepartment) => {
  goToAppealsPage(pageURLAppeal.goToPlanningDepartmentPageWithoutJs);
  cy.get('[data-cy="local-planning-department"]').should('have.value', planningDepartment);

  goToAppealsPage(pageURLAppeal.goToCheckYourAnswersPage);
  cy.get('[data-cy="local-planning-department"]').first().should('contain', planningDepartment);
};
